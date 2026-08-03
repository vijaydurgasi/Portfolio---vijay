# Vijay Durgasi — Portfolio

A modern, responsive portfolio website with an **Advanced RAG-powered AI Assistant** that answers questions about my resume, skills, and projects in real-time.

**Live:** [vijaydurgasi-portfolio.vercel.app](https://vijaydurgasi-portfolio.vercel.app)

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 7, Tailwind CSS |
| **AI / RAG** | Hybrid Search, Reranker, Streaming LLM |
| **LLM Provider** | OpenRouter API → Google Gemma 3 27B |
| **Embedding** | all-MiniLM-L6-v2 via @huggingface/transformers |
| **Deployment** | Vercel |

---

## RAG Architecture — Reference Guide

### Overview

The AI assistant uses a full **Retrieval-Augmented Generation (RAG)** pipeline with **hybrid search** and a **multi-signal reranker** to answer questions grounded in resume data.

```
User Query → Embed Query → [Vector Search + BM25] → Reranker → Top 3 Chunks → LLM (Streaming) → Word-by-word UI
```

### Chunking

| Parameter | Value |
|---|---|
| **Chunking Strategy** | Semantic section-based (manual) |
| **Chunk Size** | ~200–400 tokens per chunk |
| **Total Chunks** | 15 |
| **Sections** | Overview, Skills (Frontend/Backend/AI/Tools), Projects (7), Services, Contact, Experience |
| **Overlap** | Section headers prepended to each chunk for context |

Each chunk represents a coherent resume section (e.g., a single project, a skill category). This preserves semantic boundaries — no splitting mid-sentence or mid-section.

### Embedding Model

| Parameter | Value |
|---|---|
| **Model** | `all-MiniLM-L6-v2` (Sentence Transformers) |
| **Library** | `@huggingface/transformers` (Transformers.js) |
| **Vector Dimensions** | 384 |
| **Precision** | fp32 |
| **Pre-computed** | Yes — embeddings generated at build time via `scripts/generateEmbeddings.mjs` |
| **Runtime Embedding** | Same model loaded lazily in-browser for query embedding (cached after first load) |

### Vector Database

| Parameter | Value |
|---|---|
| **Type** | In-browser vector store (no external DB) |
| **Storage** | Pre-computed embeddings shipped as `src/data/resumeEmbeddings.json` (172 KB) |
| **Search** | Cosine similarity |
| **Top-K (initial)** | 6 candidates from vector search |

No server or external vector DB needed — embeddings are bundled with the app. This means zero infrastructure cost and instant deployment to Vercel.

### Hybrid Search

Two retrieval methods run in parallel, then results are merged:

| Method | How It Works |
|---|---|
| **Vector Search** | Embeds the user query with all-MiniLM-L6-v2, computes cosine similarity against all 15 chunk embeddings, returns top 6 |
| **BM25 (Keyword Search)** | Tokenizes query and chunks, computes BM25 scores with IDF weighting and stopword removal, returns top 6 |

Candidates from both methods are deduplicated and passed to the reranker.

### Reranker (Multi-Signal Weighted Scorer)

Instead of simple RRF (Reciprocal Rank Fusion), a **multi-signal reranker** scores each candidate using 6 weighted signals:

| Signal | Weight | Description |
|---|---|---|
| **Semantic Score** | 0.30 | Cosine similarity from vector search |
| **BM25 Score** | 0.25 | Keyword relevance from BM25 |
| **Term Coverage** | 0.20 | % of query terms found in the chunk |
| **Keyword Overlap** | 0.10 | Match against chunk's explicit keyword tags |
| **Section Relevance** | 0.10 | Query intent → section mapping (e.g., "projects" boosts Project chunks) |
| **Phrase Match** | 0.05 | Exact phrase match bonus |

After scoring, candidates are sorted by final score and the **top 3 chunks** are sent to the LLM.

### LLM Generation (Streaming)

| Parameter | Value |
|---|---|
| **Provider** | OpenRouter API |
| **Model** | `google/gemma-3-27b-it` (Gemma 3 27B Instruct) |
| **Streaming** | SSE (Server-Sent Events) → word-by-word rendering |
| **Max Tokens** | 300 (output limit) |
| **Temperature** | 0.3 (focused, low randomness) |
| **System Prompt** | "Answer in 2-4 sentences. Be concise. Only use provided context. Do NOT hallucinate." |

### Output Limiting

Two layers of output control:
1. **`max_tokens: 300`** — hard cap on LLM output length
2. **System prompt** — instructs the model to answer in 2-4 sentences

### Data Flow Diagram

```
┌─────────────┐
│  User Query  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Embed Query      │  ← all-MiniLM-L6-v2 (384-dim)
│  (Transformers.js)│
└──────┬───────────┘
       │
       ├──────────────────────┐
       ▼                      ▼
┌──────────────┐     ┌──────────────┐
│ Vector Search │     │ BM25 Search  │
│ (Cosine Sim)  │     │ (Keyword)    │
│ Top 6         │     │ Top 6        │
└──────┬────────┘     └──────┬───────┘
       │                      │
       └──────────┬───────────┘
                  ▼
        ┌──────────────────┐
        │    Reranker       │  ← 6 weighted signals
        │  (Multi-Signal)   │
        │    Top 3          │
        └────────┬─────────┘
                 ▼
        ┌──────────────────┐
        │  Gemma 3 27B     │  ← OpenRouter API
        │  (Streaming SSE)  │
        │  max_tokens: 300  │
        └────────┬─────────┘
                 ▼
        ┌──────────────────┐
        │  Word-by-word    │
        │  UI Rendering    │
        └──────────────────┘
```

---

## Project Structure (RAG-related files)

```
src/
├── data/
│   ├── resumeData.js            # 15 semantic resume chunks with keywords
│   └── resumeEmbeddings.json    # Pre-computed 384-dim embeddings (172 KB)
├── Components/
│   └── ai/
│       ├── AIAssistant.jsx      # Chat UI with streaming + status indicators
│       ├── ragEngine.js         # Full RAG pipeline (embed → search → rerank → stream)
│       ├── intents.jsx          # Suggested questions
│       └── greetings.jsx        # Greeting/farewell detection (no API call)
scripts/
└── generateEmbeddings.mjs       # Build script to pre-compute embeddings
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Generate embeddings (one-time, or after updating resume data)
npm run generate-embeddings

# Start dev server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **In-browser vector store** instead of Pinecone/Weaviate | Zero infrastructure, free, deploys to Vercel as static site |
| **Pre-computed embeddings** instead of runtime-only | No embedding cost per query on first retrieval pass |
| **Semantic chunking** instead of fixed-size | Preserves context boundaries (a project stays in one chunk) |
| **Reranker** instead of RRF | Multi-signal scoring is more accurate for small, focused corpora |
| **Streaming SSE** instead of batch response | Better UX — user sees response building word by word |
| **Greetings handled locally** | No API call wasted on "hello" / "bye" messages |

---

## License

MIT
