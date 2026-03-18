<script setup lang="ts">
import type { Message } from '~/types/chat'
defineProps<{ messages: Message[] }>()
const el = ref<HTMLElement>()
watchEffect(() => { if (el.value) el.value.scrollTop = el.value.scrollHeight })
</script>
<template>
  <div ref="el" class="px-4 py-4 space-y-4">
    <ChatMessageBubble v-for="msg in messages" :key="msg.id" :message="msg" />
    <div v-if="!messages.length" class="text-center py-16 text-[#A1A1AA]">
      <p class="text-4xl mb-2">🐾</p>
      <p class="text-sm">向 AI 助理问一个关于宠物的问题吧</p>
    </div>
  </div>
</template>
