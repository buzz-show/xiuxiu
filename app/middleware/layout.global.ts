import { Capacitor } from '@capacitor/core'

// 在路由导航前根据平台决定 layout，避免页面挂载后 layout 响应式变化导致组件重复挂载
export default defineNuxtRouteMiddleware((to) => {
  // 页面声明了 layout: false 的，保持不变
  if (to.meta.layout === false) return

  const config = useRuntimeConfig()
  const isMobile = Capacitor.isNativePlatform() || config.public.forceMobile
  to.meta.layout = isMobile ? 'mobile' : 'default'
})
