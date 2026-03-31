import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSupabaseMock } from '../../helpers/supabase-mock'
import { mockUser, mockPet, mockHealthRecord } from '../../helpers/fixtures'

// mock server/utils/supabase 模块（createServerSupabaseClient 是 Nitro 自动导入，
// 但 tools.ts 通过相对路径显式导入，无法通过 global 覆盖，需要 vi.mock）
vi.mock('../../../server/utils/supabase', () => ({
  createServerSupabaseClient: vi.fn(),
}))

import { createServerSupabaseClient } from '../../../server/utils/supabase'
import {
  getPetProfilesTool,
  getHealthRecordsTool,
  addHealthRecordTool,
} from '../../../server/utils/agent/tools'

describe('getPetProfilesTool', () => {
  it('returns pet list as JSON when pets exist', async () => {
    const mockClient = createSupabaseMock({ pets: { data: [mockPet], error: null } })
    vi.mocked(createServerSupabaseClient).mockReturnValue(mockClient as any)

    const tool = getPetProfilesTool(mockUser.id)
    const result = await tool.invoke({})

    expect(result).toBe(JSON.stringify([mockPet]))
  })

  it('returns placeholder message when no pets found', async () => {
    const mockClient = createSupabaseMock({ pets: { data: [], error: null } })
    vi.mocked(createServerSupabaseClient).mockReturnValue(mockClient as any)

    const tool = getPetProfilesTool(mockUser.id)
    const result = await tool.invoke({})

    expect(result).toBe('未找到宠物档案，用户还没有添加宠物。')
  })

  it('returns error message on database error', async () => {
    const mockClient = createSupabaseMock({ pets: { data: null, error: { message: 'connection error' } } })
    vi.mocked(createServerSupabaseClient).mockReturnValue(mockClient as any)

    const tool = getPetProfilesTool(mockUser.id)
    const result = await tool.invoke({})

    expect(result).toContain('查询宠物档案失败')
    expect(result).toContain('connection error')
  })
})

describe('getHealthRecordsTool', () => {
  it('denies access when pet does not belong to user', async () => {
    // pets 表返回 null（无权限），health_records 表配置有数据
    const mockClient = createSupabaseMock({
      pets: { data: null, error: null },
      health_records: { data: [mockHealthRecord], error: null },
    })
    vi.mocked(createServerSupabaseClient).mockReturnValue(mockClient as any)

    const tool = getHealthRecordsTool(mockUser.id)
    const result = await tool.invoke({ pet_id: 'other-pet-id' })

    expect(result).toBe('无权访问该宠物的健康记录。')
  })

  it('returns health records when pet belongs to user', async () => {
    const mockClient = createSupabaseMock({
      pets: { data: { id: mockPet.id }, error: null },
      health_records: { data: [mockHealthRecord], error: null },
    })
    vi.mocked(createServerSupabaseClient).mockReturnValue(mockClient as any)

    const tool = getHealthRecordsTool(mockUser.id)
    const result = await tool.invoke({ pet_id: mockPet.id })

    expect(result).toBe(JSON.stringify([mockHealthRecord]))
  })

  it('returns placeholder when no health records exist', async () => {
    const mockClient = createSupabaseMock({
      pets: { data: { id: mockPet.id }, error: null },
      health_records: { data: [], error: null },
    })
    vi.mocked(createServerSupabaseClient).mockReturnValue(mockClient as any)

    const tool = getHealthRecordsTool(mockUser.id)
    const result = await tool.invoke({ pet_id: mockPet.id })

    expect(result).toBe('该宠物暂无健康记录。')
  })
})

describe('addHealthRecordTool', () => {
  it('denies access when pet does not belong to user', async () => {
    const mockClient = createSupabaseMock({ pets: { data: null, error: null } })
    vi.mocked(createServerSupabaseClient).mockReturnValue(mockClient as any)

    const tool = addHealthRecordTool(mockUser.id)
    const result = await tool.invoke({
      pet_id: 'other-pet-id',
      type: 'vaccine',
      title: '狂犬疫苗',
    })

    expect(result).toBe('无权为该宠物添加记录。')
  })

  it('returns success message on insert', async () => {
    const mockClient = createSupabaseMock({
      pets: { data: { id: mockPet.id }, error: null },
      health_records: { data: null, error: null }, // insert 成功
    })
    vi.mocked(createServerSupabaseClient).mockReturnValue(mockClient as any)

    const tool = addHealthRecordTool(mockUser.id)
    const result = await tool.invoke({
      pet_id: mockPet.id,
      type: 'vaccine',
      title: '狂犬疫苗',
    })

    expect(result).toBe('健康记录已成功添加。')
  })

  it('uses today date when date is not provided', async () => {
    const today = new Date().toISOString().split('T')[0]
    let capturedInsert: any = null

    const baseClient = createSupabaseMock({
      pets: { data: { id: mockPet.id }, error: null },
      health_records: { data: null, error: null },
    })

    const originalFrom = baseClient.from
    baseClient.from = vi.fn((table: string) => {
      const chain = originalFrom(table)
      if (table === 'health_records') {
        return new Proxy(chain, {
          get(target: any, p: string) {
            if (p === 'insert') {
              return (data: any) => {
                capturedInsert = data
                return chain
              }
            }
            return typeof target[p] === 'function' ? target[p].bind(target) : target[p]
          },
        })
      }
      return chain
    }) as any

    vi.mocked(createServerSupabaseClient).mockReturnValue(baseClient as any)

    const tool = addHealthRecordTool(mockUser.id)
    await tool.invoke({ pet_id: mockPet.id, type: 'checkup', title: '年度体检' })

    expect(capturedInsert?.date).toBe(today)
  })
})
