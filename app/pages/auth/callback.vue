<script setup lang="ts">
// @nuxtjs/supabase 自动处理 token，跳转到首页即可
const router = useRouter()
onMounted(() => router.push('/'))
</script>
<template><div class="min-h-screen flex items-center justify-center"><p class="text-gray-400">正在登录...</p></div></template>
