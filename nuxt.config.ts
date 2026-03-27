// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 4396  // 改为你想要的端口
  },

  // SPA 模式，兼容 Capacitor WebView
  ssr: false,

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
  ],

  // @nuxt/ui 会自动安装 @nuxt/fonts；这里显式禁用需要联网的 Google providers
  fonts: {
    providers: {
      google: false,
      googleicons: false,
    },
  },

  // Supabase 模块配置
  supabase: {
    redirect: false,
  },

  // 仅服务端可见的 Key，防止 API Key 泄露到前端
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY ?? '',
    supabaseServiceKey: process.env.SUPABASE_SECRET_KEY ?? '',
    public: {
      appName: '嗅嗅宠物管家',
      forceMobile: false, // 由 .env 中的 NUXT_PUBLIC_FORCE_MOBILE 覆盖
    },
  },
})
