<template>
  <SidebarProvider>
    <Navigation>
      <AppNavConent />
    </Navigation>
    <AppSidebar />
    <main class="mt-16 w-full">
      <slot />
    </main>
  </SidebarProvider>
</template>
