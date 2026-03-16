<script setup lang="ts">
const props = defineProps<{ modelValue: string; loading?: boolean }>()
const emit = defineEmits<{ "update:modelValue": [v: string]; send: [] }>()

function onKeydown(e: KeyboardEvent) {
}
</script>
<template>
  <div class="border-t bg-white px-3 py-2 flex gap-2 items-end">
    <UTextarea
      :value="props.modelValue"
      rows="1"
      autoresize
      placeholder="问问宠物健康相关的问题..."
      class="flex-1 resize-none"
      @input="emit("update:modelValue", ($event.target as HTMLTextAreaElement).value)"
      @keydown="onKeydown"
    />
    <UButton
      icon="i-heroicons-paper-airplane"
      :loading="props.loading"
      @click="emit("send")"
    />
  </div>
</template>