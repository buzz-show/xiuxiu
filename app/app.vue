<script setup lang="ts">
import { Capacitor } from '@capacitor/core'

const config = useRuntimeConfig()

const baseLayout = Capacitor.isNativePlatform() || config.public.forceMobile ? 'mobile' : 'default'

// SPA 模式下 @nuxtjs/supabase 插件是并行初始化的，在全局中间件执行前 session 可能尚未就绪。
// authReady 确保 session 检查完成后再渲染页面，防止已登录用户看到短暂的登录页闪烁。
const authReady = ref(false)
onMounted(async () => {
  await useSupabaseClient().auth.getSession()
  authReady.value = true
})
</script>

<template>
  <div v-if="!authReady" class="min-h-screen flex items-center justify-center" style="background-color: var(--warm-bg)">
    <div class="flex flex-col items-center gap-3 text-[#A1A1AA]">
      <div class="w-8 h-8 border-2 border-[#E4E4E7] border-t-[#C9B7A3] rounded-full animate-spin" />
      <span class="text-sm">正在加载...</span>
    </div>
  </div>
  <!-- 始终使用单一 NuxtLayout，Nuxt 会自动尊重页面声明的 layout: false -->
  <!-- 避免条件分支导致 NuxtPage 重复挂载（双重 onMounted 触发）-->
  <NuxtLayout v-else :name="baseLayout">
    <NuxtPage />
  </NuxtLayout>
</template>
