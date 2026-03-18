<script setup lang="ts">
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
  <div class="flex flex-col h-screen" style="background-color: var(--warm-bg)">
    <header class="px-4 py-3 bg-white border-b border-[#E4E4E7] flex items-center gap-2">
      <span class="text-xl">🐾</span>
      <h1 class="font-semibold text-[#18181B]">AI 宠物助理</h1>
    </header>
    <ChatMessageList :messages="messages" class="flex-1 overflow-y-auto" />
    <ChatChatInput v-model="input" :loading="sending" @send="onSend" />
  </div>
</template>
