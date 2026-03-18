<script setup lang="ts">
import type { Pet } from "~/types/pet"
defineProps<{ pet: Pet }>()

function speciesEmoji(species?: string) {
  if (species === 'cat') return '🐱'
  if (species === 'dog') return '🐶'
  return '🐾'
}
</script>
<template>
  <NuxtLink
    :to="`/pets/${pet.id}`"
    class="flex items-center gap-3 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-transform"
    style="background-color: var(--warm-light)"
  >
    <div
      class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-2xl flex-shrink-0"
      style="background-color: var(--warm-primary)"
    >
      <img v-if="pet.avatar_url" :src="pet.avatar_url" class="w-full h-full object-cover" />
      <span v-else>{{ speciesEmoji(pet.species) }}</span>
    </div>
    <div class="flex-1 min-w-0">
      <p class="font-semibold text-[#18181B] truncate">{{ pet.name }}</p>
      <p class="text-sm text-[#71717A]">{{ pet.breed || (pet.species === "cat" ? "猫咪" : pet.species === "dog" ? "狗狗" : "宠物") }}</p>
    </div>
    <UIcon name="i-heroicons-chevron-right" class="text-[#C9B7A3] text-lg flex-shrink-0" />
  </NuxtLink>
</template>
