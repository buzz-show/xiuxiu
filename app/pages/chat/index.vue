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
    <ChatHeader />
    <ChatMessageList :messages="messages" />
    <ChatInput v-model="input" :loading="sending" @send="onSend" />
  </div>
</template>
