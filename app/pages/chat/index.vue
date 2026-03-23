<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const { messages, sending, sendMessage } = useChat()
const input = ref('')

async function onSend() {
  if (!input.value.trim()) return
  const text = input.value
  input.value = ''
  await sendMessage(text)
}
</script>

<template>
  <div class="flex flex-col h-screen" style="background-color: #FFFCF8">

    <!-- iOS 风格导航栏：左侧返回，中间标题 -->
    <header
      class="relative flex items-center justify-center bg-white/90 backdrop-blur-sm border-b border-[#E4E4E7]"
      style="height: 44px; padding-top: env(safe-area-inset-top, 0px)"
    >
      <!-- 返回按钮 -->
      <button
        class="absolute left-2 flex items-center gap-0.5 px-2 py-1 rounded-full text-[#C9B7A3] hover:bg-[#F5EFE6] active:scale-95 active:opacity-60 transition-all duration-150"
        @click="router.back()"
      >
        <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
        <span class="text-sm font-medium">返回</span>
      </button>

      <!-- 居中标题 -->
      <div class="flex items-center gap-1.5">
        <span class="text-base">🐾</span>
        <span class="font-semibold text-[#18181B] text-[15px] tracking-wide">AI 宠物助理</span>
      </div>
    </header>

    <!-- 消息列表 -->
    <ChatMessageList :messages="messages" class="flex-1 overflow-y-auto" />

    <!-- 输入框 -->
    <ChatInput v-model="input" :loading="sending" @send="onSend" />

  </div>
</template>
