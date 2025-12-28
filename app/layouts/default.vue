<template>
  <SidebarProvider>
    <!-- <Navigation>
      <AppNavConent />
    </Navigation> -->
    <AppSidebar />
    <SidebarInset>
      <!-- Mobile Menu Button - visible on screens < lg -->
      <div class="lg:hidden fixed top-4 left-4 z-50">
        <SidebarTrigger />
      </div>
      <main class="w-full min-h-screen px-2 sm:p-6 lg:p-8 py-4 mx-auto lg:pt-4 pt-16">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup>
import { SidebarInset, SidebarTrigger } from "#components"
</script>
