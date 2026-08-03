/**
 * RAG Engine — Hybrid Search with Reranker + Streaming Generation
 * 
 * Architecture:
 *   1. Query Embedding  → all-MiniLM-L6-v2 (384-dim, loaded lazily, cached)
 *   2. Vector Search     → Cosine similarity on pre-computed embeddings
 *   3. BM25 Search       → Keyword/term-frequency scoring
 *   4. Reranker          → Multi-signal weighted scorer (replaces RRF)
 *   5. Generation        → OpenRouter API (Gemma 3) with SSE streaming
 */

import embeddingsData from '../../data/resumeEmbeddings.json';

// ──────────────────────────────────────────────
// 1. EMBEDDING — Lazy-loaded Transformers.js
// ──────────────────────────────────────────────

let embedder = null;
let modelLoadingPromise = null;

async function loadEmbedder() {
  if (embedder) return embedder;
  if (modelLoadingPromise) return modelLoadingPromise;

  modelLoadingPromise = (async () => {
    const { pipeline } = await import('@huggingface/transformers');
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'fp32',
    });
    return embedder;
  })();

  return modelLoadingPromise;
}

async function embedQuery(query) {
  const model = await loadEmbedder();
  const output = await model(query, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}


// ──────────────────────────────────────────────
// 2. VECTOR SEARCH — Cosine Similarity
// ──────────────────────────────────────────────

function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-8);
}

function vectorSearch(queryEmbedding, chunks, topK = 6) {
  return chunks
    .map(chunk => ({
      ...chunk,
      vectorScore: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.vectorScore - a.vectorScore)
    .slice(0, topK);
}


// ──────────────────────────────────────────────
// 3. STREAMING GENERATION — OpenRouter + Gemma 3
// ──────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Vijay Durgasi's highly intelligent AI portfolio assistant. Your goal is to accurately understand the user's intent and answer based ONLY on the provided context.

Critical Rules:
1. Intent Parsing - Projects:
   - If the user asks a GENERAL question like "What projects did Vijay build?" or "List his projects": ONLY output a clean bulleted list of the project names. Do not explain them in depth.
   - If the user asks about a SPECIFIC project (e.g., "Explain the PrintFlow project" or "Tell me about X"): Provide a detailed explanation, including features and technologies used.
2. Conciseness: Keep general answers between 5 - 8 sentences unless listing items. Be direct and avoid fluff.
3. Strict Context: If the context doesn't contain the answer, politely say "I don't have specific information about that. You can ask me about Vijay's projects, skills, experience, or contact details."
4. Tone: Refer to Vijay in the third person ("He", "Vijay"). Be professional, friendly, and use markdown (bolding, lists) to make responses easy to read.
5. No Hallucinations: NEVER make up information, links, or projects that are not in the context.`;

export async function* streamGeneration(query, contextChunks) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    yield 'API key is not configured. Please set VITE_OPENROUTER_API_KEY.';
    return;
  }

  const context = contextChunks
    .map((c, i) => `[Source ${i + 1} — ${c.section}]\n${c.content}`)
    .join('\n\n---\n\n');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Vijay Portfolio AI Assistant',
    },
    body: JSON.stringify({
      model: 'google/gemma-3-27b-it',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Context:\n${context}\n\n---\n\nQuestion: ${query}\n\nAnswer concisely using the context above.`,
        },
      ],
      stream: true,
      max_tokens: 1500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    yield `Error: ${response.status} — ${err}`;
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;

      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // Skip malformed JSON chunks
      }
    }
  }
}


// ──────────────────────────────────────────────
// 7. MAIN RAG PIPELINE — Public API
// ──────────────────────────────────────────────

/**
 * Execute the full RAG pipeline:
 *   Embed query → Semantic search → Stream LLM response
 *
 * @param {string} query - User's question
 * @param {function} onChunk - Called with each text chunk as it streams
 * @param {function} onStatus - Called with status updates ("embedding", "retrieving", "generating")
 * @returns {Promise<void>}
 */
export async function queryRAG(query, onChunk, onStatus) {
  try {
    // Step 1: Embed the query
    onStatus?.('loading-model');
    const queryEmbedding = await embedQuery(query);

    // Step 2: Semantic retrieval
    onStatus?.('retrieving');
    // Using topK = 15 to pass a massive context window so the LLM sees ALL projects
    const topChunks = vectorSearch(queryEmbedding, embeddingsData, 15);

    if (topChunks.length === 0) {
      onChunk("I couldn't find relevant information. Try asking about Vijay's projects, skills, or experience.");
      onStatus?.('done');
      return;
    }

    // Step 3: Stream LLM generation
    onStatus?.('generating');
    for await (const chunk of streamGeneration(query, topChunks)) {
      onChunk(chunk);
    }

    onStatus?.('done');
  } catch (error) {
    console.error('RAG pipeline error:', error);
    onChunk(`Sorry, something went wrong. Please try again. (${error.message})`);
    onStatus?.('done');
  }
}

/**
 * Pre-warm the embedding model (call on chat open)
 */
export async function preloadModel() {
  try {
    await loadEmbedder();
    return true;
  } catch (e) {
    console.error('Failed to preload embedding model:', e);
    return false;
  }
}
