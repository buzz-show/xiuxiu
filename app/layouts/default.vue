<template>
  <div class="min-h-screen bg-gray-50">
    <header class="sticky top-0 z-10 bg-white border-b px-4 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="text-lg font-semibold text-primary-600">嗅嗅</NuxtLink>
      <nav class="flex gap-4">
        <NuxtLink to="/" class="text-sm text-gray-600 hover:text-primary-600">首页</NuxtLink>
        <NuxtLink to="/chat" class="text-sm text-gray-600 hover:text-primary-600">AI 助理</NuxtLink>
        <NuxtLink to="/profile" class="text-sm text-gray-600 hover:text-primary-600">我的</NuxtLink>
      </nav>
    </header>
    <main class="max-w-2xl mx-auto px-4 py-6"><slot /></main>
  </div>
</template>