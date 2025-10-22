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
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <!-- <TabsTrigger value="security">Security</TabsTrigger> -->

      <!-- User Profile Settings -->
      <TabsContent value="profile" class="space-y-4">
        <SettingsUserProfile v-model:personalInfo="profileInfo" />
      </TabsContent>

      <!-- General App Settings -->
      <TabsContent value="general" class="space-y-4">
        <SettingsGeneralApp v-model:generalData="generalSettings"/>
      </TabsContent>

      <!-- Notifications Settings -->
      <TabsContent value="notifications" class="space-y-4">
        <SettingsNotifications :enabled="generalSettings.notificationsEnabled" />
      </TabsContent>

      <!-- Security & Account Management -->
      <!-- <TabsContent value="security" class="space-y-4">
        <SettingsSecurity />
      </TabsContent> -->
    </Tabs>

    <!-- Save Button -->
    <div class="flex justify-end mt-6">
      <Button @click="updateProfile" :is-loading="saving">
        <IconSave class="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { CountUnit, DashboardView, Gender, GoalFrequency, Theme, TimeUnit, TrackingType } from "@prisma/client"
import type { GeneralSettingsType, ProfileInfoType } from "~~/types"

const saving = ref(false)
const { data: profile } = await useFetch('/api/profile')

const profileInfo = reactive<ProfileInfoType>({
  name: profile.value?.name || '',
  email: profile.value?.email || '',
  avatarUrl: profile.value?.avatarUrl || '',
  age: profile.value?.age || 0,
  height: profile.value?.height || 0,
  gender: profile.value?.gender as Gender,
  personalGoals: profile.value?.personalGoals as string,
  preferredTimeUnits: profile.value?.preferredTimeUnits as TimeUnit,
  preferredCountUnits: profile.value?.preferredCountUnits as CountUnit,
  defaultReminderTime: profile.value?.defaultReminderTime as string,
  defaultTrackingType: profile.value?.defaultTrackingType as TrackingType,
  defaultGoalFrequency: profile.value?.defaultGoalFrequency as GoalFrequency,
  theme: profile.value?.theme as Theme,
})


const generalSettings = reactive<GeneralSettingsType>({
  language: profile.value?.language as string,
  dateFormat: profile.value?.dateFormat as string,
  autoSync: profile.value?.autoSync || true,
  lastSyncTime: profile.value?.lastSyncTime ? new Date(profile.value.lastSyncTime) : null,
  defaultDashboardView: profile.value?.defaultDashboardView as DashboardView,
  showWelcomeMessage: profile.value?.showWelcomeMessage || true,
  notificationsEnabled: profile.value?.notificationsEnabled || false,
})


const updateProfile = async () => {
  saving.value = true
  const { data, error } = await useFetch('/api/profile', {
    method: 'PUT',
    body: {
      ...profileInfo,
      ...generalSettings
    },
  })
  if (error) {
    console.error(error)
  }
  
  saving.value = false
}

// Set page title
useHead({
  title: 'Settings - Stabit'
})
</script>

<style scoped></style>
