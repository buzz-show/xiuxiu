import { serverSupabaseUser } from '#supabase/server'
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.sub)

  if (error) throw createError({ statusCode: 404, message: 'Pet not found or unauthorized' })
  return { success: true }
})
