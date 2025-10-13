<template>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="language">Display Language</Label>
            <Select v-model="generalData.language">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="date-format">Date Format</Label>
            <Select v-model="generalData.dateFormat">
              <SelectTrigger>
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">☁️</span>
          Backup & Sync
        </CardTitle>
        <CardDescription>
          Manage cloud backup and synchronization settings
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
            <Switch v-model="generalData.autoSync" />
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Manual Sync</p>
              <p class="text-sm text-muted-foreground">
                Last synced: {{ generalData.lastSyncTime }}
              </p>
            </div>
            <Button variant="outline" size="sm" @click="manualSync">
              Sync Now
            </Button>
          </div>
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
        <div class="space-y-2">
          <Label for="default-dashboard-view">Default Dashboard View</Label>
          <Select v-model="generalData.defaultDashboardView">
            <SelectTrigger>
              <SelectValue placeholder="Select default view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="calendar">Calendar</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Show Welcome Message</p>
            <p class="text-sm text-muted-foreground">
              Display helpful tips and welcome messages
            </p>
          </div>
          <Switch v-model="generalData.showWelcomeMessage" />
        </div>
      </CardContent>
    </Card>

    <!-- App Notifications -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">🔔</span>
          App Notifications
        </CardTitle>
        <CardDescription>
          Control global notification settings
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Enable All Notifications</p>
            <p class="text-sm text-muted-foreground">
              Master toggle for all app notifications
            </p>
          </div>
          <Switch v-model="generalData.notificationsEnabled" />
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Sound Notifications</p>
            <p class="text-sm text-muted-foreground">
              Play sounds for notifications
            </p>
          </div>
          <Switch v-model="generalData.soundNotifications" />
        </div>
      </CardContent>
    </Card>

    <!-- Reset Options -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">🔄</span>
          Reset Options
        </CardTitle>
        <CardDescription>
          Reset various app settings and data
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p class="font-medium">Clear Cache</p>
              <p class="text-sm text-muted-foreground">
                Clear temporary app data and cache
              </p>
            </div>
            <Button variant="outline" size="sm" @click="clearCache">
              Clear Cache
            </Button>
          </div>
          
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p class="font-medium">Reset UI Preferences</p>
              <p class="text-sm text-muted-foreground">
                Reset all UI settings to defaults
              </p>
            </div>
            <Button variant="outline" size="sm" @click="resetUIPreferences">
              Reset UI
            </Button>
          </div>
          
          <div class="flex items-center justify-between p-3 border rounded-lg border-destructive">
            <div>
              <p class="font-medium text-destructive">Restore Default Settings</p>
              <p class="text-sm text-muted-foreground">
                Reset all settings to factory defaults
              </p>
            </div>
            <Button variant="destructive" size="sm" @click="restoreDefaults">
              Restore Defaults
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Save Button -->
    <div class="flex justify-end">
      <Button @click="saveGeneralSettings" :disabled="saving">
        <IconSave class="w-4 h-4 mr-2" />
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">

type GeneralData = {
  language: string
  dateFormat: string
  autoSync: boolean
  lastSyncTime: string
  defaultDashboardView: string
  showWelcomeMessage: boolean
  notificationsEnabled: boolean
  soundNotifications: boolean
}

const generalData = reactive<GeneralData>({
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  autoSync: true,
  lastSyncTime: '2 hours ago',
  defaultDashboardView: 'overview',
  showWelcomeMessage: true,
  notificationsEnabled: true,
  soundNotifications: true
})

const saving = ref(false)

function saveGeneralSettings() {
  saving.value = true
  // Simulate API call
  setTimeout(() => {
    saving.value = false
    // toast.success('General settings saved successfully!')
  }, 1000)
}

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
  generalData.lastSyncTime = 'Just now'
  // toast.success('Data synced successfully!')
}

function clearCache() {
  // Simulate cache clearing
  console.log('Clearing cache...')
  // toast.success('Cache cleared successfully!')
}

function resetUIPreferences() {
  // Simulate UI reset
  console.log('Resetting UI preferences...')
  // toast.success('UI preferences reset successfully!')
}

function restoreDefaults() {
  // Simulate restore defaults
  console.log('Restoring default settings...')
  // toast.success('Settings restored to defaults!')
}
</script>

<style scoped></style>
