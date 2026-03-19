import { serverSupabaseUser } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  // 只允许更新安全字段，防止越权修改 user_id
  const { name, species, breed, birthday, gender, avatar_url, notes } = body

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('pets')
    .update({ name, species, breed, birthday, gender, avatar_url, notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.sub)
    .select()
    .single()

  if (error || !data) throw createError({ statusCode: 404, message: 'Pet not found or unauthorized' })
  return data
})
