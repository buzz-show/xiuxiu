import { createClient } from '@supabase/supabase-js'

/**
 * 服务端 Supabase 客户端，使用 service_role key，绕过 RLS
 * 仅在 server/ 目录中使用，不可暴露到前端
 */
export function createServerSupabaseClient() {
  const config = useRuntimeConfig()
  const supabaseUrl = process.env.SUPABASE_URL ?? ''
  const serviceKey = config.supabaseServiceKey

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase server credentials')
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })
}
