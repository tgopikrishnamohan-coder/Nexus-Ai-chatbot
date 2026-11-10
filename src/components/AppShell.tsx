import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { History, LayoutDashboard, Menu, Plus, X } from 'lucide-react'
import { Logo } from './Logo'
import { ModeIcon } from './ModeIcon'
import { modes } from '@/lib/modes'
import { useConversations, timeAgo } from '@/lib/history'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-dvh overflow-hidden bg-ink-950 text-slate-100">
      {/* mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-cyan-400/10 bg-ink-900/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <Logo to="/dashboard" />
          <button className="rounded-lg p-1.5 text-slate-400 hover:text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-cyan-400/10 px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg p-1.5 text-slate-300 hover:bg-white/5" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <Logo to="/dashboard" />
        </header>
        <main className="relative min-h-0 flex-1">{children}</main>
      </div>
    </div>
  )
}

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const conversations = useConversations()
  const location = useRouterState({ select: (s) => s.location })
  const search = location.search as { mode?: string; c?: string }
  const navItem =
    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-cyan-400/5 hover:text-white'
  const active = 'bg-cyan-400/10 text-white shadow-[inset_0_0_0_1px_rgb(34_211_238/0.2)]'

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4">
        <Link
          to="/chat"
          search={{ n: Date.now() }}
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-semibold text-ink-950 shadow-[0_0_24px_-4px_rgb(34_211_238/0.6)] transition hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> New Chat
        </Link>
      </div>

      <nav className="mt-5 space-y-1 px-3">
        <Link to="/dashboard" onClick={onNavigate} className={navItem} activeProps={{ className: active }}>
          <LayoutDashboard className="h-4 w-4 text-cyan-300" /> Dashboard
        </Link>
        <Link to="/history" onClick={onNavigate} className={navItem} activeProps={{ className: active }}>
          <History className="h-4 w-4 text-cyan-300" /> Learning History
        </Link>
      </nav>

      <p className="mt-6 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Modes</p>
      <nav className="mt-2 space-y-0.5 px-3">
        {modes.map((m) => (
          <Link
            key={m.id}
            to="/chat"
            search={{ mode: m.id }}
            onClick={onNavigate}
            className={`${navItem} ${location.pathname === '/chat' && search.mode === m.id && !search.c ? active : ''}`}
          >
            <ModeIcon mode={m.id} className="h-4 w-4 text-cyan-300" /> {m.name}
          </Link>
        ))}
      </nav>

      <p className="mt-6 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Recent</p>
      <div className="mt-2 min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {conversations.length === 0 && (
          <p className="px-3 py-2 text-xs text-slate-500">Your conversations appear here.</p>
        )}
        {conversations.slice(0, 20).map((c) => (
          <Link
            key={c.id}
            to="/chat"
            search={{ c: c.id, mode: c.mode }}
            onClick={onNavigate}
            className={`${navItem} ${search.c === c.id ? active : ''} items-start`}
          >
            <ModeIcon mode={c.mode} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span className="min-w-0 flex-1">
              <span className="block truncate">{c.title}</span>
              <span className="block text-[11px] text-slate-500">{timeAgo(c.updatedAt)}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
