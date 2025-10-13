<template>
  <div class="space-y-6">
    <!-- Profile Information -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">👤</span>
          Profile Information
        </CardTitle>
        <CardDescription>
          Manage your personal details and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center gap-4">
          <Avatar class="h-20 w-20">
            <AvatarImage :src="profileData.avatar" alt="Profile picture" />
            <AvatarFallback class="text-lg">
              {{ profileData.name?.charAt(0) || 'U' }}
            </AvatarFallback>
          </Avatar>
          <div class="space-y-2">
            <Button variant="outline" size="sm">
              Change Avatar
            </Button>
            <p class="text-sm text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="name">Full Name</Label>
            <Input
              id="name"
              v-model="profileData.name"
              placeholder="Enter your full name"
            />
          </div>
          <div class="space-y-2">
            <Label for="email">Email Address</Label>
            <Input
              id="email"
              v-model="profileData.email"
              type="email"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="timezone">Timezone</Label>
          <Select v-model="profileData.timezone">
            <SelectTrigger>
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
              <SelectItem value="Europe/London">London (GMT)</SelectItem>
              <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
              <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
              <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Personal Goals -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">🎯</span>
          Personal Goals
        </CardTitle>
        <CardDescription>
          Define your overarching life goals and aspirations
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="personal-goals">Your Goals</Label>
          <Textarea
            id="personal-goals"
            v-model="profileData.personalGoals"
            placeholder="e.g., Read more books, Improve fitness consistency, Learn a new language..."
            rows="3"
          />
          <p class="text-sm text-muted-foreground">
            Describe your main life goals that your habits will help you achieve.
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Preferred Metrics -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">📊</span>
          Preferred Metrics
        </CardTitle>
        <CardDescription>
          Choose your preferred units for tracking habits and activities
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="time-units">Time Units</Label>
            <Select v-model="profileData.preferredTimeUnits">
              <SelectTrigger>
                <SelectValue placeholder="Select time units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="count-units">Count Units</Label>
            <Select v-model="profileData.preferredCountUnits">
              <SelectTrigger>
                <SelectValue placeholder="Select count units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="repetitions">Repetitions</SelectItem>
                <SelectItem value="sessions">Sessions</SelectItem>
                <SelectItem value="times">Times</SelectItem>
                <SelectItem value="items">Items</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Default Habit Settings -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">⚙️</span>
          Default Habit Settings
        </CardTitle>
        <CardDescription>
          Set default preferences for new habits
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="default-reminder-time">Default Reminder Time</Label>
            <Input
              id="default-reminder-time"
              v-model="profileData.defaultReminderTime"
              type="time"
            />
          </div>
          <div class="space-y-2">
            <Label for="default-tracking-type">Default Tracking Type</Label>
            <Select v-model="profileData.defaultTrackingType">
              <SelectTrigger>
                <SelectValue placeholder="Select tracking type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="count">Count</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="space-y-2">
          <Label for="default-goal-frequency">Default Goal Frequency</Label>
          <Select v-model="profileData.defaultGoalFrequency">
            <SelectTrigger>
              <SelectValue placeholder="Select goal frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Theme Preference -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">🎨</span>
          Theme Preference
        </CardTitle>
        <CardDescription>
          Choose your preferred app appearance
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="theme">Theme</Label>
          <Select v-model="profileData.theme">
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Account Linking -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">🔗</span>
          Account Linking
        </CardTitle>
        <CardDescription>
          Manage your authentication providers
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex items-center gap-3">
              <IconGoogle class="w-5 h-5" />
              <div>
                <p class="font-medium">Google</p>
                <p class="text-sm text-muted-foreground">
                  {{ profileData.linkedAccounts.google ? 'Connected' : 'Not connected' }}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              @click="toggleGoogleAccount"
            >
              {{ profileData.linkedAccounts.google ? 'Disconnect' : 'Connect' }}
            </Button>
          </div>
          
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex items-center gap-3">
              <IconGithub class="w-5 h-5" />
              <div>
                <p class="font-medium">GitHub</p>
                <p class="text-sm text-muted-foreground">
                  {{ profileData.linkedAccounts.github ? 'Connected' : 'Not connected' }}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              @click="toggleGithubAccount"
            >
              {{ profileData.linkedAccounts.github ? 'Disconnect' : 'Connect' }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Save Button -->
    <div class="flex justify-end">
      <Button @click="saveProfileSettings" :disabled="saving">
        <IconSave class="w-4 h-4 mr-2" />
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">

type ProfileData = {
  name: string
  email: string
  avatar: string
  timezone: string
  personalGoals: string
  preferredTimeUnits: string
  preferredCountUnits: string
  defaultReminderTime: string
  defaultTrackingType: string
  defaultGoalFrequency: string
  theme: string
  linkedAccounts: {
    google: boolean
    github: boolean
  }
}

const profileData = reactive<ProfileData>({
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '',
  timezone: 'America/New_York',
  personalGoals: 'Read more books, Improve fitness consistency, Learn Spanish',
  preferredTimeUnits: 'minutes',
  preferredCountUnits: 'repetitions',
  defaultReminderTime: '09:00',
  defaultTrackingType: 'duration',
  defaultGoalFrequency: 'daily',
  theme: 'system',
  linkedAccounts: {
    google: true,
    github: false
  }
})

const saving = ref(false)

function saveProfileSettings() {
  saving.value = true
  // Simulate API call
  setTimeout(() => {
    saving.value = false
    // toast.success('Profile settings saved successfully!')
  }, 1000)
}

function toggleGoogleAccount() {
  profileData.linkedAccounts.google = !profileData.linkedAccounts.google
}

function toggleGithubAccount() {
  profileData.linkedAccounts.github = !profileData.linkedAccounts.github
}
</script>

<style scoped></style>
