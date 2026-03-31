// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mockSession } from '../../helpers/fixtures'

Object.assign(globalThis, { ref })

const fetchMock = vi.fn()
;(globalThis as any).$fetch = fetchMock

describe('useChatSessions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('loadSessions fetches and sets sessions list', async () => {
    const sessions = [mockSession, { ...mockSession, id: 'session-002', title: '新对话 2' }]
    fetchMock.mockResolvedValue(sessions)

    const { useChatSessions } = await import('../../../app/composables/useChatSessions')
    const { sessions: sessionsRef, loadSessions } = useChatSessions()

    await loadSessions()

    expect(sessionsRef.value).toEqual(sessions)
    expect(fetchMock).toHaveBeenCalledWith('/api/chat/sessions')
  })

  it('createSession adds new session to the front of the list', async () => {
    const existing = [mockSession]
    const newSess = { ...mockSession, id: 'session-new', title: '我的新对话' }
    fetchMock
      .mockResolvedValueOnce(existing)         // loadSessions
      .mockResolvedValueOnce(newSess)          // createSession

    const { useChatSessions } = await import('../../../app/composables/useChatSessions')
    const { sessions: sessionsRef, loadSessions, createSession } = useChatSessions()

    await loadSessions()
    const created = await createSession('我的新对话')

    expect(created).toMatchObject({ title: '我的新对话' })
    expect(sessionsRef.value[0]).toMatchObject({ id: 'session-new' })
    expect(fetchMock).toHaveBeenLastCalledWith('/api/chat/sessions', {
      method: 'POST',
      body: { title: '我的新对话' },
    })
  })

  it('deleteSession removes session from list', async () => {
    const twoSessions = [mockSession, { ...mockSession, id: 'session-002' }]
    fetchMock
      .mockResolvedValueOnce(twoSessions)
      .mockResolvedValueOnce({ success: true })

    const { useChatSessions } = await import('../../../app/composables/useChatSessions')
    const { sessions: sessionsRef, loadSessions, deleteSession } = useChatSessions()

    await loadSessions()
    expect(sessionsRef.value).toHaveLength(2)

    await deleteSession(mockSession.id)

    expect(sessionsRef.value).toHaveLength(1)
    expect(sessionsRef.value.find(s => s.id === mockSession.id)).toBeUndefined()
  })

  it('createSession uses default title when no title provided', async () => {
    const defaultSess = { ...mockSession, title: '新对话' }
    fetchMock.mockResolvedValue(defaultSess)

    const { useChatSessions } = await import('../../../app/composables/useChatSessions')
    const { createSession } = useChatSessions()

    await createSession()

    expect(fetchMock).toHaveBeenCalledWith('/api/chat/sessions', {
      method: 'POST',
      body: { title: undefined },
    })
  })
})
