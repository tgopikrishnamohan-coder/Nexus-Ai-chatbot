import {
  BookOpenCheck,
  Braces,
  Brain,
  FlaskConical,
  GraduationCap,
  MessageSquareText,
  Sigma,
  type LucideProps,
} from 'lucide-react'
import type { ModeId } from '@/lib/modes'

const icons: Record<ModeId, React.ComponentType<LucideProps>> = {
  general: MessageSquareText,
  homework: BookOpenCheck,
  math: Sigma,
  code: Braces,
  science: FlaskConical,
  logic: Brain,
  study: GraduationCap,
}

export function ModeIcon({ mode, ...props }: { mode: ModeId } & LucideProps) {
  const Icon = icons[mode] ?? MessageSquareText
  return <Icon {...props} />
}
