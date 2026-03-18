<script setup lang="ts">
import { Capacitor } from '@capacitor/core'

const config = useRuntimeConfig()
const route = useRoute()

const baseLayout = Capacitor.isNativePlatform() || config.public.forceMobile ? 'mobile' : 'default'

// 若页面声明了 layout: false（如登录/回调页），跳过所有 layout，直接渲染裸页面
const layout = computed(() =>
  route.meta.layout === false ? false : baseLayout
)

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
  <template v-else-if="layout === false">
    <NuxtPage />
  </template>
  <NuxtLayout v-else :name="baseLayout">
    <NuxtPage />
  </NuxtLayout>
</template>
