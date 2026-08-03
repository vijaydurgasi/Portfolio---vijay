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
// 3. BM25 SEARCH — Keyword Relevance
// ──────────────────────────────────────────────

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

// Stopwords to ignore in BM25
const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
  'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'if', 'or', 'and', 'but',
  'because', 'until', 'while', 'about', 'what', 'which', 'who', 'whom',
  'this', 'that', 'these', 'those', 'it', 'its', 'he', 'him', 'his',
  'she', 'her', 'we', 'they', 'them', 'my', 'your', 'our', 'me', 'i',
  'you', 'us', 'up'
]);

function tokenizeForBM25(text) {
  return tokenize(text).filter(t => !STOPWORDS.has(t));
}

function bm25Search(query, chunks, topK = 6) {
  const queryTerms = tokenizeForBM25(query);
  if (queryTerms.length === 0) return [];

  // BM25 parameters
  const k1 = 1.5;
  const b = 0.75;
  const N = chunks.length;

  // Compute average document length
  const docLengths = chunks.map(c => tokenize(c.content).length);
  const avgDL = docLengths.reduce((a, b) => a + b, 0) / N;

  // Document frequency for each query term
  const df = {};
  queryTerms.forEach(term => {
    df[term] = chunks.filter(c => {
      const tokens = tokenize(c.content + ' ' + c.keywords.join(' '));
      return tokens.includes(term);
    }).length;
  });

  return chunks.map((chunk, idx) => {
    const docTokens = tokenize(chunk.content + ' ' + chunk.keywords.join(' '));
    const dl = docTokens.length;

    let score = 0;
    queryTerms.forEach(term => {
      const tf = docTokens.filter(t => t === term).length;
      const idf = Math.log((N - df[term] + 0.5) / (df[term] + 0.5) + 1);
      const tfNorm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (dl / avgDL)));
      score += idf * tfNorm;
    });

    return { ...chunk, bm25Score: score };
  })
    .sort((a, b) => b.bm25Score - a.bm25Score)
    .slice(0, topK);
}


// ──────────────────────────────────────────────
// 4. RERANKER — Multi-Signal Weighted Scorer
// ──────────────────────────────────────────────

// Section relevance mapping: query keywords → section boost
const SECTION_MAP = {
  'project': 'Projects', 'projects': 'Projects', 'built': 'Projects', 'portfolio': 'Projects',
  'skill': 'Skills', 'skills': 'Skills', 'tech': 'Skills', 'stack': 'Skills', 'technologies': 'Skills', 'know': 'Skills', 'language': 'Skills',
  'contact': 'Contact', 'email': 'Contact', 'hire': 'Contact', 'reach': 'Contact', 'linkedin': 'Contact', 'github': 'Contact',
  'service': 'Services', 'services': 'Services', 'offer': 'Services', 'freelance': 'Services',
  'experience': 'Experience', 'production': 'Experience', 'capable': 'Experience', 'professional': 'Experience', 'work': 'Experience',
  'about': 'Overview', 'who': 'Overview', 'introduction': 'Overview',
  'frontend': 'Skills', 'backend': 'Skills', 'react': 'Skills', 'node': 'Skills', 'python': 'Skills',
  'ai': 'Skills', 'llm': 'Skills', 'rag': 'Skills', 'agent': 'Skills',
};

function computeSectionRelevance(query, chunkSection) {
  const queryTerms = tokenize(query);
  let matchCount = 0;
  queryTerms.forEach(term => {
    if (SECTION_MAP[term] === chunkSection) matchCount++;
  });
  return Math.min(matchCount / Math.max(queryTerms.length, 1), 1);
}

function computeTermCoverage(queryTerms, chunkContent) {
  const chunkTokens = new Set(tokenize(chunkContent));
  const matches = queryTerms.filter(t => chunkTokens.has(t));
  return matches.length / Math.max(queryTerms.length, 1);
}

function normalize(scores) {
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min || 1;
  return scores.map(s => (s - min) / range);
}

function rerank(query, candidates) {
  if (candidates.length === 0) return [];

  const queryTerms = tokenizeForBM25(query);

  // Normalize vector and BM25 scores across candidates
  const vectorScores = normalize(candidates.map(c => c.vectorScore || 0));
  const bm25Scores = normalize(candidates.map(c => c.bm25Score || 0));

  return candidates.map((candidate, idx) => {
    const termCoverage = computeTermCoverage(queryTerms, candidate.content);
    const sectionRelevance = computeSectionRelevance(query, candidate.section);
    const phraseMatch = query.length > 3 &&
      candidate.content.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;

    // Keyword match against chunk's explicit keywords array
    const keywordOverlap = candidate.keywords
      ? queryTerms.filter(t => candidate.keywords.some(k => k.toLowerCase().includes(t))).length /
        Math.max(queryTerms.length, 1)
      : 0;

    // Weighted combination — semantic gets highest weight
    const finalScore =
      0.30 * vectorScores[idx] +     // Semantic relevance
      0.25 * bm25Scores[idx] +       // Keyword relevance
      0.20 * termCoverage +           // Query term coverage in doc
      0.10 * keywordOverlap +         // Explicit keyword match
      0.10 * sectionRelevance +       // Section-level relevance
      0.05 * phraseMatch;             // Exact phrase bonus

    return { ...candidate, finalScore };
  })
    .sort((a, b) => b.finalScore - a.finalScore);
}


// ──────────────────────────────────────────────
// 5. HYBRID SEARCH — Vector + BM25 → Reranker
// ──────────────────────────────────────────────

function hybridSearch(query, queryEmbedding, topK = 3) {
  // Stage 1: Get candidates from both retrieval methods
  const vectorResults = vectorSearch(queryEmbedding, embeddingsData, 6);
  const bm25Results = bm25Search(query, embeddingsData, 6);

  // Stage 2: Merge unique candidates
  const seen = new Set();
  const allCandidates = [];

  [...vectorResults, ...bm25Results].forEach(result => {
    if (!seen.has(result.id)) {
      seen.add(result.id);
      // Find the corresponding scores from each method
      const vr = vectorResults.find(v => v.id === result.id);
      const br = bm25Results.find(b => b.id === result.id);
      allCandidates.push({
        ...result,
        vectorScore: vr?.vectorScore || 0,
        bm25Score: br?.bm25Score || 0,
      });
    }
  });

  // Stage 3: Rerank with multi-signal scorer
  const reranked = rerank(query, allCandidates);

  return reranked.slice(0, topK);
}


// ──────────────────────────────────────────────
// 6. STREAMING GENERATION — OpenRouter + Gemma 3
// ──────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Vijay Durgasi's AI portfolio assistant. Answer questions about Vijay based ONLY on the provided context.

Rules:
- Answer in 2-4 sentences. Be concise and direct.
- Only use information from the provided context.
- If the context doesn't contain relevant information, say "I don't have specific information about that. You can ask me about Vijay's projects, skills, experience, or contact details."
- Refer to Vijay in third person.
- Use a professional but friendly tone.
- Use markdown formatting (bold, lists) when it improves readability.
- Do NOT make up or hallucinate information not in the context.`;

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
      max_tokens: 300,
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
 *   Embed query → Hybrid search → Rerank → Stream LLM response
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

    // Step 2: Hybrid retrieval + reranking
    onStatus?.('retrieving');
    const topChunks = hybridSearch(query, queryEmbedding, 3);

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
