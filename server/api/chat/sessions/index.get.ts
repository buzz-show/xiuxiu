// GET /api/chat/sessions - 获取当前用户的所有会话（按最新活跃倒序）
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from('chat_sessions')
    .select('id, title, created_at, updated_at')
    .eq('user_id', user.sub)
    .order('updated_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
