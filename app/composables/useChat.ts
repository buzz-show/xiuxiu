import type { Message } from '~/types/chat'

export function useChat() {
  const messages = ref<Message[]>([])
  const sending = ref(false)
  const threadId = ref(crypto.randomUUID())

  async function sendMessage(text: string) {
    messages.value.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    })
    sending.value = true

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      streaming: true,
      created_at: new Date().toISOString(),
    }
    messages.value.push(assistantMsg)
    const assistantIdx = messages.value.length - 1

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, thread_id: threadId.value }),
      })
      if (!res.body) throw new Error('No stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = JSON.parse(line.slice(6))
          if (data.type === 'delta') {
            messages.value[assistantIdx]! = {
              ...messages.value[assistantIdx]!,
              content: messages.value[assistantIdx]!.content + data.content,
            } as Message
          } else if (data.type === 'done') {
            messages.value[assistantIdx]! = { ...messages.value[assistantIdx]!, streaming: false } as Message
          }
        }
      }
    } catch {
      messages.value[assistantIdx]! = {
        ...messages.value[assistantIdx]!,
        content: messages.value[assistantIdx]!.content || '抱歉，出了点问题，请稍后再试。',
        streaming: false,
      } as Message
    } finally {
      if (messages.value[assistantIdx]!?.streaming) {
        messages.value[assistantIdx]! = { ...messages.value[assistantIdx]!, streaming: false } as Message
      }
      sending.value = false
    }
  }

  return { messages, sending, sendMessage, threadId }
}
