<template>
  <SidebarProvider>
    <!-- <Navigation>
      <AppNavConent />
    </Navigation> -->
    <AppSidebar />
    <SidebarInset>
      <div class="lg:hidden fixed top-4 left-4 z-50">
        <SidebarTrigger />
      </div>
      <main class="w-full min-h-screen px-12 pt-4">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup>
import { SidebarInset, SidebarTrigger } from "#components"
</script>
