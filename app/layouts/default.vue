<template>
  <SidebarProvider>
    <Navigation>
      <AppNavConent />
    </Navigation>
    <AppSidebar />
    <SidebarInset>
      <main class="mt-16 w-full min-h-screen">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup>
import { SidebarInset } from "#components"
</script>
