import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, Lightbulb, ListOrdered, ShieldCheck, Sparkles } from 'lucide-react'
import { Streamdown } from 'streamdown'
import { createMathPlugin } from '@streamdown/math'

import { Logo, LogoMark } from '@/components/Logo'
import { ModeIcon } from '@/components/ModeIcon'
import { modes } from '@/lib/modes'

export const Route = createFileRoute('/')({
  component: Landing,
})

const math = createMathPlugin({ singleDollarTextMath: false })

const sample = `### 4. Method
Use the **product rule**: $$\\frac{d}{dx}[uv] = u'v + uv'$$

### 5. Step-by-step
Let $$u = x^3$$ and $$v = \\sin x$$, so $$u' = 3x^2$$ and $$v' = \\cos x$$.

$$
f'(x) = 3x^2\\sin x + x^3\\cos x
$$

### 6. Final answer
$$
\\boxed{f'(x) = x^2\\,(3\\sin x + x\\cos x)}
$$`

const pillars = [
  { icon: ListOrdered, title: 'Every step, explained', text: 'Identify, plan, solve, verify. NEXUS never skips the working that teachers mark you on.' },
  { icon: Lightbulb, title: 'Learn to think', text: 'Logical Reasoning mode breaks problems into patterns, constraints and edge cases so you build real skill.' },
  { icon: CheckCircle2, title: 'Mistake finder', text: 'Paste your own attempt — NEXUS pinpoints the exact line that went wrong and why.' },
  { icon: ShieldCheck, title: 'Honest by design', text: 'When a question is ambiguous or uncertain, NEXUS says so instead of inventing an answer.' },
]

function Landing() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-ink-950 text-slate-100">
      {/* nav */}
      <header className="sticky top-0 z-30 border-b border-cyan-400/10 bg-ink-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#modes" className="transition hover:text-white">Modes</a>
            <a href="#how" className="transition hover:text-white">How it works</a>
            <a href="#why" className="transition hover:text-white">Why NEXUS</a>
          </nav>
          <Link to="/dashboard" className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-ink-950 shadow-[0_0_24px_-4px_rgb(34_211_238/0.6)] transition hover:brightness-110">
            Open NEXUS
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="relative">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-indigo-600/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-8 lg:grid-cols-2 lg:pt-24">
          <div>
            <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-3 py-1 text-xs font-medium text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" /> Powered by Google Gemini
            </span>
            <h1 className="mt-6 animate-fade-up font-display text-4xl font-bold leading-[1.08] tracking-tight text-white [animation-delay:60ms] sm:text-5xl lg:text-6xl">
              Homework help that <span className="text-gradient">teaches you how</span> to solve it.
            </h1>
            <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-slate-400 [animation-delay:120ms]">
              NEXUS AI is your intelligent study partner for maths, science, programming and logic — breaking down every problem step by step in clear, beginner-friendly language.
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:180ms]">
              <Link to="/dashboard" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-ink-950 shadow-[0_0_40px_-6px_rgb(34_211_238/0.7)] transition hover:brightness-110">
                Start learning free <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link to="/chat" search={{ mode: 'math' }} className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/25 px-6 py-3 font-medium text-cyan-100 transition hover:bg-cyan-400/10">
                Try the Maths Solver
              </Link>
            </div>
            <p className="mt-6 animate-fade-up text-sm text-slate-500 [animation-delay:240ms]">
              Maths · Physics · Chemistry · Biology · Computer Science · English · Engineering
            </p>
          </div>

          {/* preview */}
          <div className="relative animate-fade-up [animation-delay:200ms]">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 to-blue-600/10 blur-2xl" />
            <div className="glass relative rounded-3xl p-5 shadow-2xl sm:p-6">
              <div className="flex items-center gap-2 border-b border-cyan-400/10 pb-4">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-ink-950">
                  <ModeIcon mode="math" className="h-4 w-4" />
                </div>
                <span className="font-display text-sm font-semibold">Mathematics Solver</span>
                <span className="ml-auto flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <div className="rounded-2xl rounded-br-md bg-gradient-to-br from-blue-600/80 to-cyan-600/70 px-4 py-2.5 text-sm text-white">
                  Differentiate f(x) = x³·sin(x)
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <LogoMark size={28} className="shrink-0" />
                <div className="nexus-prose min-w-0 flex-1 text-sm">
                  <Streamdown plugins={{ math }} mode="static">{sample}</Streamdown>
                </div>
              </div>
            </div>
            <LogoMark size={120} className="absolute -right-6 -top-14 hidden animate-float opacity-90 lg:block" />
          </div>
        </div>
      </section>

      {/* modes */}
      <section id="modes" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Six specialist modes</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">One tutor, tuned for every subject.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modes.map((m) => (
            <Link
              key={m.id}
              to="/chat"
              search={{ mode: m.id }}
              className="glass group relative overflow-hidden rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <div className={`absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${m.accent} opacity-10 blur-2xl transition group-hover:opacity-30`} />
              <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${m.accent} text-ink-950`}>
                <ModeIcon mode={m.id} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{m.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{m.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* how */}
      <section id="how" className="scroll-mt-20 border-y border-cyan-400/10 bg-ink-900/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">How it works</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">An 8-step method for every question.</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['Identify the problem', 'Explain the concept', 'List what you know', 'Choose the method', 'Solve step by step', 'Show the final answer', 'Explain the reasoning', 'Practise a similar one'].map((s, i) => (
              <li key={s} className="glass rounded-2xl p-5">
                <span className="font-display text-3xl font-bold text-gradient">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-2 font-medium text-slate-200">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* why */}
      <section id="why" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title}>
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-20 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-ink-800 via-ink-850 to-blue-950 p-10 text-center sm:p-14">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
          <LogoMark size={72} className="relative mx-auto" />
          <h2 className="relative mt-4 font-display text-3xl font-bold text-white sm:text-4xl">Stop copying answers. Start understanding them.</h2>
          <Link to="/dashboard" className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-ink-950 transition hover:brightness-110">
            Open your dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-cyan-400/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-8">
          <Logo />
          <p>© {new Date().getFullYear()} NEXUS AI. Built to help students think.</p>
        </div>
      </footer>
    </div>
  )
}
