<script setup lang="ts">
import type { Message } from '~/types/chat'
defineProps<{ messages: Message[] }>()
const el = ref<HTMLElement>()
watchEffect(() => { if (el.value) el.value.scrollTop = el.value.scrollHeight })
</script>
<template>
  <div ref="el" class="px-4 py-4 space-y-4">
    <ChatMessageBubble v-for="msg in messages" :key="msg.id" :message="msg" />
    <div v-if="!messages.length" class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-2">&#x1F43E;</p>
      <p class="text-sm">&#x4F60;&#x597D;&#xFF01;&#x6211;&#x662F;&#x79C0;&#x79C0;&#x5BA0;&#x7269;&#x52A9;&#x7406;&#xFF0C;&#x6709;&#x4EC0;&#x4E48;&#x53EF;&#x4EE5;&#x5E2E;&#x4F60;&#x7684;&#xFF1F;</p>
    </div>
  </div>
</template>
