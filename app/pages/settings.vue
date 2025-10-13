<template>
  <main class="container mx-auto p-6 w-full max-w-5xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">Settings</h1>
        <p class="text-muted-foreground mt-1">
          Manage your account preferences and app configuration
        </p>
      </div>
    </div>

    <Tabs defaultValue="profile" class="space-y-6 w-full">
      <TabsList class="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <!-- User Profile Settings -->
      <TabsContent value="profile" class="space-y-4">
        <SettingsUserProfile />
      </TabsContent>

      <!-- General App Settings -->
      <TabsContent value="general" class="space-y-4">
        <SettingsGeneralApp />
      </TabsContent>

      <!-- Notifications Settings -->
      <TabsContent value="notifications" class="space-y-4">
        <SettingsNotifications />
      </TabsContent>

      <!-- Security & Account Management -->
      <TabsContent value="security" class="space-y-4">
        <SettingsSecurity />
      </TabsContent>
    </Tabs>
  </main>
</template>

<script setup lang="ts">
// Set page title
useHead({
  title: 'Settings - Stabit'
})
</script>

<style scoped></style>
