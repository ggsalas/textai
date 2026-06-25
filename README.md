# RAG

<div align="center">
  <img src="public/icons/icon.svg" alt="RAG logo" width="80" />
  <p><a href="https://ggsalas.github.io/rag/">https://ggsalas.github.io/rag/</a></p>
</div>

A privacy-first PWA for semantic document search that runs 100% in the browser. No backend, no data collection—everything stays on your device.

## How It Works

Documents are organized into **Libraries** — independent collections, each with its own search index.

### 1. Parsing

When a document is uploaded, its text is extracted according to file type:

| Format   | Parser                    | Notes                              |
| -------- | ------------------------- | ---------------------------------- |
| PDF      | pdfjs-dist                | Page metadata preserved for chunks |
| DOCX     | mammoth                   |                                    |
| TXT / MD | Native browser `File.text()` |                               |

Parsing runs in a Web Worker to avoid blocking the UI.

### 2. Chunking & Embedding

The extracted text is split into overlapping chunks by paragraph — each chunk has a configurable size and overlap so context isn't lost at boundaries. Each chunk is then embedded into a vector using a HuggingFace model (`Xenova/all-MiniLM-L6-v2`) running locally via ONNX.

Both chunks and embeddings are persisted in IndexedDB (Dexie) — the source of truth. Orama maintains a derived in-memory vector index per library, rebuilt lazily on first access.

### 3. Hybrid Search

Queries run against Orama using hybrid mode: **semantic** (vector similarity) + **keyword** (BM25). The balance between both modes is adjustable via a slider in the UI.

## Tech Stack

| Layer         | Technology                  |
| ------------- | --------------------------- |
| UI            | React 19                    |
| Build         | Vite 8 (Rolldown)           |
| Router        | React Router 7              |
| Styles        | Tailwind CSS 4              |
| State         | Zustand 5                   |
| Database      | Dexie.js 4 (IndexedDB)      |
| Vector Search | Orama 3                     |
| Embeddings    | @huggingface/transformers 4 |
| Workers       | Comlink 4                   |
| Testing       | Vitest 4                    |
| PWA           | vite-plugin-pwa 1           |

## Development

```bash
npm install
npm run dev
```

```bash
npm test
```

## Architecture

The codebase follows a layered architecture with strict dependency rules. See [AGENTS.md](./AGENTS.md) for details.
