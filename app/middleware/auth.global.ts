export default defineNuxtRouteMiddleware(async (to) => {
  // 放行所有认证相关页面，避免死循环
  if (to.path.startsWith('/auth')) return

  const client = useSupabaseClient()
  const { data: { session } } = await client.auth.getSession()

  if (!session) {
    return navigateTo('/auth/login')
  }
})
