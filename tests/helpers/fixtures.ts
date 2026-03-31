// ─── 标准测试数据 ──────────────────────────────────────────────────────────

export const mockUser = {
  id: 'test-user-id',
  sub: 'test-user-id',
  email: 'test@example.com',
}

export const mockPet = {
  id: 'pet-001',
  user_id: 'test-user-id',
  name: '球球',
  species: 'dog',
  breed: '金毛',
  birthday: '2020-05-01',
  gender: 'male',
  weight: 25.5,
  notes: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockHealthRecord = {
  id: 'hr-001',
  pet_id: 'pet-001',
  user_id: 'test-user-id',
  type: 'vaccine',
  title: '狂犬疫苗',
  date: '2024-03-01',
  note: null,
  next_due_date: '2025-03-01',
  created_at: '2024-03-01T00:00:00Z',
}

export const mockSession = {
  id: 'session-001',
  user_id: 'test-user-id',
  title: '新对话',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockMessages = [
  {
    id: 'msg-001',
    session_id: 'session-001',
    user_id: 'test-user-id',
    role: 'user',
    content: '我的狗狗吃什么比较好？',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'msg-002',
    session_id: 'session-001',
    user_id: 'test-user-id',
    role: 'assistant',
    content: '根据您的狗狗信息...',
    created_at: '2024-01-01T00:00:01Z',
  },
]
