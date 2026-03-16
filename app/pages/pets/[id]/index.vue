<script setup lang="ts">
const route = useRoute()
const { getPet } = usePets()
const { data: pet, error } = await useAsyncData('pet', () => getPet(route.params.id as string))
if (error.value) throw createError({ statusCode: 404, message: '宠物不存在' })
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <UButton icon="i-heroicons-arrow-left" variant="ghost" @click="$router.back()" />
      <h1 class="text-xl font-bold">{{ pet?.name }}</h1>
      <UButton :to="`/pets/${pet?.id}/edit`" icon="i-heroicons-pencil" variant="ghost" class="ml-auto" />
    </div>
    <PetAvatar :pet="pet ?? null" class="mb-4" />
    <div class="bg-white rounded-xl p-4 space-y-3 mb-4 shadow-sm">
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">种类</span>
        <span>{{ pet?.species === 'cat' ? '猫' : pet?.species === 'dog' ? '狗' : '其他' }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">品种</span><span>{{ pet?.breed || '-' }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">生日</span><span>{{ pet?.birthday || '-' }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">性别</span>
        <span>{{ pet?.gender === 'male' ? '公' : pet?.gender === 'female' ? '母' : '未知' }}</span>
      </div>
    </div>
    <PetHealthTimeline v-if="pet" :pet-id="pet.id" />
  </div>
</template>
