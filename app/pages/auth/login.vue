<script setup lang="ts">
/**
 * 嗅嗅宠物健康助手 - 登录页面 (Nuxt3 + Tailwind + Supabase)
 * 修复版：解决了 definePageMeta 在部分编译环境下的语法歧义，并优化了 TS 类型定义
 */

// 明确定义页面元数据
definePageMeta({
  layout: false
})

// 获取 Supabase 客户端实例
const supabase = useSupabaseClient()

// 响应式状态
const email = ref<string>('')
const loading = ref<boolean>(false)
const sent = ref<boolean>(false)

/**
 * 处理登录逻辑
 * 使用 Magic Link (OTP) 方式
 */
async function signIn() {
  if (!email.value) return
  
  loading.value = true
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: { 
        emailRedirectTo: `${window.location.origin}/auth/callback` 
      },
    })
    
    if (error) {
      console.error('Authentication error:', error.message)
      // 这里可以集成您的通知系统，例如 useToast()
    } else {
      sent.value = true
    }
  } catch (err) {
    console.error('Unexpected error during sign in:', err)
  } finally {
    loading.value = false
  }
}

/**
 * 视差动效相关逻辑
 */
const cardRef = ref<HTMLElement | null>(null)

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  // 计算旋转角度
  const rotateY = (e.clientX - centerX) / 40
  const rotateX = -(e.clientY - centerY) / 40
  
  cardRef.value.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
}

