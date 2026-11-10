import { useEffect, useMemo, useRef, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUp, Check, Copy, RotateCcw, Sparkles, Square } from 'lucide-react'
import { Streamdown } from 'streamdown'
import { code } from '@streamdown/code'
import { createMathPlugin } from '@streamdown/math'

import { AppShell } from '@/components/AppShell'
import { LogoMark } from '@/components/Logo'
import { ModeIcon } from '@/components/ModeIcon'
import { useAIChat, type ChatMessages } from '@/lib/ai-hook'
import { allModes, getMode, type Mode } from '@/lib/modes'
import {
  getConversation,
  messageText,
  newConversationId,
  saveConversation,
} from '@/lib/history'

type ChatSearch = { mode?: string; c?: string; n?: number; q?: string }

export const Route = createFileRoute('/chat')({
  validateSearch: (s: Record<string, unknown>): ChatSearch => ({
    mode: typeof s.mode === 'string' ? s.mode : undefined,
    c: typeof s.c === 'string' ? s.c : undefined,
    n: typeof s.n === 'number' ? s.n : undefined,
    q: typeof s.q === 'string' ? s.q.slice(0, 4000) : undefined,
  }),
  head: () => ({ meta: [{ title: 'Chat — NEXUS AI' }] }),
  component: ChatPage,
})

const math = createMathPlugin({ singleDollarTextMath: false })
const plugins = { code, math }

function ChatPage() {
  const search = Route.useSearch()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  // Conversations live in localStorage, so resolve them on the client only.
  const stored = hydrated && search.c ? getConversation(search.c) : undefined
  const mode = getMode(stored?.mode ?? search.mode)
  const key = `${search.c ?? 'new'}:${mode.id}:${search.n ?? 0}:${hydrated}`

  return (
    <AppShell>
      {hydrated ? (
        <ChatView
          key={key}
          mode={mode}
          conversationId={stored?.id ?? search.c}
          initialMessages={stored?.messages}
          initialQuestion={stored ? undefined : search.q}
        />
      ) : (
        <div className="h-full" />
      )}
    </AppShell>
  )
}

function ChatView({
  mode,
  conversationId,
  initialMessages,
  initialQuestion,
}: {
  mode: Mode
  conversationId?: string
  initialMessages?: ChatMessages
  initialQuestion?: string
}) {
  const navigate = Route.useNavigate()
  const askedRef = useRef(false)
  const [id] = useState(() => conversationId ?? newConversationId())
  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading, stop, error, reload } = useAIChat({
    mode: mode.id,
    initialMessages,
  })
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Persist after each completed turn (and once streaming stops).
  useEffect(() => {
    if (!messages.length || isLoading) return
    saveConversation({ id, mode: mode.id, messages })
  }, [messages, isLoading, id, mode.id])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 240
    if (nearBottom || isLoading) el.scrollTo({ top: el.scrollHeight })
  }, [messages, isLoading])

  useEffect(() => {
    const t = textareaRef.current
    if (!t) return
    t.style.height = 'auto'
    t.style.height = `${Math.min(t.scrollHeight, 220)}px`
  }, [input])

  // A question handed over from the dashboard's quick-ask box.
  useEffect(() => {
    if (askedRef.current || !initialQuestion?.trim()) return
    askedRef.current = true
    void sendMessage(initialQuestion.trim())
    void navigate({ search: (s) => ({ ...s, q: undefined }), replace: true })
  }, [initialQuestion, sendMessage, navigate])

  const send = (text: string) => {
    const value = text.trim()
    if (!value || isLoading) return
    void sendMessage(value)
    setInput('')
  }

  const last = messages[messages.length - 1]
  const waiting = isLoading && (!last || last.role === 'user' || !messageText(last))

  return (
    <div className="relative flex h-full flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgb(34_211_238/0.12),transparent_70%)]" />

      {/* mode header */}
      <div className="relative z-10 flex items-center gap-3 border-b border-cyan-400/10 px-4 py-3 sm:px-6">
        <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${mode.accent} text-ink-950`}>
          <ModeIcon mode={mode.id} className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-sm font-semibold text-white">{mode.name}</h1>
          <p className="truncate text-xs text-slate-400">{mode.tagline}</p>
        </div>
        <ModeSwitcher current={mode} />
      </div>

      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState mode={mode} onPick={send} />
        ) : (
          <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
            {messages.map((m) =>
              m.role === 'user' ? (
                <UserBubble key={m.id} text={messageText(m)} />
              ) : (
                <AssistantMessage
                  key={m.id}
                  text={messageText(m)}
                  streaming={isLoading && m.id === last?.id}
                />
              ),
            )}
            {waiting && <Thinking />}
            {error && (
              <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                <span>{error.message}</span>
                <button onClick={() => void reload()} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-300/30 px-2.5 py-1 text-xs hover:bg-rose-400/10">
                  <RotateCcw className="h-3.5 w-3.5" /> Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* composer */}
      <div className="relative z-10 px-3 pb-4 pt-2 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="glass mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl p-2 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.8)] transition focus-within:border-cyan-400/40 focus-within:shadow-[0_0_0_4px_rgb(34_211_238/0.08)]"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            aria-label="Your question"
            placeholder={mode.placeholder}
            className="max-h-56 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] text-white placeholder:text-slate-500 focus:outline-none"
          />
          {isLoading ? (
            <button type="button" onClick={stop} aria-label="Stop generating" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-400/30 text-cyan-200 transition hover:bg-cyan-400/10">
              <Square className="h-4 w-4 fill-current" />
            </button>
          ) : (
            <button type="submit" aria-label="Send" disabled={!input.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-ink-950 transition hover:brightness-110 active:scale-95 disabled:opacity-30">
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-slate-500">
          NEXUS explains its reasoning so you can learn it — double-check important answers. Shift + Enter for a new line.
        </p>
      </div>
    </div>
  )
}

function ModeSwitcher({ current }: { current: Mode }) {
  return (
    <div className="hidden items-center gap-1 rounded-xl border border-cyan-400/10 bg-ink-900/60 p-1 md:flex">
      {allModes.map((m) => (
        <Link
          key={m.id}
          to="/chat"
          search={{ mode: m.id }}
          title={m.name}
          className={`grid h-8 w-8 place-items-center rounded-lg transition ${m.id === current.id ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
        >
          <ModeIcon mode={m.id} className="h-4 w-4" />
        </Link>
      ))}
    </div>
  )
}

