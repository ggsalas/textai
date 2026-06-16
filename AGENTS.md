# AGENTS.md — TextAI

## Project Overview

TextAI is a PWA that runs 100% in the browser. It provides local semantic document search (RAG) with zero backend and full privacy. Documents never leave the user's device.

Users organize documents into **Libraries**. Each library is an independent collection with its own documents, chunks, embeddings, and vector search index.

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| UI | React | 19.x |
| Bundler | Vite | 8.x (Rolldown) |
| Styles | Tailwind CSS | 4.x (CSS-first, no tailwind.config.js) |
| Router | React Router | 7.x (single package, replaces react-router-dom) |
| State | Zustand | 5.x (global state minimum) |
| Persistence | Dexie.js | 4.x (IndexedDB wrapper) |
| Vector Search | Orama | 3.x |
| Embeddings | @huggingface/transformers | 4.x |
| PDF Parsing | pdfjs-dist | 6.x |
| DOCX Parsing | mammoth | 1.x |
| Worker Comms | Comlink | 4.x |
| Testing | Vitest | 4.x |
| PWA | vite-plugin-pwa | 1.x |
| Language | TypeScript | 5.x (strict mode) |

## Directory Structure

```
src/
├── routes/          # Pages and loaders (React Router)
├── components/      # React components (ui/, libraries/, documents/, search/)
├── services/        # Business logic (NO React dependency)
├── workers/         # Web Workers (embedding, parsing)
├── store/           # Zustand global state
├── hooks/           # Custom React hooks
├── lib/             # Pure utilities and constants
└── types/           # Shared TypeScript types
```

## Architecture Rules (MUST follow)

### Dependency Direction

```
types → lib → services/workers → store/hooks → components → routes
```

Never import against this direction. If you need to, refactor instead.

### Layer Rules

1. **`services/`** MUST NOT import from `react`, `components/`, `hooks/`, or `store/`.
   Services are pure TypeScript. They receive all needed data as parameters.

2. **`workers/`** run in a separate thread. They MUST NOT import from `services/`, `components/`, `hooks/`, or `store/`. They can only import from `types/` and external libraries.

3. **`components/`** MUST NOT import from `services/` directly. Use `hooks/` to connect components to business logic.

4. **`routes/`** can import from `components/`, `hooks/`, and `services/` (only in loaders/actions).

5. **`store/`** (Zustand) holds ONLY cross-route state:
   - `modelStatus` (embedding model loading state)
   - `processingQueue` (documents being processed)
   - `stats` (global statistics)
   
   The current `libraryId` is derived from route params (`useParams()`), NOT stored in Zustand.

### Library Scoping

- Every document and chunk belongs to a `libraryId`.
- Services that operate on documents/chunks receive `libraryId` as a parameter.
- Orama maintains a `Map<libraryId, OramaDB>` — one index per library.
- There is NO cross-library search.

## Routing

```
/                                    → redirect to /libraries
/libraries                           → Library list
/libraries/:libraryId                → redirect to documents
/libraries/:libraryId/documents      → Documents view (scoped to library)
/libraries/:libraryId/search         → Search view (scoped to library)
```

## Data Model

```
Library (1)
  └── Document (N)
        └── Chunk (N)
              └── Embedding (number[], stored in chunk)
```

**Dexie** (IndexedDB) is the source of truth for all data.
**Orama** is a derived in-memory vector index, rebuilt lazily when entering a library.

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| React component | `PascalCase.tsx` | `DropZone.tsx` |
| Service | `kebab-case.service.ts` | `chunking.service.ts` |
| Hook | `camelCase.ts` with `use` prefix | `useDocuments.ts` |
| Type file | `kebab-case.ts` | `document.ts` |
| Test | `*.test.ts` or `*.test.tsx` | `chunking.service.test.ts` |
| Worker | `kebab-case.worker.ts` | `embedding.worker.ts` |
| Loader | `kebab-case.loader.ts` | `documents.loader.ts` |
| Store | `kebab-case.store.ts` | `app.store.ts` |

## Testing

- Tests are **co-located** with source files (NOT in a separate `tests/` folder).
- Use Vitest.
- Priority: test services first (pure business logic).
- Mock Web Workers in tests.
- Use `fake-indexeddb` for Dexie tests.

## Code Style

- TypeScript strict mode enabled.
- Use `export type` for type-only exports.
- Prefer named exports over default exports.
- Use `@/` path alias for imports from `src/`.
- All services use `async/await` (no `.then()` chains).
- Tailwind CSS v4: styles configured via CSS (`@import "tailwindcss"`), NO `tailwind.config.js`.

## Key Patterns

### Services receive libraryId, they don't know the current route:
```ts
// ✅ Correct
async function search(query: string, libraryId: string, topK?: number): Promise<SearchResult[]>

// ❌ Wrong — services must not access router
async function search(query: string): Promise<SearchResult[]> {
  const libraryId = getCurrentRoute().params.libraryId // NEVER do this
}
```

### Workers are accessed via Comlink proxies:
```ts
// worker-api.ts
import { wrap, type Remote } from 'comlink'

let parserWorker: Remote<ParserWorkerAPI> | null = null

export function getParserWorker(): Remote<ParserWorkerAPI> {
  if (!parserWorker) {
    const worker = new Worker(
      new URL('./parser.worker.ts', import.meta.url),
      { type: 'module' }
    )
    parserWorker = wrap<ParserWorkerAPI>(worker)
  }
  return parserWorker
}
```

### Orama is a derived index, not the source of truth:
```ts
// Source of truth: Dexie
await persistenceService.saveChunks(chunks)

// Derived index: Orama (can be rebuilt anytime from Dexie data)
await vectorStore.insertChunks(libraryId, chunks)
```

### Loaders fetch data before rendering:
```ts
// documents.loader.ts
export async function loader({ params }: LoaderFunctionArgs) {
  const documents = await persistenceService.getDocuments(params.libraryId!)
  return { documents }
}

// documents.tsx
function DocumentsPage() {
  const { documents } = useLoaderData<typeof loader>()
  return <DocumentList documents={documents} />
}
```

## What NOT to Do

- ❌ Do NOT install `react-router-dom` — use `react-router` (v7 single package)
- ❌ Do NOT create `tailwind.config.js` — Tailwind v4 uses CSS-first config
- ❌ Do NOT import services directly in components — use hooks
- ❌ Do NOT store `libraryId` in Zustand — derive from route params
- ❌ Do NOT put tests in a separate `tests/` folder — co-locate them
- ❌ Do NOT use `@xenova/transformers` — use `@huggingface/transformers`
- ❌ Do NOT access IndexedDB directly — use Dexie
- ❌ Do NOT access Orama from components — go through services
