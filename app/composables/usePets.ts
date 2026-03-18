import type { Pet, NewPet } from '~/types/pet'

export function usePets() {
  const pets = ref<Pet[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPets() {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Pet[]>('/api/pets')
      pets.value = data ?? []
    } catch (e: any) {
      if (e?.statusCode === 401) return navigateTo('/auth/login')
      error.value = e?.data?.message ?? '获取宠物列表失败'
    } finally {
      loading.value = false
    }
  }

  async function getPet(id: string) {
    return await $fetch<Pet>(`/api/pets/${id}`)
  }

  async function createPet(payload: NewPet) {
    error.value = null
    try {
      const pet = await $fetch<Pet>('/api/pets', { method: 'POST', body: payload })
      pets.value.unshift(pet)
      return pet
    } catch (e: any) {
      if (e?.statusCode === 401) return navigateTo('/auth/login')
      error.value = e?.data?.message ?? '创建宠物失败'
      throw e
    }
  }

  async function updatePet(id: string, payload: Partial<Pet>) {
    error.value = null
    try {
      const updated = await $fetch<Pet>(`/api/pets/${id}`, { method: 'PUT', body: payload })
      const idx = pets.value.findIndex(p => p.id === id)
      if (idx !== -1) pets.value[idx] = updated
      return updated
    } catch (e: any) {
      if (e?.statusCode === 401) return navigateTo('/auth/login')
      error.value = e?.data?.message ?? '更新宠物信息失败'
      throw e
    }
  }

  return { pets, loading, error, fetchPets, getPet, createPet, updatePet }
}
