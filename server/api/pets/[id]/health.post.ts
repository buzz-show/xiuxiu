import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const petId = getRouterParam(event, 'id')
  const body = await readBody<{
    type: string
    title: string
    date?: string
    note?: string
    next_due_date?: string
  }>(event)

  if (!body?.title?.trim() || !body?.type) {
    throw createError({ statusCode: 400, message: 'type and title are required' })
  }

  const supabase = createServerSupabaseClient()

  // 验证宠物归属
  const { data: pet } = await supabase
    .from('pets').select('id').eq('id', petId).eq('user_id', user.sub).single()
  if (!pet) throw createError({ statusCode: 404, message: 'Pet not found' })

  const { data, error } = await supabase
    .from('health_records')
    .insert({
      pet_id: petId,
      type: body.type,
      title: body.title.trim(),
      date: body.date ?? new Date().toISOString().split('T')[0],
      note: body.note?.trim() || null,
      next_due_date: body.next_due_date || null,
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})
