import {
  chat,
  chatParamsFromRequestBody,
  EventType,
  maxIterations,
  toServerSentEventsResponse,
  type StreamChunk,
} from '@tanstack/ai'
import { createGeminiChat } from '@tanstack/ai-gemini'
import { z } from 'zod'
import { modeIds, systemPromptFor, type ModeId } from './modes'

const text = z.string().max(16000)
const selectionSchema = z.object({
  mode: z.enum(modeIds as [ModeId, ...ModeId[]]).optional(),
})
const messageBase = {
  id: z.string().min(1).max(200),
  metadata: z.record(z.string(), z.unknown()).optional(),
}
const messageSchema = z.discriminatedUnion('role', [
  z.object({ ...messageBase, role: z.literal('user'), content: text.min(1) }),
  z.object({
    ...messageBase,
    role: z.literal('assistant'),
    content: text.optional(),
  }),
  z.object({
    ...messageBase,
    role: z.literal('reasoning'),
    content: text,
    encryptedValue: text.optional(),
  }),
])

const requestSchema = z.object({
  threadId: z.string().min(1).max(200),
  runId: z.string().min(1).max(200),
  messages: z.array(messageSchema).min(1).max(100),
  tools: z.array(z.never()).max(0),
  context: z.array(z.never()).max(0),
  forwardedProps: selectionSchema.optional(),
  data: selectionSchema.optional(),
})

class ChatConfigurationError extends Error {}

/** Default Gemini model. Override with the GEMINI_MODEL (or AI_MODEL) env var. */
export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash'

function createAdapter(env: NodeJS.ProcessEnv) {
  const key = env.GEMINI_API_KEY || env.GOOGLE_API_KEY
  if (!key)
    throw new ChatConfigurationError(
      'NEXUS AI is not connected to Gemini yet. Deploy on Netlify (AI Gateway) or set GEMINI_API_KEY.',
    )
  const model = (
    env.GEMINI_MODEL?.trim() ||
    env.AI_MODEL?.trim() ||
    DEFAULT_GEMINI_MODEL
  ) as Parameters<typeof createGeminiChat>[0]
  return createGeminiChat(model, key, {
    baseURL: env.GOOGLE_GEMINI_BASE_URL,
  })
}

const providerFailure =
  'The chat provider could not complete the request. Please try again.'

async function* safeStream(
  stream: AsyncIterable<StreamChunk>,
  request: Request,
  controller: AbortController,
  onAbort: () => void,
): AsyncGenerator<StreamChunk> {
  try {
    for await (const chunk of stream) {
      if (controller.signal.aborted) return
      if (chunk.type === 'RUN_ERROR') {
        yield {
          type: EventType.RUN_ERROR,
          timestamp: Date.now(),
          message: providerFailure,
        }
        return
      }
      yield chunk
    }
  } catch {
    if (!controller.signal.aborted) {
      yield {
        type: EventType.RUN_ERROR,
        timestamp: Date.now(),
        message: providerFailure,
      }
    }
  } finally {
    request.signal.removeEventListener('abort', onAbort)
  }
}

const maxBodyChars = 128000
const maxUtf8BytesPerChar = 3

async function readBodyWithinBytes(request: Request, maxBytes: number) {
  if (!request.body) return ''
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let text = ''
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return text + decoder.decode()
    size += value.byteLength
    if (size > maxBytes) {
      await reader.cancel()
      return undefined
    }
    text += decoder.decode(value, { stream: true })
  }
}

export async function handleChatRequest(
  request: Request,
  env: NodeJS.ProcessEnv = process.env,
) {
  if (request.signal.aborted) return new Response(null, { status: 499 })
  let body: z.infer<typeof requestSchema>
  try {
    const raw = await readBodyWithinBytes(
      request,
      maxBodyChars * maxUtf8BytesPerChar,
    )
    if (raw === undefined || raw.length > maxBodyChars)
      return Response.json(
        { error: 'The conversation is too large. Start a new chat.' },
        { status: 413 },
      )
    body = requestSchema.parse(JSON.parse(raw))
  } catch {
    return Response.json(
      { error: 'Send a valid chat request with user or assistant messages.' },
      { status: 400 },
    )
  }

  const controller = new AbortController()
  const onAbort = () => controller.abort(request.signal.reason)
  request.signal.addEventListener('abort', onAbort, { once: true })
  if (request.signal.aborted) onAbort()
  try {
    const adapter = createAdapter(env)
    const mode = (body.forwardedProps ?? body.data)?.mode ?? 'general'
    const { messages, threadId, runId } = await chatParamsFromRequestBody(body)
    const stream = chat({
      adapter,
      messages,
      threadId,
      runId,
      systemPrompts: [systemPromptFor(mode)],
      agentLoopStrategy: maxIterations(1),
      abortController: controller,
    })
    return toServerSentEventsResponse(
      safeStream(stream, request, controller, onAbort),
      {
        abortController: controller,
        headers: { 'Cache-Control': 'no-store' },
      },
    )
  } catch (error) {
    request.signal.removeEventListener('abort', onAbort)
    if (controller.signal.aborted) return new Response(null, { status: 499 })
    if (error instanceof ChatConfigurationError)
      return Response.json({ error: error.message }, { status: 503 })
    return Response.json({ error: providerFailure }, { status: 502 })
  }
}
