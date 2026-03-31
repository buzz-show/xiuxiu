import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'server/api/**/*.ts',
        'server/utils/**/*.ts',
        'app/composables/**/*.ts',
      ],
      exclude: [
        // LangGraph 图编译依赖真实 DB 连接，不做单元测试
        'server/utils/agent/graph.ts',
      ],
      thresholds: { statements: 60 },
      reporter: ['text', 'html'],
    },
  },
  resolve: {
    alias: {
      // 将 Nuxt Supabase 服务端模块重定向到 mock 文件
      '#supabase/server': path.resolve(__dirname, 'tests/helpers/supabase-server-mock.ts'),
      // Nuxt ~ 路径别名
      '~': path.resolve(__dirname, 'app'),
    },
  },
})
