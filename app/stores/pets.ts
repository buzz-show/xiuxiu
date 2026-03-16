import { defineStore } from 'pinia'
import type { Pet } from '~/types/pet'

export const usePetsStore = defineStore('pets', () => {
  const list = ref<Pet[]>([])
  const loaded = ref(false)

  function setPets(newPets: Pet[]) {
    list.value = newPets
    loaded.value = true
  }

  function upsertPet(pet: Pet) {
    const idx = list.value.findIndex(p => p.id === pet.id)
    if (idx !== -1) list.value[idx] = pet
    else list.value.unshift(pet)
  }

  return { list, loaded, setPets, upsertPet }
})
