<script setup lang="ts">
const tabs = [
  { label: '我的宠物', icon: 'i-heroicons-heart', to: '/' },
  { label: 'AI 助理', icon: 'i-heroicons-chat-bubble-left-right', to: '/chat' },
]
const route = useRoute()
</script>
<template>
  <nav class="flex bg-white border-t border-gray-200">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="flex-1 flex flex-col items-center justify-center py-2 text-xs gap-1"
      :class="route.path === tab.to ? 'text-primary-600' : 'text-gray-400'"
    >
      <UIcon :name="tab.icon" class="text-xl" />
      {{ tab.label }}
    </NuxtLink>
  </nav>
</template>
