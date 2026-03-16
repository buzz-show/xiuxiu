<script setup lang="ts">
import type { Pet } from "~/types/pet"
defineProps<{ pet: Pet }>()
</script>
<template>
  <NuxtLink :to="`/pets/${pet.id}`" class="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
    <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl overflow-hidden">
      <img v-if="pet.avatar_url" :src="pet.avatar_url" class="w-full h-full object-cover" />
      <span v-else>{{ pet.species === "cat" ? "🐱" : pet.species === "dog" ? "🐶" : "🐾" }}</span>
    </div>
    <div class="flex-1 min-w-0">
      <p class="font-semibold truncate">{{ pet.name }}</p>
      <p class="text-sm text-gray-500">{{ pet.breed || (pet.species === "cat" ? "猫" : pet.species === "dog" ? "狗" : "宠物") }}</p>
    </div>
    <UIcon name="i-heroicons-chevron-right" class="text-gray-400" />
  </NuxtLink>
</template>