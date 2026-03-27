<script setup lang="ts">
defineProps<{ title?: string }>()
const router = useRouter()
</script>

<template>
  <header
    class="flex items-center justify-between px-2 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#F0EBE5]"
    style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: 12px;"
  >
    <!-- 左侧：默认返回按钮，可覆盖 -->
    <slot name="left">
      <button
        class="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
        @click="router.back()"
      >
        <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 text-[#8B7E74]" />
      </button>
    </slot>

    <!-- 中间：默认显示 title prop，可覆盖 -->
    <slot name="title">
      <h1 class="text-lg font-bold tracking-tight text-[#18181B]">{{ title }}</h1>
    </slot>

    <!-- 右侧：默认透明占位（保持标题居中），可放功能按钮 -->
    <slot name="right">
      <div class="w-10 h-10" />
    </slot>
  </header>
</template>
