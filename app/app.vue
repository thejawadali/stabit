<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
  <ConfirmDialog />
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/toast'
</script>