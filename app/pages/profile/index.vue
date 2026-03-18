<script setup lang="ts">
const authStore = useAuthStore()
const { user, signOut } = authStore
</script>

<template>
  <div class="px-4 pt-6 pb-4 space-y-4" style="min-height: 100%">
    <h1 class="text-xl font-bold text-[#18181B]">我的</h1>
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="px-4 py-4 flex items-center gap-3 border-b border-[#E4E4E7]">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
          style="background-color: var(--warm-light)"
        >
          👤
        </div>
        <div>
          <p class="font-semibold text-[#18181B] text-sm">{{ user?.email }}</p>
          <p class="text-xs text-[#A1A1AA]">已登录</p>
        </div>
      </div>
      <div class="px-4 py-3">
        <UButton variant="ghost" color="error" block @click="signOut">退出登录</UButton>
      </div>
    </div>
  </div>
</template>
