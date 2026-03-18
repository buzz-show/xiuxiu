<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const email = ref('')
const loading = ref(false)
const sent = ref(false)

async function signIn() {
  loading.value = true
  try {
    await supabase.auth.signInWithOtp({
      email: email.value,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    sent.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--warm-bg)">
    <div class="w-full max-w-sm bg-white rounded-2xl p-8 shadow-sm">
      <div class="text-center mb-8">
        <p class="text-5xl mb-3">🐾</p>
        <h1 class="text-2xl font-bold text-[#18181B]">嗅嗅</h1>
        <p class="text-sm text-[#71717A] mt-1">你的专属宠物健康管家</p>
      </div>
      <div v-if="sent" class="text-center text-sm text-[#71717A] py-4">
        ✅ 登录链接已发送到 <strong class="text-[#18181B]">{{ email }}</strong>，请查收邮件。
      </div>
      <UForm v-else :state="{ email }" class="space-y-4" @submit="signIn">
        <UFormField label="邮箱" name="email">
          <UInput v-model="email" type="email" placeholder="your@email.com" class="w-full" />
        </UFormField>
        <UButton type="submit" block :loading="loading">发送登录链接</UButton>
      </UForm>
    </div>
  </div>
</template>
