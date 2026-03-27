<script setup lang="ts">
definePageMeta({
  layout: false
})

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
  <div class="flex flex-col h-screen bg-[#F9F7F2] text-[#333333] overflow-hidden">
    <!-- 顶部导航栏 -->
    <UiAppHeader>
      <template #title>
        <div class="flex items-center gap-2">
          <div class="bg-[#FF9F43] p-1.5 rounded-lg shadow-sm flex items-center justify-center">
            <span class="text-white text-base leading-none">🐾</span>
          </div>
          <h1 class="text-lg font-bold tracking-tight text-[#18181B]">AI 宠物助理</h1>
        </div>
      </template>
      <template #right>
        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-[#AFA49C]" />
        </button>
      </template>
    </UiAppHeader>

    <!-- 消息列表 -->
    <ChatMessageList :messages="messages" />

    <!-- 底部输入区域 -->
    <ChatInput v-model="input" :loading="sending" @send="onSend" />
  </div>
</template>
