import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Trash2 } from 'lucide-react'

import { AppShell } from '@/components/AppShell'
import { ModeIcon } from '@/components/ModeIcon'
import { LearningStats } from '@/components/LearningStats'
import { allModes, getMode, type ModeId } from '@/lib/modes'
import { removeConversation, timeAgo, useConversations } from '@/lib/history'

export const Route = createFileRoute('/history')({
  head: () => ({ meta: [{ title: 'Learning History — NEXUS AI' }] }),
  component: HistoryPage,
})

function HistoryPage() {
  const conversations = useConversations()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ModeId | 'all'>('all')

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return conversations.filter(
      (c) => (filter === 'all' || c.mode === filter) && (!q || c.title.toLowerCase().includes(q)),
    )
  }, [conversations, query, filter])

  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-8 sm:pt-12">
          <h1 className="animate-fade-up font-display text-3xl font-bold text-white">Learning History</h1>
          <p className="mt-1 text-slate-400">Every question you have worked through with NEXUS, ready to revisit and revise.</p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="glass flex flex-1 items-center gap-2 rounded-xl px-3">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search conversations"
                    className="w-full bg-transparent py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as ModeId | 'all')}
                  aria-label="Filter by mode"
                  className="glass rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none"
                >
                  <option value="all">All modes</option>
                  {allModes.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="glass mt-4 divide-y divide-cyan-400/10 overflow-hidden rounded-2xl">
                {shown.length === 0 && (
                  <p className="p-8 text-center text-sm text-slate-400">
                    {conversations.length ? 'No conversations match.' : 'Nothing here yet — start a chat and it will appear automatically.'}
                  </p>
                )}
                {shown.map((c) => (
                  <div key={c.id} className="group flex items-center gap-4 px-5 py-4 transition hover:bg-cyan-400/5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-700 text-cyan-300">
                      <ModeIcon mode={c.mode} className="h-4 w-4" />
                    </div>
                    <Link to="/chat" search={{ c: c.id, mode: c.mode }} className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-100 group-hover:text-white">{c.title}</p>
                      <p className="text-xs text-slate-500">
                        {getMode(c.mode).name} · {c.messages.length} messages · {timeAgo(c.updatedAt)}
                      </p>
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Delete this conversation?')) removeConversation(c.id)
                      }}
                      aria-label={`Delete ${c.title}`}
                      className="rounded-lg p-2 text-slate-600 opacity-100 transition hover:bg-rose-500/10 hover:text-rose-300 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
            <aside>
              <LearningStats conversations={conversations} />
            </aside>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
