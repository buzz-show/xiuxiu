<template>
  <div class="min-h-screen" style="background-color: var(--warm-bg)">
    <header class="sticky top-0 z-10 bg-white border-b border-[#E4E4E7] px-4 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="text-lg font-semibold text-[#C9B7A3]">嗅嗅</NuxtLink>
      <nav class="flex gap-4">
        <NuxtLink to="/" class="text-sm text-[#3F3F46] hover:text-[#C9B7A3]">首页</NuxtLink>
        <NuxtLink to="/chat" class="text-sm text-[#3F3F46] hover:text-[#C9B7A3]">AI 助理</NuxtLink>
        <NuxtLink to="/profile" class="text-sm text-[#3F3F46] hover:text-[#C9B7A3]">我的</NuxtLink>
      </nav>
    </header>
    <main class="max-w-2xl mx-auto px-4 py-6"><slot /></main>
  </div>
</template>
