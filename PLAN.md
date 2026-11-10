# NEXUS AI — Product Roadmap

NEXUS AI is an AI homework and problem-solving tutor for students. The roadmap below breaks the full product into small, self-contained milestones.

## ✅ Milestone 1 — Product surface and live AI tutor (done)
- Branded landing page (`/`), dashboard (`/dashboard`), chat (`/chat`), learning history (`/history`).
- Real Google Gemini chat via `@tanstack/ai-gemini` (official Google Gen AI SDK underneath) through Netlify AI Gateway; model set by `GEMINI_MODEL`.
- Seven tutor modes with dedicated system prompts: General, Homework Solver (8-step format), Mathematics Solver, Programming Assistant, Science Assistant, Logical Reasoning, Study Assistant.
- Streaming Markdown with KaTeX LaTeX, Shiki syntax-highlighted code with copy buttons, copy answer, stop, retry.
- Conversations and learning stats saved in the browser (`src/lib/history.ts`).

## Milestone 2 — Homework image upload
- Attach button in the composer (photo / screenshot / camera on mobile), image preview chips.
- Extend the `/api/chat` request schema to accept image content parts and pass them to Gemini as multimodal input.
- Store uploaded images in Netlify Blobs so past conversations can still show them.

## Milestone 3 — Student accounts
- Netlify Identity sign-up / log-in (email + Google), protected dashboard and history.
- Per-user profile: name, grade level, preferred subjects (used to tune explanations).

## Milestone 4 — Server-side conversation storage
- Netlify Database (Postgres + Drizzle) tables: `conversations`, `messages`.
- Replace the localStorage module in `src/lib/history.ts` with API-backed calls (same function surface), plus one-time import of existing browser history.
- Rename, delete, search conversations server-side.

## Milestone 5 — Learning history and progress
- Track topics per message (have Gemini tag subject/topic), mastery estimates, streaks, and weekly summaries.
- "Revise this" button that turns a past conversation into a quiz.

## Milestone 6 — Deeper tutoring tools
- Practice-question mode: student answers the generated practice question and NEXUS marks it.
- "Check my working" flow with side-by-side mistake highlighting.
- Optional runnable code sandbox for Python/JavaScript examples.
- Hint ladder (hint → bigger hint → full solution) for Logical Reasoning mode.

## Milestone 7 — Polish and safeguards
- Per-user rate limiting on `/api/chat`, abuse protection.
- Export conversation as PDF/Markdown, share links.
- Accessibility audit, analytics, and model selection in settings.
