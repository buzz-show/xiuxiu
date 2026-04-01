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

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const toLocalDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.floor((toLocalDay(now) - toLocalDay(date)) / 86400000)

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function onSelect(id: string) {
  emit('select', id)
  isOpen.value = false
}

const pendingDeleteId = ref<string | null>(null)
const showConfirm = computed({
  get: () => pendingDeleteId.value !== null,
  set: (v) => { if (!v) pendingDeleteId.value = null },
})

function requestDelete(id: string) {
  pendingDeleteId.value = id
}

function confirmDelete() {
  if (pendingDeleteId.value) {
    emit('delete', pendingDeleteId.value)
    pendingDeleteId.value = null
  }
}
</script>

<template>
  <USlideover
    v-model:open="isOpen"
    side="left"
    :ui="{ content: 'w-72 ring-0 divide-y-0' }"
  >
    <!-- 头部 -->
    <template #header>
      <div class="flex items-center justify-between w-full pt-8">
        <span class="text-[17px] font-semibold text-[#333333]">历史对话</span>
        <UButton
          icon="i-heroicons-plus"
          color="warning"
          variant="subtle"
          @click="emit('new')"
        />
      </div>
    </template>

    <!-- 会话列表 -->
    <template #body>
      <!-- 加载中 -->
      <div v-if="loading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 text-[#AFA49C] animate-spin" />
      </div>

      <!-- 空状态 -->
      <div v-else-if="sessions.length === 0" class="flex flex-col items-center py-12 px-6 text-center">
        <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-10 h-10 text-[#D4C9BE] mb-3" />
        <p class="text-sm text-[#AFA49C]">还没有聊天记录</p>
      </div>

      <!-- 会话条目 -->
      <template v-else>
        <div
          v-for="session in sessions"
          :key="session.id"
          role="button"
          tabindex="0"
          class="w-full flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer"
          :class="session.id === currentSessionId
            ? 'bg-[#FFF4E5]'
            : 'hover:bg-[#F9F7F2] active:bg-[#F3F1ED]'"
          @click="onSelect(session.id)"
          @keydown.enter.space.prevent="onSelect(session.id)"
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
          <!-- 删除按钮 -->
          <UButton
            icon="i-heroicons-trash"
            color="neutral"
            variant="ghost"
            size="sm"
            class="shrink-0 text-[#AFA49C]"
            @click.stop="requestDelete(session.id)"
          />
        </div>
      </template>
    </template>
  </USlideover>

  <!-- 删除二次确认弹窗 -->
  <UModal
    v-model:open="showConfirm"
    :ui="{ footer: 'justify-end gap-2' }"
  >
    <template #header>
      <p class="text-base font-semibold text-[#333333]">删除对话</p>
    </template>
    <template #body>
      <p class="text-sm text-[#666666]">确定要删除这条对话记录吗？此操作无法撤销。</p>
    </template>
    <template #footer>
      <UButton
        label="取消"
        color="neutral"
        variant="ghost"
        @click="showConfirm = false"
      />
      <UButton
        label="删除"
        color="error"
        @click="confirmDelete"
      />
    </template>
  </UModal>
</template>
