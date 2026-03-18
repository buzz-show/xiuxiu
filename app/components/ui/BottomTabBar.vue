<script setup lang="ts">
const tabs = [
  { label: '首页', icon: 'i-heroicons-home', to: '/' },
  { label: 'AI 助理', icon: 'i-heroicons-chat-bubble-left-right', to: '/chat' },
  { label: '我的', icon: 'i-heroicons-user', to: '/profile' },
]
const route = useRoute()
</script>

<template>
  <div
    class="fixed bottom-5 inset-x-4 z-50 pointer-events-none"
    style="padding-bottom: env(safe-area-inset-bottom, 0px)"
  >
    <nav
      class="flex items-stretch w-full rounded-full shadow-xl shadow-black/10 border border-white/60 pointer-events-auto overflow-hidden"
      style="background: rgba(255,255,255,0.88); backdrop-filter: saturate(180%) blur(20px)"
    >
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors duration-200"
        :style="route.path === tab.to ? 'color: #C9B7A3' : 'color: #A1A1AA'"
      >
        <UIcon :name="tab.icon" class="text-[22px]" />
        <span>{{ tab.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>
