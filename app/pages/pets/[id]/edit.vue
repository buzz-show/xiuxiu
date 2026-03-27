<script setup lang="ts">
import type { Pet } from '~/types/pet'

definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const petsStore = usePetsStore()

const { getPet } = usePets()
const { data: pet, error: loadError } = await useAsyncData(
  `pet-edit-${route.params.id}`,
  () => getPet(route.params.id as string)
)

const saving = ref(false)

const handleSave = async (payload: Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  if (saving.value) return
  saving.value = true
  try {
    const updated = await $fetch<Pet>(`/api/pets/${route.params.id}`, {
      method: 'PUT',
      body: payload,
    })
    petsStore.upsertPet(updated)
    router.back()
  } catch (e: any) {
    toast.add({ title: '保存失败', description: e?.data?.message ?? '请稍后重试', color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FFFCF8] font-sans text-zinc-700 selection:bg-[#EADBC8]/30">
    <UiAppHeader title="编辑档案" />

    <main class="mx-auto max-w-lg p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <UAlert
        v-if="loadError"
        color="red"
        variant="soft"
        :description="loadError.message ?? '加载失败，请返回重试'"
        class="mb-6"
      />
      <PetForm
        v-else
        :initial-data="pet ?? undefined"
        :submitting="saving"
        submit-label="保存修改"
        @submit="handleSave"
      />
    </main>
  </div>
</template>
