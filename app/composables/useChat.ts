import type { Message } from '~/types/chat'

export function useChat(sessionId: Ref<string | null>) {
  const messages = ref<Message[]>([])
  const sending = ref(false)
  const loadingHistory = ref(false)

  async function loadHistory() {
    const id = sessionId.value
    if (!id) return
    loadingHistory.value = true
    try {
      const data = await $fetch<Message[]>(`/api/chat/sessions/${id}/messages`)
      messages.value = data
    } finally {
      loadingHistory.value = false
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || sending.value || !sessionId.value) return

    // 1. 插入用户消息（乐观更新）
    messages.value.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
    })

    // 2. 插入空的 assistant 消息占位（loading 状态）
    const assistantId = crypto.randomUUID()
    messages.value.push({
      id: assistantId,
      role: 'assistant',
      content: '',
      streaming: true,
    })

    sending.value = true

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), session_id: sessionId.value }),
      })

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const json = line.slice(6).trim()
          if (!json) continue

          try {
            const parsed = JSON.parse(json) as { type: string; content?: string }
            if (parsed.type === 'delta' && parsed.content) {
              const msg = messages.value.find(m => m.id === assistantId)
              if (msg) msg.content += parsed.content
            }
            if (parsed.type === 'done') break
          } catch {
            // ignore malformed lines
          }
        }
      }
    } catch {
      const msg = messages.value.find(m => m.id === assistantId)
      if (msg) msg.content = '抱歉，出了点问题，请稍后再试。'
    } finally {
      // 流式结束，取消 streaming 标志
      const msg = messages.value.find(m => m.id === assistantId)
      if (msg) msg.streaming = false
      sending.value = false
    }
  }

  return { messages, sending, loadingHistory, loadHistory, sendMessage }
}
