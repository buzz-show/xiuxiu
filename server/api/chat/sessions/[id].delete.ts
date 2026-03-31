// DELETE /api/chat/sessions/[id] - 删除会话（级联删除消息）
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const sessionId = getRouterParam(event, 'id')
  if (!sessionId) {
    throw createError({ statusCode: 400, message: 'session id is required' })
  }

  const client = await serverSupabaseClient(event)
  const { error } = await client
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', user.id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
