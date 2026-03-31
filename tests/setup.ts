import { vi } from 'vitest'
import { ref, computed, reactive, watch, watchEffect, nextTick, onMounted } from 'vue'

// ── Vue 响应式 API（Nuxt 自动导入，composable 测试需要） ──────────────────
Object.assign(global, { ref, computed, reactive, watch, watchEffect, nextTick, onMounted })

// ── H3 / Nitro 服务端自动导入 ─────────────────────────────────────────────
;(global as any).defineEventHandler = (fn: any) => fn

;(global as any).createError = ({ statusCode, message }: { statusCode: number; message: string }) => {
  const err: any = new Error(message)
  err.statusCode = statusCode
  err.statusMessage = message
  return err
}

;(global as any).readBody = vi.fn()
;(global as any).getRouterParam = vi.fn()
;(global as any).setHeader = vi.fn()
;(global as any).useRuntimeConfig = vi.fn(() => ({
  supabaseServiceKey: 'test-service-key',
  public: {},
}))

// ── Nitro server/utils 自动导入 ───────────────────────────────────────────
// createServerSupabaseClient 来自 server/utils/supabase.ts，Nitro 自动导入
;(global as any).createServerSupabaseClient = vi.fn()

// serverSupabaseClient 来自 @nuxtjs/supabase，Nitro 自动导入
;(global as any).serverSupabaseClient = vi.fn()

// ── Nuxt $fetch（composable 使用） ────────────────────────────────────────
;(global as any).$fetch = vi.fn()

// ── 原生 fetch（useChat SSE 流使用） ─────────────────────────────────────
;(global as any).fetch = vi.fn()

// 每个测试前重置所有 mock 调用记录
beforeEach(() => {
  vi.clearAllMocks()
})
