import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSupabaseMock } from '../../helpers/supabase-mock'
import { mockUser, mockPet } from '../../helpers/fixtures'
import { serverSupabaseUser } from '#supabase/server'

const mockEvent = {} as any
const gbl = global as any

describe('GET /api/pets/:id', () => {
  beforeEach(() => {
    vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
    gbl.getRouterParam.mockReturnValue(mockPet.id)
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(serverSupabaseUser).mockResolvedValueOnce(null as any)

    const { default: handler } = await import('../../../server/api/pets/[id].get')
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('returns 404 when pet not found', async () => {
    const mockClient = createSupabaseMock({ pets: { data: null, error: { message: 'no rows' } } })
    gbl.createServerSupabaseClient.mockReturnValue(mockClient)

    const { default: handler } = await import('../../../server/api/pets/[id].get')
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 404 })
  })

  it('returns pet when found', async () => {
    const mockClient = createSupabaseMock({ pets: { data: mockPet, error: null } })
    gbl.createServerSupabaseClient.mockReturnValue(mockClient)

    const { default: handler } = await import('../../../server/api/pets/[id].get')
    const result = await handler(mockEvent)

    expect(result).toEqual(mockPet)
  })
})

describe('DELETE /api/pets/:id', () => {
  beforeEach(() => {
    vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
    gbl.getRouterParam.mockReturnValue(mockPet.id)
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(serverSupabaseUser).mockResolvedValueOnce(null as any)

    const { default: handler } = await import('../../../server/api/pets/[id].delete')
    await expect(handler(mockEvent)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('returns success on delete', async () => {
    const mockClient = createSupabaseMock({ pets: { data: null, error: null } })
    gbl.createServerSupabaseClient.mockReturnValue(mockClient)

    const { default: handler } = await import('../../../server/api/pets/[id].delete')
    const result = await handler(mockEvent)

    expect(result).toMatchObject({ success: true })
    expect(mockClient.from).toHaveBeenCalledWith('pets')
  })
})
