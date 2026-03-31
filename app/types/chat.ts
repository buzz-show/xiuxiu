export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

// 前端展示用（含流式状态字段）
export interface Message extends ChatMessage {
  streaming?: boolean
}

export interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
}
