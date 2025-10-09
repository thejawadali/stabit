<template>
  <SidebarProvider>
    <Navigation>
      <AppNavConent />
    </Navigation>
    <AppSidebar />
    <main class="mt-16">
      <slot />
    </main>
  </SidebarProvider>
</template>
