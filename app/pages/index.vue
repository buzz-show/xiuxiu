<script setup lang="ts">
const { pets, loading, error, fetchPets } = usePets()
onMounted(fetchPets)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <UButton to="/pets/new" icon="i-heroicons-plus" size="sm">添加宠物</UButton>
    </div>
    <UAlert v-if="error" color="error" variant="soft" :description="error" class="mb-4" />
    <div v-if="loading" class="text-center py-10 text-gray-400">加载中...</div>
    <div v-else-if="!pets.length" class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-3">🐾</p>
      <p class="text-sm">还没有宠物档案，点击右上角添加吧！</p>
    </div>
    <div v-else class="grid gap-3">
      <PetCard v-for="pet in pets" :key="pet.id" :pet="pet" />
    </div>
  </div>
</template>
