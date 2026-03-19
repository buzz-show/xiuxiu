import { serverSupabaseUser } from '#supabase/server'
import type { NewPet } from '~/types/pet'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody<NewPet>(event)
  if (!body?.name?.trim()) throw createError({ statusCode: 400, message: 'name is required' })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('pets')
    .insert({ ...body, user_id: user.sub })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})
