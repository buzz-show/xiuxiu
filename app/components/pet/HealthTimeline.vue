<script setup lang="ts">
const props = defineProps<{ petId: string }>()
const { data: records, loading } = await useFetch(`/api/pets/${props.petId}/health`)
const typeLabel: Record<string, string> = { vaccine: "💉 疫苗", deworming: "🐛 驱虫", checkup: "🏥 体检", illness: "🤒 疾病", other: "📝 其他" }
</script>
<template>
  <div>
    <h2 class="font-semibold mb-3">健康记录</h2>
    <div v-if="loading" class="text-gray-400 text-sm">加载中...</div>
    <div v-else class="space-y-2">
      <div v-for="r in records" :key="r.id" class="bg-white rounded-xl p-3 flex gap-3 items-start">
        <span class="text-sm">{{ typeLabel[r.type] || "📝" }}</span>
        <div class="flex-1">
          <p class="text-sm font-medium">{{ r.title }}</p>
          <p class="text-xs text-gray-400">{{ r.date }}{{ r.next_due_date ? " · 下次: " + r.next_due_date : "" }}</p>
          <p v-if="r.note" class="text-xs text-gray-500 mt-1">{{ r.note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>