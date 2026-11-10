import { useEffect, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, ArrowUp, Clock, MessageSquarePlus, Sparkles } from 'lucide-react'

import { AppShell } from '@/components/AppShell'
import { ModeIcon } from '@/components/ModeIcon'
import { LearningStats } from '@/components/LearningStats'
import { modes } from '@/lib/modes'
import { timeAgo, useConversations } from '@/lib/history'

export const Route = createFileRoute('/dashboard')({
  head: () => ({ meta: [{ title: 'Dashboard — NEXUS AI' }] }),
  component: Dashboard,
})

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

function Dashboard() {
  const conversations = useConversations()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [hello, setHello] = useState('Welcome back')
  useEffect(() => setHello(greeting()), [])

  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <div className="relative">
          <div className="bg-grid pointer-events-none absolute inset-0 h-80" />
          <div className="pointer-events-none absolute -top-24 left-1/3 h-72 w-[36rem] rounded-full bg-cyan-500/15 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-8 sm:pt-12">
            {/* welcome */}
            <section className="animate-fade-up">
              <p className="text-sm font-medium text-cyan-300">{hello} 👋</p>
              <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
                Ready to <span className="text-gradient">solve something</span> today?
              </h1>
              <p className="mt-2 max-w-xl text-slate-400">
                Ask a question, pick a specialist mode, or continue where you left off. NEXUS walks you through every step so you learn the method — not just the answer.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!q.trim()) return
                  void navigate({ to: '/chat', search: { mode: 'homework', q: q.trim() } })
                }}
                className="glass mt-6 flex max-w-3xl items-center gap-2 rounded-2xl p-2 transition focus-within:border-cyan-400/40"
              >
                <Sparkles className="ml-3 h-5 w-5 shrink-0 text-cyan-300" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Ask a homework question"
                  placeholder="Paste a homework question to solve it step by step…"
                  className="min-w-0 flex-1 bg-transparent px-2 py-3 text-[15px] text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button type="submit" disabled={!q.trim()} aria-label="Solve" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-ink-950 transition hover:brightness-110 disabled:opacity-30">
                  <ArrowUp className="h-5 w-5" />
                </button>
              </form>
            </section>

            {/* modes */}
            <section className="mt-12">
              <div className="flex items-end justify-between">
                <h2 className="font-display text-lg font-semibold text-white">Specialist modes</h2>
                <Link to="/chat" search={{ n: Date.now() }} className="flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200">
                  <MessageSquarePlus className="h-4 w-4" /> New Chat
                </Link>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modes.map((m, i) => (
                  <Link
                    key={m.id}
                    to="/chat"
                    search={{ mode: m.id }}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="glass group relative animate-fade-up overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_20px_50px_-20px_rgb(34_211_238/0.45)]"
                  >
                    <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${m.accent} opacity-10 blur-2xl transition group-hover:opacity-30`} />
                    <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${m.accent} text-ink-950 shadow-lg`}>
                      <ModeIcon mode={m.id} className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display font-semibold text-white">{m.name}</h3>
                    <p className="text-xs font-medium uppercase tracking-wider text-cyan-300/80">{m.tagline}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{m.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-300 opacity-80 transition group-hover:gap-2 group-hover:opacity-100">
                      Open <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <div className="mt-12 grid gap-6 lg:grid-cols-5">
              {/* recent */}
              <section className="lg:col-span-3">
                <div className="flex items-end justify-between">
                  <h2 className="font-display text-lg font-semibold text-white">Recent conversations</h2>
                  {conversations.length > 0 && (
                    <Link to="/history" className="text-sm text-cyan-300 hover:text-cyan-200">View all</Link>
                  )}
                </div>
                <div className="glass mt-4 divide-y divide-cyan-400/10 overflow-hidden rounded-2xl">
                  {conversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <Clock className="mx-auto h-8 w-8 text-slate-600" />
                      <p className="mt-3 text-sm text-slate-400">No conversations yet. Your chats are saved here automatically.</p>
                      <Link to="/chat" search={{ mode: 'math' }} className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/10">
                        Try the Maths Solver <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    conversations.slice(0, 6).map((c) => (
                      <Link key={c.id} to="/chat" search={{ c: c.id, mode: c.mode }} className="flex items-center gap-4 px-5 py-4 transition hover:bg-cyan-400/5">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-700 text-cyan-300">
                          <ModeIcon mode={c.mode} className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-100">{c.title}</p>
                          <p className="text-xs text-slate-500">
                            {c.messages.length} messages · {timeAgo(c.updatedAt)}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-600" />
                      </Link>
                    ))
                  )}
                </div>
              </section>

              {/* learning snapshot */}
              <section className="lg:col-span-2">
                <h2 className="font-display text-lg font-semibold text-white">Learning history</h2>
                <div className="mt-4">
                  <LearningStats conversations={conversations} compact />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
