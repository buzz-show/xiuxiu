<template>
  <div class="flex flex-col h-screen" style="background-color: var(--warm-bg)">
    <main class="flex-1 overflow-y-auto pb-28 safe-top"><slot /></main>
    <UiBottomTabBar />
  </div>
</template>
