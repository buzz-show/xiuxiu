<script setup lang="ts">
import type { HealthRecord } from '~/types/pet'

const props = defineProps<{ petId: string }>()

const { data: records, pending, refresh } = await useFetch<HealthRecord[]>(
  () => `/api/pets/${props.petId}/health`,
)

const typeLabel: Record<string, string> = {
  vaccine: '💉 疫苗',
  deworming: '🐛 驱虫',
  checkup: '🏥 体检',
  illness: '🤒 疾病',
  other: '📝 其他',
}

// 新增健康记录表单
const showForm = ref(false)
const saving = ref(false)
const form = reactive({
  type: 'vaccine' as HealthRecord['type'],
  title: '',
  date: new Date().toISOString().split('T')[0],
  note: '',
  next_due_date: '',
})

const typeOptions = [
  { label: '💉 疫苗', value: 'vaccine' },
  { label: '🐛 驱虫', value: 'deworming' },
  { label: '🏥 体检', value: 'checkup' },
  { label: '🤒 疾病', value: 'illness' },
  { label: '📝 其他', value: 'other' },
]

async function addRecord() {
  if (!form.title.trim()) return
  saving.value = true
  try {
    await $fetch(`/api/pets/${props.petId}/health`, {
      method: 'POST',
      body: {
        type: form.type,
        title: form.title,
        date: form.date,
        note: form.note || undefined,
        next_due_date: form.next_due_date || undefined,
      },
    })
    await refresh()
    showForm.value = false
    Object.assign(form, {
      type: 'vaccine',
      title: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
      next_due_date: '',
    })
  } catch {
    // ignore
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <!-- 标题行 -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-semibold text-[#18181B]">健康记录</h2>
      <button
        class="text-xs font-medium px-3 py-1 rounded-full transition-colors"
        style="background-color: var(--warm-light); color: var(--warm-deep)"
        @click="showForm = !showForm"
      >
        {{ showForm ? '取消' : '+ 添加' }}
      </button>
    </div>

    <!-- 新增表单 -->
    <div
      v-if="showForm"
      class="bg-white rounded-2xl p-4 mb-3 shadow-sm space-y-3"
    >
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="opt in typeOptions"
          :key="opt.value"
          class="text-xs px-3 py-1.5 rounded-full border transition-colors"
          :style="form.type === opt.value
            ? 'background-color: var(--warm-deep); color: white; border-color: var(--warm-deep)'
            : 'background-color: white; color: #71717A; border-color: #E4E4E7'"
          @click="form.type = opt.value as HealthRecord['type']"
        >
          {{ opt.label }}
        </button>
      </div>
      <UInput v-model="form.title" placeholder="记录标题（如：狂犬疫苗接种）" />
      <div class="grid grid-cols-2 gap-2">
        <div>
          <p class="text-xs text-[#71717A] mb-1">记录日期</p>
          <UInput v-model="form.date" type="date" />
        </div>
        <div>
          <p class="text-xs text-[#71717A] mb-1">下次到期</p>
          <UInput v-model="form.next_due_date" type="date" />
        </div>
      </div>
      <UInput v-model="form.note" placeholder="备注（可选）" />
      <UButton block :loading="saving" @click="addRecord">保存记录</UButton>
    </div>

    <!-- 加载中 -->
    <div v-if="pending" class="flex justify-center py-8">
      <div class="w-6 h-6 rounded-full border-2 border-[#EADBC8] border-t-[#C9B7A3] animate-spin" />
    </div>

    <!-- 空状态 -->
    <div v-else-if="!records?.length" class="flex flex-col items-center gap-2 py-10">
      <span class="text-3xl">📋</span>
      <p class="text-sm text-[#A1A1AA]">暂无健康记录</p>
      <p class="text-xs text-[#A1A1AA]">点击「+ 添加」记录疫苗、驱虫、体检等</p>
    </div>

    <!-- 记录列表 -->
    <div v-else class="space-y-2">
      <div
        v-for="r in records"
        :key="r.id"
        class="bg-white rounded-2xl p-4 flex gap-3 items-start shadow-sm"
      >
        <span class="text-base mt-0.5">{{ typeLabel[r.type]?.split(' ')[0] ?? '📝' }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-[#18181B]">{{ r.title }}</p>
          <div class="flex items-center gap-2 mt-1 flex-wrap">
            <span class="text-xs text-[#71717A]">{{ r.date }}</span>
            <span
              v-if="r.next_due_date"
              class="text-xs px-2 py-0.5 rounded-full"
              :style="{
                backgroundColor: new Date(r.next_due_date) < new Date() ? '#FEE2E2' : '#F5EFE6',
                color: new Date(r.next_due_date) < new Date() ? '#B91C1C' : '#C9B7A3',
              }"
            >
              下次: {{ r.next_due_date }}
            </span>
          </div>
          <p v-if="r.note" class="text-xs text-[#71717A] mt-1.5 leading-relaxed">{{ r.note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
