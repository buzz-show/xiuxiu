import { serverSupabaseUser } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const petId = getRouterParam(event, 'id')
  const supabase = createServerSupabaseClient()

  // 验证宠物归属
  const { data: pet } = await supabase
    .from('pets').select('id').eq('id', petId).eq('user_id', user.id).single()
  if (!pet) throw createError({ statusCode: 404, message: 'Pet not found' })

  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('pet_id', petId)
    .order('date', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})
