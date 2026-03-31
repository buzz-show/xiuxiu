import type { ChatSession } from '~/types/chat'

export function useChatSessions() {
  const sessions = ref<ChatSession[]>([])
  const loading = ref(false)

  async function loadSessions() {
    loading.value = true
    try {
      const data = await $fetch<ChatSession[]>('/api/chat/sessions')
      sessions.value = data
    } finally {
      loading.value = false
    }
  }

  async function createSession(title?: string): Promise<ChatSession> {
    const data = await $fetch<ChatSession>('/api/chat/sessions', {
      method: 'POST',
      body: { title },
    })
    sessions.value.unshift(data)
    return data
  }

  async function deleteSession(id: string) {
    await $fetch(`/api/chat/sessions/${id}`, { method: 'DELETE' })
    sessions.value = sessions.value.filter(s => s.id !== id)
  }

  function updateSessionTime(id: string) {
    const session = sessions.value.find(s => s.id === id)
    if (session) {
      session.updated_at = new Date().toISOString()
      sessions.value = [
        session,
        ...sessions.value.filter(s => s.id !== id),
      ]
    }
  }

  return { sessions, loading, loadSessions, createSession, deleteSession, updateSessionTime }
}