function EmptyState({ mode, onPick }: { mode: Mode; onPick: (q: string) => void }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
      <div className="relative mb-6 animate-float">
        <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-3xl animate-pulse-glow" />
        <LogoMark size={88} className="relative" />
      </div>
      <h2 className="animate-fade-up font-display text-2xl font-semibold text-white sm:text-3xl">
        {mode.id === 'general' ? 'What are we learning today?' : mode.name}
      </h2>
      <p className="mt-2 max-w-lg animate-fade-up text-sm text-slate-400 [animation-delay:80ms]">{mode.description}</p>
      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        {mode.starters.map((q, i) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            style={{ animationDelay: `${140 + i * 60}ms` }}
            className="glass group animate-fade-up rounded-xl p-4 text-left text-sm text-slate-300 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:text-white"
          >
            <Sparkles className="mb-2 h-4 w-4 text-cyan-300 transition group-hover:rotate-12" />
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex animate-fade-up justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-gradient-to-br from-blue-600/80 to-cyan-600/70 px-4 py-3 text-[15px] text-white shadow-[0_8px_30px_-12px_rgb(37_99_235/0.8)]">
        {text}
      </div>
    </div>
  )
}

function AssistantMessage({ text, streaming }: { text: string; streaming: boolean }) {
  const [copied, setCopied] = useState(false)
  const content = useMemo(() => normaliseMath(text), [text])
  if (!text) return null
  return (
    <div className="flex animate-fade-up gap-3">
      <LogoMark size={30} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="nexus-prose">
          <Streamdown
            plugins={plugins}
            shikiTheme={['github-dark', 'github-dark']}
            isAnimating={streaming}
            mode={streaming ? 'streaming' : 'static'}
          >
            {content}
          </Streamdown>
        </div>
        {!streaming && (
          <button
            onClick={() => {
              void navigator.clipboard.writeText(text)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }}
            className="mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-cyan-300" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        )}
      </div>
    </div>
  )
}

function Thinking() {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={30} className="animate-pulse" />
      <div className="flex items-center gap-1.5 rounded-2xl border border-cyan-400/15 bg-ink-850 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
        <span className="ml-2 text-xs text-slate-400">Thinking it through…</span>
      </div>
    </div>
  )
}

/** Models sometimes emit \( \) / \[ \] delimiters — convert them to remark-math's $$ syntax. */
function normaliseMath(md: string) {
  return md
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => `\n$$\n${m.trim()}\n$$\n`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => `$$${m.trim()}$$`)
}
