<script setup lang="ts">
definePageMeta({
  layout: false
})

const { sessions, loading: sessionsLoading, loadSessions, createSession, deleteSession, updateSessionTime } = useChatSessions()
const currentSessionId = ref<string | null>(null)
const drawerOpen = ref(false)
const input = ref('')

const { messages, sending, loadingHistory, loadHistory, sendMessage } = useChat(currentSessionId)

// 选择会话
async function selectSession(id: string) {
  currentSessionId.value = id
  await loadHistory()
}

// 新建会话
async function handleNewSession() {
  const session = await createSession()
  await selectSession(session.id)
  drawerOpen.value = false
}

// 删除会话
async function handleDeleteSession(id: string) {
  await deleteSession(id)
  // 若删除的是当前会话，切换到最新的
  if (currentSessionId.value === id) {
    const next = sessions.value[0]
    if (next) {
      await selectSession(next.id)
    } else {
      currentSessionId.value = null
      messages.value = []
    }
  }
}

async function onSend() {
  console.log('发送消息:当前会话id', input.value, currentSessionId.value)
  if (!input.value.trim()) return
  // 若还没有会话，先创建一个
  if (!currentSessionId.value) {
    const session = await createSession()
    currentSessionId.value = session.id
  }
  const text = input.value
  input.value = ''
  await sendMessage(text)
  updateSessionTime(currentSessionId.value!)
}

// 初始化：加载会话列表，选中最新会话
onMounted(async () => {
  await loadSessions()
  if (sessions.value.length > 0) {
    await selectSession(sessions.value[0].id)
  }
})
</script>

<template>
  <div class="flex flex-col h-screen bg-[#F9F7F2] text-[#333333] overflow-hidden">
    <!-- 顶部导航栏 -->
    <header
      class="bg-white/90 backdrop-blur-sm border-b border-[#F0EBE5] flex items-center px-4 gap-3"
      style="padding-top: max(env(safe-area-inset-top, 0px), 44px); padding-bottom: 12px"
    >
      <!-- 返回按钮 -->
      <button
        class="p-2 rounded-xl text-[#8B7E74] hover:bg-[#F3F1ED] active:bg-[#EAE5E0] transition-colors"
        @click="$router.back()"
      >
        <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
      </button>

      <!-- 标题 -->
      <div class="flex-1 text-center">
        <p class="text-[16px] font-semibold text-[#333333]">嗅嗅助理</p>
      </div>

      <!-- 历史记录按钮 -->
      <button
        class="p-2 rounded-xl text-[#8B7E74] hover:bg-[#F3F1ED] active:bg-[#EAE5E0] transition-colors"
        @click="drawerOpen = true"
      >
        <UIcon name="i-heroicons-clock" class="w-5 h-5" />
      </button>
    </header>

    <!-- 历史加载中遮罩 -->
    <div
      v-if="loadingHistory"
      class="absolute inset-0 z-10 flex items-center justify-center bg-[#F9F7F2]/80"
    >
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 text-[#FF9F43] animate-spin" />
    </div>

    <!-- 消息列表 -->
    <ChatMessageList :messages="messages" />

    <!-- 底部输入区域 -->
    <ChatInput v-model="input" :loading="sending" @send="onSend" />

    <!-- 会话抽屉 -->
    <ChatSessionDrawer
      v-model:open="drawerOpen"
      :sessions="sessions"
      :current-session-id="currentSessionId"
      :loading="sessionsLoading"
      @select="selectSession"
      @new="handleNewSession"
      @delete="handleDeleteSession"
    />
  </div>
</template>
