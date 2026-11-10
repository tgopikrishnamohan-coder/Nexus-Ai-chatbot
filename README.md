# NEXUS AI

**Intelligent homework & problem-solving assistant.** NEXUS AI helps students solve homework step by step, understand difficult subjects, learn programming, and build independent problem-solving skills — powered by Google Gemini.

## What's in the app
- **Landing page** (`/`) — product overview with a live LaTeX-rendered solution preview.
- **Dashboard** (`/dashboard`) — welcome, quick-ask box, New Chat, six specialist modes, recent conversations, learning snapshot.
- **Chat** (`/chat?mode=…`) — streaming AI tutor with LaTeX maths, syntax-highlighted code with copy buttons, stop/retry, and starter prompts per mode.
- **Learning History** (`/history`) — searchable, filterable list of past conversations with activity stats.

Modes: Homework Solver (8-step structured answers), Mathematics Solver, Programming Assistant, Science Assistant, Logical Reasoning, Study Assistant, plus a general chat.

## Tech
- TanStack Start (React 19, file-based routing, server routes) on Netlify
- Tailwind CSS v4
- TanStack AI + `@tanstack/ai-gemini` (built on the official `@google/genai` SDK), via Netlify AI Gateway
- Streamdown + `@streamdown/math` (KaTeX) + `@streamdown/code` (Shiki)

## Configuration
| Variable | Purpose |
| --- | --- |
| `GEMINI_MODEL` | Gemini model ID (default `gemini-3.5-flash`). `AI_MODEL` is also accepted. |
| `GEMINI_API_KEY` / `GOOGLE_GEMINI_BASE_URL` | Set automatically by Netlify AI Gateway on Netlify. Set `GEMINI_API_KEY` yourself only when running outside Netlify. |

## Run locally
```bash
pnpm install
netlify link        # once, to use AI Gateway credentials
netlify dev         # or: pnpm dev
```

## Roadmap
Conversations are currently saved in the browser. Next up: homework image upload, student accounts, database-backed history, and deeper progress tracking. See [PLAN.md](./PLAN.md).
