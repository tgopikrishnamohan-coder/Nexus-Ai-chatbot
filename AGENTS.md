# AGENTS.md — NEXUS AI

AI homework tutor built on TanStack Start + Netlify. **Read `PLAN.md` first** — it holds the milestone roadmap; continue from the first unfinished milestone.

## Architecture
- `src/routes/` — file-based routes. `index.tsx` landing, `dashboard.tsx`, `chat.tsx`, `history.tsx`, `api.chat.ts` (POST, SSE stream). `routeTree.gen.ts` is generated — never edit.
- `src/lib/modes.ts` — single source of truth for tutor modes: UI metadata (name, accent, starters) **and** the Gemini system prompts. Shared by client and server. Add a mode here and it appears everywhere.
- `src/lib/chat.server.ts` — validates the AG-UI request (zod), picks the mode prompt from `forwardedProps.mode`, streams from Gemini via `createGeminiChat`. Gemini only; model from `GEMINI_MODEL` → `AI_MODEL` → `DEFAULT_GEMINI_MODEL`. Credentials come from Netlify AI Gateway (`GEMINI_API_KEY`, `GOOGLE_GEMINI_BASE_URL`) — never hardcode keys.
- `src/lib/ai-hook.ts` — `useAIChat({ mode, initialMessages })` wrapper around `@tanstack/ai-react` `useChat`.
- `src/lib/history.ts` — conversation store (localStorage + `useSyncExternalStore`). **This is the stub to swap** for Netlify Database in Milestone 4; keep its exported API.
- `src/components/` — `AppShell` (responsive sidebar), `Logo` (served through Netlify Image CDN, `mix-blend-screen` to drop the black art background), `ModeIcon`, `LearningStats`.

## Conventions
- Tailwind v4; theme tokens (ink palette, fonts, animations, streamdown color tokens) live in `src/styles.css` `@theme`. Dark only (`<html class="dark">`).
- Fonts: Sora (display), Inter (body), JetBrains Mono (code) from Google Fonts.
- Markdown answers render with `<Streamdown plugins={{ code, math }}>` inside `.nexus-prose`. Math uses `$$…$$` (single `$` disabled to avoid currency clashes); `normaliseMath` in `chat.tsx` converts `\(…\)`/`\[…\]`.
- Chat page renders only after hydration because history is client-side.
- Package manager: pnpm. Don't run builds locally; Netlify builds on deploy.

## Non-obvious decisions
- Model ID is cast, not enum-validated, so newer Gemini IDs work via env var without a dependency bump.
- `agentLoopStrategy: maxIterations(1)` — there are no tools yet.
- The dashboard quick-ask passes `?q=` to `/chat`, which auto-sends once and strips the param.
