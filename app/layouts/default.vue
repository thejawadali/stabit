<template>
  <SidebarProvider>
    <!-- <Navigation>
      <AppNavConent />
    </Navigation> -->
    <AppSidebar />
    <SidebarInset>
      <main class="w-full min-h-screen sm:p-6 lg:p-8 pt-24 pb-12 mx-auto">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup>
import { SidebarInset } from "#components"
</script>
