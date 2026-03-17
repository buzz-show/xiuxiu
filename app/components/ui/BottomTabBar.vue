<script setup lang="ts">
const tabs = [
  { label: '首页', icon: 'i-heroicons-heart', to: '/' },
  { label: 'AI 助理', icon: 'i-heroicons-chat-bubble-left-right', to: '/chat' },
  { label: '我的', icon: 'i-heroicons-user', to: '/profile' },
]
const route = useRoute()
</script>
<template>
  <div class="fixed bottom-5 inset-x-4 pointer-events-none z-50">
    <nav class="flex items-center w-full bg-white/80 backdrop-blur-xl rounded-full shadow-xl shadow-black/10 border border-white/60 px-2 pointer-events-auto">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="flex-1 flex flex-col items-center justify-center py-2.5 text-xs gap-1 rounded-full transition-colors duration-200"
        :class="route.path === tab.to ? 'text-primary-600' : 'text-gray-400'"
      >
        <UIcon :name="tab.icon" class="text-xl" />
        {{ tab.label }}
      </NuxtLink>
    </nav>
  </div>
</template>
