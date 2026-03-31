import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSupabaseMock } from '../../helpers/supabase-mock'
import { mockUser, mockPet } from '../../helpers/fixtures'
import { serverSupabaseUser } from '#supabase/server'

// createServerSupabaseClient 是 Nitro 全局（setup.ts 中已注册为 global），直接覆盖
const mockEvent = {} as any
const gbl = global as any

describe('GET /api/pets', () => {
  beforeEach(() => {
    vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
    gbl.getRouterParam.mockReturnValue(undefined)
    gbl.readBody.mockResolvedValue(undefined)
  })

  it('returns 401 when user is not authenticated', async () => {
    vi.mocked(serverSupabaseUser).mockResolvedValueOnce(null as any)

    const { default: handler } = await import('../../../server/api/pets/index.get')
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('returns pets list for authenticated user', async () => {
    const mockClient = createSupabaseMock({ pets: { data: [mockPet], error: null } })
    gbl.createServerSupabaseClient.mockReturnValue(mockClient)

    const { default: handler } = await import('../../../server/api/pets/index.get')
    const result = await handler(mockEvent)

    expect(result).toEqual([mockPet])
    expect(mockClient.from).toHaveBeenCalledWith('pets')
  })

  it('throws 500 on database error', async () => {
    const mockClient = createSupabaseMock({ pets: { data: null, error: { message: 'DB error' } } })
    gbl.createServerSupabaseClient.mockReturnValue(mockClient)

    const { default: handler } = await import('../../../server/api/pets/index.get')
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 500 })
  })
})

describe('POST /api/pets', () => {
  beforeEach(() => {
    vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
  })

  it('returns 400 when name is missing', async () => {
    gbl.readBody.mockResolvedValueOnce({})

    const { default: handler } = await import('../../../server/api/pets/index.post')
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('returns 400 when name is empty string', async () => {
    gbl.readBody.mockResolvedValueOnce({ name: '   ' })

    const { default: handler } = await import('../../../server/api/pets/index.post')
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('returns created pet on success', async () => {
    gbl.readBody.mockResolvedValueOnce({ name: '球球', species: 'dog' })
    const mockClient = createSupabaseMock({ pets: { data: mockPet, error: null } })
    gbl.createServerSupabaseClient.mockReturnValue(mockClient)

    const { default: handler } = await import('../../../server/api/pets/index.post')
    const result = await handler(mockEvent)

    expect(result).toEqual(mockPet)
    expect(mockClient.from).toHaveBeenCalledWith('pets')
  })
})
