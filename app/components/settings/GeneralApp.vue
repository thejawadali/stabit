<template>
  <TooltipProvider>
    <div class="space-y-6">
      <!-- Language Selection -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <span class="text-xl">🌐</span>
            Language & Region
          </CardTitle>
          <CardDescription>
            Choose your preferred display language and region settings
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="p-3 bg-muted rounded-lg">
            <p class="text-sm text-muted-foreground">
              Language and date format settings will be available in a future update.
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Data Management -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <span class="text-xl">💾</span>
            Data Management
          </CardTitle>
          <CardDescription>
            Export, import, and manage your app data
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p class="font-medium">Export Data</p>
                <p class="text-sm text-muted-foreground">
                  Download all your habits, logs, and statistics
                </p>
              </div>
              <div class="flex gap-2">
                <Button variant="outline" size="sm" @click="exportData('csv')">
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" @click="exportData('json')">
                  Export JSON
                </Button>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p class="font-medium">Import Data</p>
                <p class="text-sm text-muted-foreground">
                  Restore from a previous backup
                </p>
              </div>
              <Button variant="outline" size="sm" @click="importData">
                Import Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Backup & Sync -->
      <Card class="opacity-50 pointer-events-none">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <span class="text-xl">☁️</span>
            Backup & Sync
            <Badge variant="secondary" class="ml-2">Coming Soon</Badge>
          </CardTitle>
          <CardDescription>
            Cloud backup and synchronization features will be available soon
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Automatic Cloud Sync</p>
                <p class="text-sm text-muted-foreground">
                  Automatically sync your data to the cloud
                </p>
              </div>
              <Switch disabled />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Manual Sync</p>
                <p class="text-sm text-muted-foreground">
                  Sync your data manually when needed
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Sync Now
              </Button>
            </div>
          </div>
          <div class="p-3 bg-muted rounded-lg">
            <p class="text-sm text-muted-foreground">
              We're working on bringing you secure cloud backup and sync capabilities. This feature will allow you to
              access your habits and progress across all your devices.
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- App Preferences -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <span class="text-xl">⚙️</span>
            App Preferences
          </CardTitle>
          <CardDescription>
            Configure general app behavior and notifications
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Hidden for MVP -->
          <div v-if="false" class="flex items-center justify-between">
            <div>
              <p class="font-medium">Enable Notifications</p>
              <p class="text-sm text-muted-foreground">
                Receive reminders and updates about your habits
              </p>
            </div>
            <Switch v-model="generalData.notificationsEnabled" />
          </div>
        </CardContent>
      </Card>

      <!-- Dashboard Preferences -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <span class="text-xl">📊</span>
            Dashboard Preferences
          </CardTitle>
          <CardDescription>
            Customize your default dashboard view and layout
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="p-3 bg-muted rounded-lg">
            <p class="text-sm text-muted-foreground">
              Dashboard preferences will be available in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">
import type { GeneralSettingsType } from "~~/types"



const generalData = defineModel<Partial<GeneralSettingsType>>("generalData", {
  required: true
})

function exportData(format: 'csv' | 'json') {
  // Simulate export functionality
  console.log(`Exporting data as ${format}`)
  // toast.success(`Data exported as ${format.toUpperCase()}`)
}

function importData() {
  // Simulate import functionality
  console.log('Importing data...')
  // toast.success('Data imported successfully!')
}

function manualSync() {
  // Simulate sync functionality
  console.log('Syncing data...')
  // generalData.lastSyncTime = 'Just now'
  // toast.success('Data synced successfully!')
}

</script>

<style scoped></style>
