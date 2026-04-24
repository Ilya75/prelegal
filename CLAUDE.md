# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The current implementation has user authentication (signup/signin), a document picker home page, AI-guided chat for all 11 supported document types, and live document preview with PDF download. Document persistence is not yet built.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project is packaged into a Docker container.  
The backend is in `backend/`, a uv project using FastAPI.  
The frontend is in `frontend/`, statically built and served by FastAPI.  
The database uses SQLite, created from scratch each time the Docker container is brought up, with a users table for sign up and sign in.  
Scripts are in `scripts/` for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Implementation status

### PL-3 — Mutual NDA Creator (merged)
Frontend-only prototype: NDA form + live preview + PDF download. No backend, no auth.

### PL-4 — V1 Foundation (merged)
- **Backend**: FastAPI (uv) at `backend/`. Modules: `core/` (config, database, security), `models/user.py`, `api/routes/` (auth, health).
- **Database**: SQLite at `/data/prelegal.db`, dropped and recreated fresh on each container start. Users table: `id`, `email`, `hashed_password`, `created_at`.
- **Auth**: JWT (7-day, HS256 via python-jose), bcrypt hashing (direct bcrypt, no passlib). Endpoints: `POST /api/auth/signup`, `POST /api/auth/signin`, `GET /api/auth/me`. Email and password (min 8 chars) validated in `UserCreate`.
- **Frontend**: Statically exported (`output: 'export'`, `trailingSlash: true`), served by FastAPI `StaticFiles`. Auth pages at `/login` and `/signup`. `AuthContext` + `useAuth` hook in `lib/auth.tsx`. JWT stored in `localStorage`.
- **Docker**: Multi-stage Dockerfile (node builder → python runtime). `docker-compose.yml` with `env_file: .env`.
- **Scripts**: `scripts/start-{mac,linux}.sh`, `scripts/stop-{mac,linux}.sh`, `scripts/start-windows.ps1`, `scripts/stop-windows.ps1` — all wrap `docker compose up --build -d` / `docker compose down`.

### PL-5 — AI Chat for Mutual NDA (merged)
- **Chat endpoint**: `POST /api/chat/message` (auth-protected). Accepts `{messages, fields}` (full conversation history + current NDA field state), calls LiteLLM → OpenRouter → Cerebras (`openrouter/openai/gpt-oss-120b`) with structured output, returns `{reply, fields}`.
- **Backend models**: `backend/app/models/chat.py` — `Message`, `NdaFields` (all fields optional), `ChatRequest`, `ChatResponse`.
- **Backend route**: `backend/app/api/routes/chat.py` — system prompt instructs AI to gather NDA fields conversationally and return JSON only for newly learned fields.
- **Frontend**: `NdaForm` replaced by `AiChat` component (`frontend/components/AiChat.tsx`). Left panel is now a chat UI; on each AI response, non-null field values are merged into `formData`, updating the live preview instantly. Chat history is React state only (in-memory, no persistence). AI opens with a hardcoded greeting — no round-trip on mount. The hardcoded opening message is excluded from API calls (it is a UI artifact, not a real AI turn).
- **Frontend API**: `chatApi.message()` added to `frontend/lib/api.ts`.

### PL-6 — Expand to all supported document types (merged)
- **Home page**: `/` is now a document picker showing all 11 supported document types as cards. Each card navigates to `/document/?type=slug`.
- **Document creator page**: `/document/` (client-side) reads `?type` from URL, fetches template via API, renders `DocumentCreator`.
- **DocumentCreator**: Generic orchestrator (`frontend/components/DocumentCreator.tsx`). Uses `NdaPreview` for `mutual-nda`, `GenericPreview` for all other types.
- **GenericPreview**: (`frontend/components/GenericPreview.tsx`) Shows a key terms section (Provider, Customer, Effective Date, Governing Law, Chosen Courts) + full standard terms body with field substitution.
- **Generic substitution**: `substituteGenericTerms` in `frontend/lib/substitution.ts` handles `coverpage_link`, `keyterms_link` (Provider/Customer/Governing Law/Chosen Courts/Effective Date) and styles `orderform_link` spans as gray placeholders.
- **Backend chat**: `ChatRequest` now has `document_type: str` and generic `fields: dict[str, str | None]`. `backend/app/core/document_configs.py` holds per-document system prompts for all 11 types. All prompts enforce follow-up questions when fields are still missing.
- **Documents API**: `GET /api/documents` returns catalog (minus cover-page sub-component), `GET /api/documents/{slug}/template` returns template markdown. `backend/app/api/routes/documents.py`.
- **Dockerfile**: Copies `templates/` and `catalog.json` to the runtime container so the API can serve them.
- **AiChat**: Now accepts `documentType`, `openingMessage` props; input field auto-focuses after each AI response.
- **Generic fields**: `frontend/lib/types.ts` adds `GenericFormData = Record<string, string>` and `DocumentEntry`. Default generic fields: `providerCompany`, `customerCompany`, `effectiveDate`, `governingLaw`, `chosenCourts`.
- **Unsupported documents**: "Mutual NDA Cover Page" (a sub-component, not a standalone doc) is filtered from the document picker.