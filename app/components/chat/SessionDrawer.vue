<script setup lang="ts">
import type { ChatSession } from '~/types/chat'

const props = defineProps<{
  open: boolean
  sessions: ChatSession[]
  currentSessionId: string | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'select': [id: string]
  'new': []
  'delete': [id: string]
}>()

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function onSelect(id: string) {
  emit('select', id)
  emit('update:open', false)
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/40 z-40"
      @click="emit('update:open', false)"
    />
  </Transition>

  <Transition name="slide">
    <aside
      v-if="open"
      class="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white flex flex-col shadow-2xl"
    >
      <div class="flex items-center justify-between px-5 pt-12 pb-4 border-b border-[#F0EBE5]">
        <span class="text-[17px] font-semibold text-[#333333]">历史对话</span>
        <button
          class="p-2 rounded-xl text-[#FF9F43] bg-[#FFF4E5] active:bg-[#FFE4C0] transition-colors"
          @click="emit('new')"
        >
          <UIcon name="i-heroicons-plus" class="w-5 h-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto py-2">
        <div v-if="loading" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 text-[#AFA49C] animate-spin" />
        </div>

        <div v-else-if="sessions.length === 0" class="flex flex-col items-center py-12 px-6 text-center">
          <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-10 h-10 text-[#D4C9BE] mb-3" />
          <p class="text-sm text-[#AFA49C]">还没有聊天记录</p>
        </div>

        <template v-else>
          <button
            v-for="session in sessions"
            :key="session.id"
            class="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors group"
            :class="session.id === currentSessionId
              ? 'bg-[#FFF4E5]'
              : 'hover:bg-[#F9F7F2] active:bg-[#F3F1ED]'"
            @click="onSelect(session.id)"
          >
            <div
              class="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              :class="session.id === currentSessionId ? 'bg-[#FF9F43]' : 'bg-[#F0EBE5]'"
            >
              <UIcon
                name="i-heroicons-chat-bubble-left-ellipsis-20-solid"
                class="w-4 h-4"
                :class="session.id === currentSessionId ? 'text-white' : 'text-[#AFA49C]'"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] text-[#333333] truncate font-medium">{{ session.title }}</p>
              <p class="text-[12px] text-[#AFA49C] mt-0.5">{{ formatTime(session.updated_at) }}</p>
            </div>
            <button
              class="shrink-0 p-1.5 rounded-lg text-[#AFA49C] opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-50 transition-all"
              @click.stop="emit('delete', session.id)"
            >
              <UIcon name="i-heroicons-trash" class="w-4 h-4" />
            </button>
          </button>
        </template>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
