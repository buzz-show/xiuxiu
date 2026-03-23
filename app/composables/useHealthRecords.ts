import type { HealthRecord } from '~/types/pet'

export interface Reminder {
  id: string
  icon: string
  title: string
  time: string
  status: 'normal' | 'warning' | 'error'
  diffDays: number
}

const TYPE_ICON: Record<string, string> = {
  vaccine: '💉',
  deworming: '🐛',
  checkup: '🏥',
  illness: '🤒',
  other: '📝',
}

export function useHealthRecords() {
  const records = ref<HealthRecord[]>([])
  const loading = ref(false)
  const currentPetId = ref<string | undefined>()

  async function fetchHealthRecords(petId: string) {
    if (!petId) { records.value = []; return }
    if (currentPetId.value === petId && records.value.length > 0) return

    loading.value = true
    currentPetId.value = petId
    try {
      const data = await $fetch<HealthRecord[]>(`/api/pets/${petId}/health`)
      records.value = data ?? []
    } catch {
      records.value = []
    } finally {
      loading.value = false
    }
  }

  const reminders = computed<Reminder[]>(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    return records.value
      .filter(r => r.next_due_date)
      .map(r => {
        const due = new Date(r.next_due_date!)
        due.setHours(0, 0, 0, 0)
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        let status: 'normal' | 'warning' | 'error'
        if (diffDays < 0) status = 'error'
        else if (diffDays <= 7) status = 'warning'
        else status = 'normal'

        let timeText: string
        if (diffDays < 0) timeText = `已过期 ${Math.abs(diffDays)} 天`
        else if (diffDays === 0) timeText = '今天到期'
        else timeText = `${diffDays} 天后`

        return {
          id: r.id,
          icon: TYPE_ICON[r.type] || '📝',
          title: r.title,
          time: timeText,
          status,
          diffDays,
        }
      })
      .sort((a, b) => a.diffDays - b.diffDays)
  })

  const lastByType = computed(() => {
    const result: Record<string, HealthRecord | undefined> = {}
    for (const r of records.value) {
      if (!result[r.type]) result[r.type] = r
    }
    return result
  })

  const groomingSummary = computed(() => {
    const types: Array<{ type: string; label: string }> = [
      { type: 'vaccine', label: '上次疫苗' },
      { type: 'deworming', label: '上次驱虫' },
      { type: 'checkup', label: '上次体检' },
    ]
    return types.map(({ type, label }) => ({
      label,
      date: lastByType.value[type]?.date ?? null,
      title: lastByType.value[type]?.title ?? null,
    }))
  })

  const vaccineStatus = computed(() => {
    const r = lastByType.value['vaccine']
    if (!r?.next_due_date) return { text: '暂无记录', ok: false }
    return new Date(r.next_due_date) >= new Date()
      ? { text: '正常', ok: true }
      : { text: '已过期', ok: false }
  })

  const dewormingStatus = computed(() => {
    const r = lastByType.value['deworming']
    if (!r?.next_due_date) return { text: '暂无记录', ok: false }
    return new Date(r.next_due_date) >= new Date()
      ? { text: '正常', ok: true }
      : { text: '已过期', ok: false }
  })

  return {
    records,
    loading,
    fetchHealthRecords,
    reminders,
    lastByType,
    groomingSummary,
    vaccineStatus,
    dewormingStatus,
  }
}
