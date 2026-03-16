import type { Pet, NewPet } from '~/types/pet'

export function usePets() {
  const pets = ref<Pet[]>([])
  const loading = ref(false)

  async function fetchPets() {
    loading.value = true
    const data = await $fetch<Pet[]>('/api/pets')
    pets.value = data ?? []
    loading.value = false
  }

  async function getPet(id: string) {
    return await $fetch<Pet>(`/api/pets/${id}`)
  }

  async function createPet(payload: NewPet) {
    const pet = await $fetch<Pet>('/api/pets', { method: 'POST', body: payload })
    pets.value.unshift(pet)
    return pet
  }

  async function updatePet(id: string, payload: Partial<Pet>) {
    const updated = await $fetch<Pet>(`/api/pets/${id}`, { method: 'PUT', body: payload })
    const idx = pets.value.findIndex(p => p.id === id)
    if (idx !== -1) pets.value[idx] = updated
    return updated
  }

  return { pets, loading, fetchPets, getPet, createPet, updatePet }
}
