// GET /api/chat/sessions/[id]/messages - 获取指定会话的历史消息
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

  // 验证 session 归属当前用户
  const { data: session, error: sessionError } = await client
    .from('chat_sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (sessionError || !session) {
    throw createError({ statusCode: 404, message: 'Session not found' })
  }

  const { data, error } = await client
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
