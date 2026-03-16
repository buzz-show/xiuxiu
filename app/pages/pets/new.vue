<script setup lang="ts">
const { createPet } = usePets()
const router = useRouter()
const saving = ref(false)
const form = reactive({ name: '', species: 'cat', breed: '', birthday: '', gender: 'unknown', notes: '' })

async function onSubmit() {
  saving.value = true
  try {
    await createPet(form)
    router.push('/')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-6">
      <UButton icon="i-heroicons-arrow-left" variant="ghost" @click="$router.back()" />
      <h1 class="text-xl font-bold">添加宠物</h1>
    </div>
    <UForm :state="form" class="space-y-4" @submit="onSubmit">
      <UFormField label="宠物名字" name="name" required>
        <UInput v-model="form.name" placeholder="例如：小橘" />
      </UFormField>
      <UFormField label="种类" name="species">
        <USelect v-model="form.species" :options="[{label:'猫',value:'cat'},{label:'狗',value:'dog'},{label:'其他',value:'other'}]" />
      </UFormField>
      <UFormField label="品种" name="breed">
        <UInput v-model="form.breed" placeholder="例如：英短" />
      </UFormField>
      <UFormField label="生日" name="birthday">
        <UInput v-model="form.birthday" type="date" />
      </UFormField>
      <UFormField label="性别" name="gender">
        <USelect v-model="form.gender" :options="[{label:'公',value:'male'},{label:'母',value:'female'},{label:'未知',value:'unknown'}]" />
      </UFormField>
      <UFormField label="备注" name="notes">
        <UTextarea v-model="form.notes" placeholder="其他信息..." />
      </UFormField>
      <UButton type="submit" block :loading="saving">保存</UButton>
    </UForm>
  </div>
</template>
