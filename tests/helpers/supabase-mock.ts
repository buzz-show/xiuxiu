import { vi } from 'vitest'

/**
 * 创建可链式调用的 Supabase 查询 mock。
 * 支持按表名配置返回数据，兼容 .single() 和直接 await。
 *
 * @example
 * const mockClient = createSupabaseMock({
 *   pets: { data: [mockPet], error: null },
 *   health_records: { data: [], error: null },
 * })
 * vi.mocked(createServerSupabaseClient).mockReturnValue(mockClient as any)
 */
export function createSupabaseMock(
  tableResults: Record<string, { data?: any; error?: any }> = {},
) {
  function makeChain(table: string) {
    const cfg = tableResults[table] ?? {}
    const resolved = { data: cfg.data ?? null, error: cfg.error ?? null }

    const chain: any = new Proxy(
      {},
      {
        get(_target, prop: string) {
          // .single() → 返回 Promise<{data, error}>
          if (prop === 'single') return () => Promise.resolve(resolved)
          // await chain → JS 检测到 .then，当作 thenable 处理
          if (prop === 'then') {
            return (onFulfilled: any, onRejected: any) =>
              Promise.resolve(resolved).then(onFulfilled, onRejected)
          }
          // 所有链式方法（select, eq, insert, update, delete, order, limit…）返回 chain 本身
          return () => chain
        },
      },
    )

    return chain
  }

  return {
    from: vi.fn((table: string) => makeChain(table)),
  }
}
