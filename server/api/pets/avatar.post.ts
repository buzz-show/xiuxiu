import { serverSupabaseUser } from '#supabase/server'

const BUCKET = 'pet-avatars'
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const { base64, mimeType } = await readBody(event)

  if (!base64 || typeof base64 !== 'string') {
    throw createError({ statusCode: 400, message: '缺少图片数据' })
  }
  if (!ALLOWED_MIME.includes(mimeType)) {
    throw createError({ statusCode: 400, message: '不支持的图片格式' })
  }

  const buffer = Buffer.from(base64, 'base64')
  if (buffer.byteLength > MAX_SIZE) {
    throw createError({ statusCode: 400, message: '图片大小不能超过 5MB' })
  }

  const ext = mimeType.split('/')[1].replace('jpeg', 'jpg')
  const filename = `${user.sub}/${Date.now()}.${ext}`

  const supabase = createServerSupabaseClient()
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: mimeType, upsert: false })

  if (error) throw createError({ statusCode: 500, message: error.message })

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filename)

  return { url: publicUrl }
})
