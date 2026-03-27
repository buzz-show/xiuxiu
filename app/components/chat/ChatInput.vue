<script setup lang="ts">
const props = defineProps<{ modelValue: string; loading?: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'send': []
}>()

const canSend = computed(() => props.modelValue.trim() !== '' && !props.loading)

function handleSend() {
  if (!canSend.value) return
  emit('send')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <footer
    class="bg-white/90 border-t border-[#F0EBE5] px-4 pt-4"
    style="padding-bottom: max(env(safe-area-inset-bottom, 0px), 24px)"
  >
    <div class="flex items-center gap-3">
      <!-- 输入框 -->
      <div class="flex-1 relative">
        <input
          :value="modelValue"
          type="text"
          placeholder="问问宠物健康相关的问题..."
          class="w-full bg-[#F3F1ED] border-none rounded-[20px] py-4 px-6 pr-12 text-[15px] transition-all outline-none focus:ring-2 focus:ring-[#FF9F43]/20 placeholder:text-[#AFA49C] text-[#333333]"
          :disabled="loading"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @keydown="handleKeydown"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 p-2 pointer-events-none">
          <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-5 h-5 text-[#AFA49C]" />
        </span>
      </div>

      <!-- 发送按钮 -->
      <button
        :disabled="!canSend"
        class="p-4 rounded-[20px] shadow-lg transition-all transform active:scale-95 shrink-0"
        :class="canSend ? 'bg-[#FF9F43] text-white' : 'bg-[#E5E0DA] text-[#AFA49C] cursor-not-allowed'"
        @click="handleSend"
      >
        <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5" />
      </button>
    </div>

    <p class="text-center text-[10px] text-[#AFA49C] mt-3 uppercase tracking-widest">
      AI 可能会产生误差，建议咨询专业兽医
    </p>
  </footer>
</template>
