import { Flame, MessageCircleQuestion, Layers } from 'lucide-react'
import type { Conversation } from '@/lib/history'
import { allModes } from '@/lib/modes'
import { ModeIcon } from './ModeIcon'

const DAY = 86_400_000

function startOfDay(ts: number) {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function computeStats(conversations: Conversation[]) {
  const questions = conversations.reduce(
    (n, c) => n + c.messages.filter((m) => m.role === 'user').length,
    0,
  )
  const byMode = allModes
    .map((m) => ({ mode: m, count: conversations.filter((c) => c.mode === m.id).length }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)

  const today = startOfDay(Date.now())
  const activeDays = new Set(conversations.map((c) => startOfDay(c.updatedAt)))
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = today - (6 - i) * DAY
    return {
      day,
      label: new Date(day).toLocaleDateString(undefined, { weekday: 'narrow' }),
      count: conversations.filter((c) => startOfDay(c.updatedAt) === day).length,
    }
  })
  let streak = 0
  for (let d = today; activeDays.has(d); d -= DAY) streak++

  return { questions, byMode, week, streak, sessions: conversations.length }
}

export function LearningStats({ conversations, compact = false }: { conversations: Conversation[]; compact?: boolean }) {
  const s = computeStats(conversations)
  const max = Math.max(1, ...s.week.map((w) => w.count))
  const tiles = [
    { label: 'Questions asked', value: s.questions, icon: MessageCircleQuestion },
    { label: 'Sessions', value: s.sessions, icon: Layers },
    { label: 'Day streak', value: s.streak, icon: Flame },
  ]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="glass rounded-2xl p-4">
            <t.icon className="h-4 w-4 text-cyan-300" />
            <p className="mt-2 font-display text-2xl font-bold tabular-nums text-white">{t.value}</p>
            <p className="text-[11px] leading-tight text-slate-400">{t.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Last 7 days</p>
        <div className="mt-4 flex h-24 items-end gap-2" role="img" aria-label={`Sessions over the last 7 days: ${s.week.map((w) => w.count).join(', ')}`}>
          {s.week.map((w) => (
            <div key={w.day} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full flex-1 items-end">
                <div
                  title={`${w.count} session${w.count === 1 ? '' : 's'}`}
                  className={`w-full rounded-md transition-all duration-500 ${w.count ? 'bg-gradient-to-t from-blue-600 to-cyan-300' : 'bg-ink-700'}`}
                  style={{ height: `${w.count ? Math.max(12, (w.count / max) * 100) : 6}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500">{w.label}</span>
            </div>
          ))}
        </div>
      </div>

      {!compact || s.byMode.length > 0 ? (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Subjects explored</p>
          {s.byMode.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Start a chat to build your learning history.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {s.byMode.map(({ mode, count }) => (
                <li key={mode.id} className="flex items-center gap-3 text-sm">
                  <ModeIcon mode={mode.id} className="h-4 w-4 text-cyan-300" />
                  <span className="flex-1 text-slate-300">{mode.name}</span>
                  <span className="tabular-nums text-slate-400">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
