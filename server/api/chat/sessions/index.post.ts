// POST /api/chat/sessions - 创建新聊天会话
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody<{ title?: string }>(event)

  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from('chat_sessions')
    .insert({
      user_id: user.sub,
      title: body?.title?.trim() || '新对话',
    })
    .select('id, title, created_at, updated_at')
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
