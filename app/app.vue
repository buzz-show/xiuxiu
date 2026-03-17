<script setup lang="ts">
import { Capacitor } from '@capacitor/core'

const config = useRuntimeConfig()
const layout = Capacitor.isNativePlatform() || config.public.forceMobile ? 'mobile' : 'default'
</script>

<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>
