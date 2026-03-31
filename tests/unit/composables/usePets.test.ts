// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { mockPet, mockUser } from '../../helpers/fixtures'

// Vue 响应式 API 作为全局，供 composable 中的自由变量使用
Object.assign(globalThis, { ref, nextTick })

// $fetch mock
const fetchMock = vi.fn()
;(globalThis as any).$fetch = fetchMock

describe('usePets', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 重置模块缓存，确保每次获得新的 composable 状态
    vi.resetModules()
  })

  it('fetchPets sets pets list from API response', async () => {
    fetchMock.mockResolvedValue([mockPet])

    const { usePets } = await import('../../../app/composables/usePets')
    const { pets, fetchPets } = usePets()

    expect(pets.value).toEqual([])
    await fetchPets()
    expect(pets.value).toEqual([mockPet])
    expect(fetchMock).toHaveBeenCalledWith('/api/pets')
  })

  it('fetchPets sets error on failure', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'))

    const { usePets } = await import('../../../app/composables/usePets')
    const { pets, error, fetchPets } = usePets()

    await fetchPets()

    expect(pets.value).toEqual([])
    expect(error.value).toBeTruthy()
  })

  it('createPet calls POST and prepends to pet list', async () => {
    const newPetData = { name: '小白', species: 'cat' }
    fetchMock
      .mockResolvedValueOnce([mockPet])   // fetchPets
      .mockResolvedValueOnce({ ...mockPet, ...newPetData, id: 'pet-002' }) // createPet

    const { usePets } = await import('../../../app/composables/usePets')
    const { pets, fetchPets, createPet } = usePets()

    await fetchPets()
    const created = await createPet(newPetData as any)

    expect(fetchMock).toHaveBeenLastCalledWith('/api/pets', {
      method: 'POST',
      body: newPetData,
    })
    expect(pets.value[0]).toMatchObject({ name: '小白' })
    expect(created).toMatchObject({ name: '小白' })
  })

  it('deletePet removes pet from list', async () => {
    fetchMock
      .mockResolvedValueOnce([mockPet])
      .mockResolvedValueOnce({ success: true })

    const { usePets } = await import('../../../app/composables/usePets')
    const { pets, fetchPets, deletePet } = usePets()

    await fetchPets()
    expect(pets.value).toHaveLength(1)

    await deletePet(mockPet.id)

    expect(fetchMock).toHaveBeenLastCalledWith(`/api/pets/${mockPet.id}`, { method: 'DELETE' })
    expect(pets.value).toHaveLength(0)
  })
})
