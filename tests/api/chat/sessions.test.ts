import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSupabaseMock } from '../../helpers/supabase-mock'
import { mockUser, mockSession } from '../../helpers/fixtures'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

// chat sessions 使用 serverSupabaseClient(event)（Nitro 全局），而非 createServerSupabaseClient
const mockEvent = {} as any
const gbl = global as any

describe('GET /api/chat/sessions', () => {
  beforeEach(() => {
    vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(serverSupabaseUser).mockResolvedValueOnce(null as any)

    const { default: handler } = await import('../../../server/api/chat/sessions/index.get')
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('returns sessions list for authenticated user', async () => {
    const mockClient = createSupabaseMock({ chat_sessions: { data: [mockSession], error: null } })
    vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient)

    const { default: handler } = await import('../../../server/api/chat/sessions/index.get')
    const result = await handler(mockEvent)

    expect(result).toEqual([mockSession])
    expect(mockClient.from).toHaveBeenCalledWith('chat_sessions')
  })
})

describe('POST /api/chat/sessions', () => {
  beforeEach(() => {
    vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
  })

  it('creates session with default title when no title provided', async () => {
    gbl.readBody.mockResolvedValueOnce({})
    const newSession = { ...mockSession, title: '新对话' }
    const mockClient = createSupabaseMock({ chat_sessions: { data: newSession, error: null } })
    vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient)

    const { default: handler } = await import('../../../server/api/chat/sessions/index.post')
    const result = await handler(mockEvent)

    expect(result).toMatchObject({ title: '新对话' })
  })

  it('creates session with given title', async () => {
    gbl.readBody.mockResolvedValueOnce({ title: '球球的日常' })
    const newSession = { ...mockSession, title: '球球的日常' }
    const mockClient = createSupabaseMock({ chat_sessions: { data: newSession, error: null } })
    vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient)

    const { default: handler } = await import('../../../server/api/chat/sessions/index.post')
    const result = await handler(mockEvent)

    expect(result).toMatchObject({ title: '球球的日常' })
  })
})

describe('DELETE /api/chat/sessions/:id', () => {
  beforeEach(() => {
    vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
    gbl.getRouterParam.mockReturnValue(mockSession.id)
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(serverSupabaseUser).mockResolvedValueOnce(null as any)

    const { default: handler } = await import('../../../server/api/chat/sessions/[id].delete')
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('returns success on delete', async () => {
    const mockClient = createSupabaseMock({ chat_sessions: { data: null, error: null } })
    vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient)

    const { default: handler } = await import('../../../server/api/chat/sessions/[id].delete')
    const result = await handler(mockEvent)

    expect(result).toMatchObject({ success: true })
  })
})
