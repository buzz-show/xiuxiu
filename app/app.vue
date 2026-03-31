<script setup lang="ts">
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
  <!-- 布局由 middleware/layout.global.ts 在路由导航前决定，不在 app.vue 中做响应式计算 -->
  <!-- 避免 :name 响应式变化导致 NuxtLayout 切换、页面组件重复挂载 -->
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>
