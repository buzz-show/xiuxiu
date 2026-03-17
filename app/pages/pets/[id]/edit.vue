<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getPet, updatePet, error } = usePets()
const { data: pet } = await useAsyncData('pet-edit', () => getPet(route.params.id as string))
const form = reactive({ name: pet.value?.name ?? '', breed: pet.value?.breed ?? '', birthday: pet.value?.birthday ?? '', notes: pet.value?.notes ?? '' })
const saving = ref(false)

async function onSubmit() {
  saving.value = true
  try {
    await updatePet(route.params.id as string, form)
    router.back()
  } catch {
    // error 已由 usePets 内部写入 error ref，模板中展示
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-6">
      <UButton icon="i-heroicons-arrow-left" variant="ghost" @click="$router.back()" />
      <h1 class="text-xl font-bold">编辑宠物信息</h1>
    </div>
    <UAlert v-if="error" color="red" variant="soft" :description="error" class="mb-4" />
    <UForm :state="form" class="space-y-4" @submit="onSubmit">
      <UFormField label="宠物名字" name="name"><UInput v-model="form.name" /></UFormField>
      <UFormField label="品种" name="breed"><UInput v-model="form.breed" /></UFormField>
      <UFormField label="生日" name="birthday"><UInput v-model="form.birthday" type="date" /></UFormField>
      <UFormField label="备注" name="notes"><UTextarea v-model="form.notes" /></UFormField>
      <UButton type="submit" block :loading="saving">保存</UButton>
    </UForm>
  </div>
</template>
