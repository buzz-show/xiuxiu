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
        ? 'bg-primary-500 text-white rounded-br-sm'
        : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'"
    >
      <p class="whitespace-pre-wrap">{{ message.content }}</p>
    </div>
  </div>
</template>
