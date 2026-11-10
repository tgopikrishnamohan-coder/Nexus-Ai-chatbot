import { Link } from '@tanstack/react-router'

export function logoSrc(w: number) {
  return `/.netlify/images?url=/img/nexus-logo.png&w=${w}&fm=webp`
}

/** The NEXUS mark. The source art sits on black, so `screen` blends it into the navy UI. */
export function LogoMark({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src={logoSrc(size * 2)}
      width={size}
      height={size}
      alt=""
      aria-hidden
      className={`mix-blend-screen object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

export function Logo({ to = '/', compact = false }: { to?: '/' | '/dashboard'; compact?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 group" aria-label="NEXUS AI home">
      <LogoMark size={36} className="transition-transform duration-300 group-hover:scale-110" />
      {!compact && (
        <span className="font-display text-lg font-bold tracking-[0.18em] text-white">
          NEXUS<span className="text-cyan-300"> AI</span>
        </span>
      )}
    </Link>
  )
}
