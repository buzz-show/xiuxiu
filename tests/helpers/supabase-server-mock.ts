import { vi } from 'vitest'
import { mockUser } from './fixtures'

/**
 * Mock for '#supabase/server'
 * vitest.config.ts 中通过 alias 将该包重定向到此文件。
 * 所有导入 '#supabase/server' 的处理函数都会使用这里的 mock。
 */
export const serverSupabaseUser = vi.fn().mockResolvedValue(mockUser)

export const serverSupabaseClient = vi.fn()
