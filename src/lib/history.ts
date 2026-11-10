/**
 * Conversation history, stored in the browser (localStorage) for now.
 * A later milestone swaps this module for Netlify Database-backed storage
 * behind the same API (list / get / save / remove / subscribe).
 */
import { useSyncExternalStore } from 'react'
import type { ChatMessages } from './ai-hook'
import type { ModeId } from './modes'

export interface Conversation {
  id: string
  mode: ModeId
  title: string
  createdAt: number
  updatedAt: number
  messages: ChatMessages
}

const KEY = 'nexus-ai:conversations:v1'
const listeners = new Set<() => void>()
let cache: Conversation[] | null = null
const EMPTY: Conversation[] = []

function read(): Conversation[] {
  if (typeof window === 'undefined') return EMPTY
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(KEY)
    cache = raw ? (JSON.parse(raw) as Conversation[]) : []
  } catch {
    cache = []
  }
  return cache
}

function write(list: Conversation[]) {
  cache = [...list].sort((a, b) => b.updatedAt - a.updatedAt)
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache.slice(0, 100)))
  } catch {
    /* storage full or unavailable — keep in memory for this tab */
  }
  listeners.forEach((l) => l())
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      cache = null
      listeners.forEach((l) => l())
    }
  })
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function listConversations() {
  return read()
}

export function getConversation(id: string) {
  return read().find((c) => c.id === id)
}

export function saveConversation(
  conv: Omit<Conversation, 'createdAt' | 'updatedAt' | 'title'> & {
    title?: string
  },
) {
  const list = read()
  const existing = list.find((c) => c.id === conv.id)
  const now = Date.now()
  const next: Conversation = {
    createdAt: existing?.createdAt ?? now,
    title: conv.title ?? existing?.title ?? titleFrom(conv.messages),
    ...conv,
    updatedAt: now,
  }
  write([next, ...list.filter((c) => c.id !== conv.id)])
}

export function removeConversation(id: string) {
  write(read().filter((c) => c.id !== id))
}

export function clearConversations() {
  write([])
}

export function useConversations() {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function newConversationId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `c-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function messageText(message: ChatMessages[number]) {
  return message.parts
    .map((p) => (p.type === 'text' ? p.content : ''))
    .join('')
}

function titleFrom(messages: ChatMessages) {
  const first = messages.find((m) => m.role === 'user')
  const text = first ? messageText(first).replace(/\s+/g, ' ').trim() : ''
  if (!text) return 'New conversation'
  return text.length > 64 ? `${text.slice(0, 61)}…` : text
}

export function timeAgo(ts: number) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000))
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(ts).toLocaleDateString()
}
