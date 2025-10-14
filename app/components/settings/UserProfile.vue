<template>
  <TooltipProvider>
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
              <Input id="name" v-model="profileData.name" placeholder="Enter your full name" />
            </div>
            <div class="space-y-2">
              <Label for="email">Email Address</Label>
              <Input id="email" v-model="profileData.email" type="email" placeholder="Enter your email" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <Label for="age">Age</Label>
              <Input id="age" v-model="profileData.age" type="number" placeholder="Enter your age" min="1" max="120" />
            </div>
            <div class="space-y-2">
              <Label for="height">Height</Label>
              <Input id="height" v-model="profileData.height" type="number" placeholder="Height in cm" min="50"
                max="250" />
            </div>
            <div class="space-y-2">
              <Label for="gender">Gender</Label>
              <Select v-model="profileData.gender">
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <Label for="personal-goals" class="flex items-center gap-2">
              Your Goals
              <Tooltip>
                <TooltipTrigger as-child>
                  <button type="button" class="text-muted-foreground hover:text-foreground">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Describe your main life goals that your habits will help you achieve.</p>
                  <p class="text-xs mt-1">Example: "Read more books, Improve fitness consistency, Learn a new language"
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea id="personal-goals" v-model="profileData.personalGoals"
              placeholder="e.g., Read more books, Improve fitness consistency, Learn a new language..." rows="3" />
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
              <Label for="time-units" class="flex items-center gap-2">
                Time Units
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button type="button" class="text-muted-foreground hover:text-foreground">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose how you prefer to track time-based habits.</p>
                    <p class="text-xs mt-1">Example: "30 minutes of reading" vs "0.5 hours of reading"</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
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
              <Label for="count-units" class="flex items-center gap-2">
                Count Units
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button type="button" class="text-muted-foreground hover:text-foreground">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose how you prefer to count habit completions.</p>
                    <p class="text-xs mt-1">Example: "10 push-ups" vs "10 repetitions of push-ups"</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
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
              <Label for="default-reminder-time" class="flex items-center gap-2">
                Default Reminder Time
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button type="button" class="text-muted-foreground hover:text-foreground">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set the default time for habit reminders.</p>
                    <p class="text-xs mt-1">Example: 9:00 AM for morning habits, 6:00 PM for evening habits</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input id="default-reminder-time" v-model="profileData.defaultReminderTime" type="time" />
            </div>
            <div class="space-y-2">
              <Label for="default-tracking-type" class="flex items-center gap-2">
                Default Tracking Type
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button type="button" class="text-muted-foreground hover:text-foreground">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set the default tracking method for new habits.</p>
                    <p class="text-xs mt-1">Duration: tracks time spent | Count: tracks repetitions | Both: tracks both
                      metrics</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
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
            <Label for="default-goal-frequency" class="flex items-center gap-2">
              Default Goal Frequency
              <Tooltip>
                <TooltipTrigger as-child>
                  <button type="button" class="text-muted-foreground hover:text-foreground">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Set how often you want to achieve your habit goals.</p>
                  <p class="text-xs mt-1">Daily: every day | Weekly: X times per week | Monthly: X times per month</p>
                </TooltipContent>
              </Tooltip>
            </Label>
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


      <!-- Save Button -->
      <div class="flex justify-end">
        <Button @click="saveProfileSettings" :disabled="saving">
          <IconSave class="w-4 h-4 mr-2" />
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </Button>
      </div>
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">

type ProfileData = {
  name: string
  email: string
  avatar: string
  age: number
  height: number
  gender: string
  timezone: string
  personalGoals: string
  preferredTimeUnits: string
  preferredCountUnits: string
  defaultReminderTime: string
  defaultTrackingType: string
  defaultGoalFrequency: string
  theme: string
}

const profileData = reactive<ProfileData>({
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '',
  age: 28,
  height: 175,
  gender: 'male',
  timezone: 'America/New_York',
  personalGoals: 'Read more books, Improve fitness consistency, Learn Spanish',
  preferredTimeUnits: 'minutes',
  preferredCountUnits: 'repetitions',
  defaultReminderTime: '09:00',
  defaultTrackingType: 'duration',
  defaultGoalFrequency: 'daily',
  theme: 'system'
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

</script>

<style scoped></style>
