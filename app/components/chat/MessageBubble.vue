<script setup lang="ts">
import type { Message } from '~/types/chat'
const props = defineProps<{ message: Message }>()
const isUser = computed(() => props.message.role === 'user')
</script>
<template>
  <div class="flex" :class="isUser ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
      :class="isUser
        ? 'text-white rounded-br-sm'
        : 'bg-white text-[#3F3F46] shadow-sm rounded-bl-sm'"
      :style="isUser ? 'background-color: var(--warm-deep)' : ''"
    >
      <p class="whitespace-pre-wrap">{{ message.content }}</p>
    </div>
  </div>
</template>
