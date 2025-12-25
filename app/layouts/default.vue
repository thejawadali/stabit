<template>
  <SidebarProvider>
    <!-- <Navigation>
      <AppNavConent />
    </Navigation> -->
    <AppSidebar />
    <SidebarInset>
      <main class="w-full min-h-screen px-2 sm:p-6 lg:p-8 py-4 mx-auto">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup>
import { SidebarInset } from "#components"
</script>