const resetTransform = () => {
  if (!cardRef.value) return
  cardRef.value.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`
}
</script>

<template>
  <div 
    class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden select-none"
    style="background-color: #FFFCF8;"
    @mousemove="handleMouseMove"
    @mouseleave="resetTransform"
  >
    <!-- 背景艺术装饰色块 -->
    <div class="absolute -top-32 -left-16 w-80 h-80 bg-[#F5EFE6] rounded-full blur-[80px] opacity-60"></div>
    <div class="absolute -bottom-32 -right-16 w-80 h-80 bg-[#FDBA74] rounded-full blur-[80px] opacity-20"></div>

    <!-- 登录容器 -->
    <div 
      ref="cardRef"
      class="w-full max-w-sm relative z-10 transition-transform duration-300 ease-out"
      style="transform-style: preserve-3d;"
    >
      <!-- iOS 风格毛玻璃卡片主体 -->
      <div class="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        
        <!-- Logo 与标题区域 -->
        <div class="text-center mb-10">
          <div class="w-24 h-24 rounded-full mx-auto mb-6 transition-transform hover:scale-110 duration-500">
            <!-- 请确保该路径在您的 public/images/ 目录下存在 -->
            <img 
              src="/images/dog-nose-logo.png" 
              alt="嗅嗅 Logo" 
              class="w-full h-full object-contain animate-[bounce_4s_infinite] mix-blend-multiply"
            >
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-[#18181B]">嗅嗅</h1>
          <p class="text-sm font-medium text-[#71717A] mt-2 opacity-80">你的专属宠物健康管家</p>
        </div>

        <!-- 状态切换视图 -->
        <div class="min-h-[280px]">
          <Transition 
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform translate-y-4 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform translate-y-4 opacity-0"
            mode="out-in"
          >
            <!-- 成功状态：链接已发送 -->
            <div v-if="sent" class="py-6 text-center space-y-5">
              <div class="w-16 h-16 bg-[#F5EFE6] text-[#C9B7A3] rounded-full flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <div class="space-y-2">
                <p class="text-[#3F3F46] leading-relaxed">
                  验证链接已发送至<br>
                  <span class="font-bold text-[#18181B]">{{ email }}</span>
                </p>
                <p class="text-[11px] text-[#A1A1AA] leading-relaxed">
                  请查看您的电子邮箱<br>点击邮件中的链接即可安全登录
                </p>
              </div>
              <button 
                type="button"
                class="text-sm font-bold text-[#C9B7A3] hover:text-[#B8A692] transition-colors pt-4"
                @click="sent = false"
              >
                更换邮箱或重试
              </button>
            </div>

            <!-- 表单状态：输入邮箱 -->
            <form v-else class="space-y-7" @submit.prevent="signIn">
              <div class="space-y-2">
                <label class="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA] ml-1">
                  电子邮箱地址
                </label>
                <input 
                  v-model="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  class="w-full px-6 py-4 bg-[#F4F4F5] border-2 border-transparent rounded-[20px] text-base outline-none transition-all duration-300 focus:bg-white focus:border-[#EADBC8] focus:ring-[6px] focus:ring-[#EADBC8]/10"
                >
              </div>

              <button 
                type="submit" 
                :disabled="loading"
                class="group w-full bg-[#EADBC8] text-[#18181B] font-bold py-4.5 rounded-[22px] shadow-[0_10px_25px_rgba(234,219,200,0.6)] transition-all duration-300 active:scale-[0.97] hover:shadow-[0_12px_30px_rgba(234,219,200,0.8)] disabled:opacity-60 disabled:pointer-events-none relative overflow-hidden"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  发送中...
                </span>
                <span v-else>发送登录链接</span>
              </button>

              <!-- 社交登录入口 -->
              <div class="pt-2 text-center space-y-6">
                <!-- <div class="flex items-center gap-4">
                  <div class="h-px flex-1 bg-gradient-to-r from-transparent to-[#18181B]/5"></div>
                  <span class="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4D4D8]">其他方式</span>
                  <div class="h-px flex-1 bg-gradient-to-l from-transparent to-[#18181B]/5"></div>
                </div>

                <div class="flex justify-center gap-5">
                  <button type="button" class="w-14 h-14 flex items-center justify-center rounded-[20px] bg-white border border-[#F4F4F5] shadow-sm hover:shadow-md transition-all active:scale-90">
                    <span class="text-2xl opacity-80"></span>
                  </button>
                  <button type="button" class="w-14 h-14 flex items-center justify-center rounded-[20px] bg-white border border-[#F4F4F5] shadow-sm hover:shadow-md transition-all active:scale-90">
                    <svg class="w-6 h-6 text-[#07C160]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.5,13.5C8.22,13.5 8,13.28 8,13C8,12.72 8.22,12.5 8.5,12.5C8.78,12.5 9,12.72 9,13C9,13.28 8.78,13.5 8.5,13.5M12.5,13.5C12.22,13.5 12,13.28 12,13C12,12.72 12.22,12.5 12.5,12.5C12.78,12.5 13,12.72 13,13C13,13.28 12.78,13.5 12.5,13.5M17,13.5C16.72,13.5 16.5,13.28 16.5,13C16.5,12.72 16.72,12.5 17,12.5C17.28,12.5 17.5,12.72 17.5,13C17.5,13.28 17.28,13.5 17,13.5M13,6C13,6.55 12.55,7 12,7C11.45,7 11,6.55 11,6C11,5.45 11.45,5 12,5C12.55,5 13,5.45 13,6M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z" />
                    </svg>
                  </button>
                </div> -->

                <p class="text-xs text-[#71717A] font-medium">
                  初次见面？<button type="button" class="text-[#C9B7A3] font-bold hover:underline underline-offset-4 ml-1">注册新账号</button>
                </p>
              </div>
            </form>
          </Transition>
        </div>
      </div>

      <!-- 合规与底部装饰 -->
      <footer class="mt-10 text-center space-y-10">
        <p class="text-[10px] text-[#A1A1AA] leading-relaxed max-w-[240px] mx-auto opacity-70">
          登录即代表您已阅读并同意我们的<br>
          <a href="#" class="underline hover:text-[#71717A]">服务协议</a> 与 <a href="#" class="underline hover:text-[#71717A]">隐私保护政策</a>
        </p>
        <!-- 模拟 iOS 系统 Home Indicator -->
        <div class="w-32 h-1.5 bg-[#18181B]/10 rounded-full mx-auto"></div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* 确保 3D 转换生效 */
.preserve-3d {
  transform-style: preserve-3d;
}

/* 输入框内阴影微调 */
input::placeholder {
  color: #D4D4D8;
  font-weight: 400;
}

/* 按钮点击时的微小缩放，除了 active:scale-[0.97] 类也可以通过样式控制 */
button:active {
  -webkit-tap-highlight-color: transparent;
}
</style>