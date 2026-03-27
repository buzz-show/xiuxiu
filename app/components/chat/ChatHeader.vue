<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <header
    class="flex items-center justify-between px-2 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#F0EBE5]"
    style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: 12px;"
  >
    <button
      class="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
      @click="router.back()"
    >
      <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 text-[#8B7E74]" />
    </button>

    <div class="flex items-center gap-2">
      <div class="bg-[#FF9F43] p-1.5 rounded-lg shadow-sm flex items-center justify-center">
        <span class="text-white text-base leading-none">🐾</span>
      </div>
      <h1 class="text-lg font-bold tracking-tight text-[#18181B]">AI 宠物助理</h1>
    </div>

    <button class="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
      <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-[#AFA49C]" />
    </button>
  </header>
</template>
