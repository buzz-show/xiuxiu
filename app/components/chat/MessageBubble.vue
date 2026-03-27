<script setup lang="ts">
import type { Message } from '~/types/chat'

const props = defineProps<{ message: Message }>()

const isUser = computed(() => props.message.role === 'user')
const isLoading = computed(() => !isUser.value && props.message.content === '' && props.message.streaming)
const isStreaming = computed(() => !isUser.value && props.message.content !== '' && props.message.streaming)
</script>

<template>
  <!-- AI 消息（左对齐） -->
  <div v-if="!isUser" class="flex items-end gap-2">
    <div class="shrink-0 bg-[#FFF4E5] w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
      <UIcon name="i-heroicons-sparkles-20-solid" class="w-4 h-4 text-[#FF9F43]" />
    </div>
    <div
      class="max-w-[75%] bg-white text-[#555555] text-[15px] leading-relaxed px-4 py-3 shadow-sm border border-[#EFE9E1]"
      style="border-radius: 20px 20px 20px 6px"
    >
      <!-- 加载中三点动画 -->
      <div v-if="isLoading" class="flex items-center gap-1 py-0.5">
        <span class="dot-bounce" style="animation-delay: 0ms" />
        <span class="dot-bounce" style="animation-delay: 150ms" />
        <span class="dot-bounce" style="animation-delay: 300ms" />
      </div>
      <!-- 流式中（有内容）+ 光标 -->
      <p v-else-if="isStreaming" class="whitespace-pre-wrap">{{ message.content }}<span class="cursor-blink" /></p>
      <!-- 完成 -->
      <p v-else class="whitespace-pre-wrap">{{ message.content }}</p>
    </div>
  </div>

  <!-- 用户消息（右对齐） -->
  <div v-else class="flex items-end justify-end gap-2">
    <div
      class="max-w-[75%] bg-[#FF9F43] text-white text-[15px] leading-relaxed px-4 py-3 shadow-sm"
      style="border-radius: 20px 20px 6px 20px"
    >
      {{ message.content }}
    </div>
  </div>
</template>

<style scoped>
.dot-bounce {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #CCC5BC;
  animation: dotBounce 1s ease-in-out infinite;
}
@keyframes dotBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40%            { transform: translateY(-6px); opacity: 1; }
}
.cursor-blink {
  display: inline-block;
  width: 2px;
  height: 0.9em;
  background-color: currentColor;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 0.8s step-start infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
</style>
