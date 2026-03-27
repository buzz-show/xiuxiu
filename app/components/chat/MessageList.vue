<script setup lang="ts">
import type { Message } from '~/types/chat'

const props = defineProps<{ messages: Message[] }>()

const listRef = ref<HTMLElement | null>(null)

watch(
  () => props.messages.map(m => m.content).join(),
  async () => {
    await nextTick()
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  },
)
</script>

<template>
  <main ref="listRef" class="flex-1 overflow-y-auto px-4 py-6">
    <!-- 空状态 -->
    <template v-if="messages.length === 0">
      <!-- 欢迎卡片 -->
      <div class="bg-white rounded-[24px] p-5 shadow-sm border border-[#EFE9E1] relative overflow-hidden group">
        <div class="flex items-start gap-4">
          <div class="shrink-0 bg-[#FFF4E5] p-3 rounded-2xl">
            <UIcon name="i-heroicons-sparkles-20-solid" class="w-6 h-6 text-[#FF9F43]" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[#FF9F43] font-bold text-xs uppercase tracking-wider">AI 智能分析</span>
              <span class="text-[10px] text-gray-400">刚刚</span>
            </div>
            <p class="text-[#555555] leading-relaxed text-[15px]">
              你好！我是你的 AI 宠物助理。你可以问我关于宠物健康、饮食建议或日常护理的问题。今天天气不错，适合带你的宠物出去走走。
            </p>
          </div>
        </div>
        <div class="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform group-hover:scale-110 pointer-events-none select-none text-[80px] leading-none">
          🐾
        </div>
      </div>

      <!-- 空状态提示 -->
      <div class="flex flex-col items-center justify-center py-10 opacity-40">
        <div class="flex gap-1 mb-3">
          <span class="text-xl">🐾</span>
          <span class="text-xl -mt-2">🐾</span>
        </div>
        <p class="text-sm font-medium text-[#8B7E74]">向 AI 助理问一个关于宠物的问题吧</p>
      </div>
    </template>

    <!-- 消息列表 -->
    <template v-else>
      <div class="space-y-4">
        <ChatMessageBubble
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
        />
      </div>
    </template>
  </main>
</template>
