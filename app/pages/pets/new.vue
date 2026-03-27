<script setup lang="ts">
import type { Pet } from '~/types/pet'

definePageMeta({
  layout: false
})

const saving = ref(false)
const toast = useToast()
const petsStore = usePetsStore()
const router = useRouter()

const handleSave = async (payload: Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  if (saving.value) return
  saving.value = true
  try {
    const pet = await $fetch('/api/pets', { method: 'POST', body: payload })
    petsStore.upsertPet(pet as any)
    router.push('/')
  } catch (e: any) {
    toast.add({ title: '保存失败', description: e?.data?.message ?? '请稍后重试', color: 'error' })
  } finally {
    saving.value = false
  }
}

const handleCancel = () => router.back()
</script>

<template>
  <div class="min-h-screen bg-[#FFFCF8] font-sans text-zinc-700 selection:bg-[#EADBC8]/30">
    <UiAppHeader title="建立档案">
      <template #left>
        <button
          class="p-2 px-3 hover:bg-gray-100 rounded-full transition-colors active:scale-95 text-sm font-medium text-[#8B7E74]"
          @click="handleCancel"
        >
          取消
        </button>
      </template>
    </UiAppHeader>

    <main class="mx-auto max-w-lg p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PetForm
        :submitting="saving"
        submit-label="确认并开启健康记录"
        @submit="handleSave"
      />
    </main>
  </div>
</template>
