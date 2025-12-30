<template>
  <SidebarProvider>
    <Navigation class="lg:hidden">
      <template #default>
        <div class="hidden">
          <AppNavConent />
        </div>
      </template>
    </Navigation>
    <AppSidebar />
    <SidebarInset>
      <main class="w-full min-h-screen pt-20 lg:pt-4">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup>
import { SidebarInset } from "#components"
</script>
