// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SPA 模式，兼容 Capacitor WebView
  ssr: false,

  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
  ],

  // Supabase 模块配置
  supabase: {
    redirect: false,
  },

  // 仅服务端可见的 Key，防止 API Key 泄露到前端
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY ?? '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY ?? '',
    public: {
      appName: '秀秀宠物助理',
    },
  },
})
