<script setup lang="ts">
import type { Pet } from "~/types/pet"
import { Camera, CameraResultType } from "@capacitor/camera"
const props = defineProps<{ pet: Pet | null }>()
const { updatePet } = usePets()

async function pickPhoto() {
  try {
    const photo = await Camera.getPhoto({ quality: 80, resultType: CameraResultType.DataUrl, allowEditing: true })
    if (photo.dataUrl && props.pet) {
      // TODO: upload to Supabase Storage, get URL, then update pet
      console.log("Photo captured", photo.dataUrl.slice(0, 30))
    }
  } catch (e) { /* user cancelled */ }
}
</script>
<template>
  <div class="flex flex-col items-center gap-2">
    <button
      class="w-24 h-24 rounded-full flex items-center justify-center text-4xl overflow-hidden relative group"
      style="background-color: var(--warm-primary)"
      @click="pickPhoto"
    >
      <img v-if="pet?.avatar_url" :src="pet.avatar_url" class="w-full h-full object-cover" />
      <span v-else>{{ pet?.species === "cat" ? "🐱" : "🐶" }}</span>
      <div class="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <UIcon name="i-heroicons-camera" class="text-white text-2xl" />
      </div>
    </button>
    <p class="text-xs text-[#A1A1AA]">点击更换头像</p>
  </div>
</template>
