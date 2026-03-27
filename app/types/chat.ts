export type MessageRole = 'user' | 'assistant' | 'tool'

export interface Message {
  id: string
  role: MessageRole
  content: string
  created_at: string
  streaming?: boolean
  // tool call 相关（assistant 调用工具时）
  tool_calls?: ToolCall[]
}

export interface ToolCall {
  id: string
  name: string
  args: Record<string, unknown>
  result?: string
}

export interface ChatSession {
  thread_id: string
  pet_id?: string
  messages: Message[]
}
