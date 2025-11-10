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
              <AvatarImage :src="personalInfo.avatarUrl!" alt="Profile picture" />
              <AvatarFallback class="text-lg">
                {{ personalInfo.name?.charAt(0) || 'U' }}
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
            <!-- name -->
            <Input id="name" label="Full Name" v-model="personalInfo.name" placeholder="Enter your full name" />
            <!-- email -->
            <Input disabled id="email" label="Email Address" v-model="personalInfo.email" type="email"
              placeholder="Enter your email" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- age -->
            <Input id="age" label="Age" v-model="personalInfo.age" type="number" placeholder="Enter your age" min="1"
              max="120" />
            <!-- height -->
            <Input id="height" label="Height" v-model="personalInfo.height" type="number" placeholder="Height in cm"
              min="50" max="250" />
            <!-- gender -->
            <Select v-model="personalInfo.gender" label="Gender" placeholder="Select gender" id="gender">
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
          <!-- personal goals description -->
          <div class="space-y-1">
            <Label for="personal-goals" class="flex items-center gap-2">
              Your Goals
              <Tooltip>
                <TooltipTrigger as-child>
                  <button type="button" class="text-muted-foreground hover:text-foreground">
                    <IconInfo class="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Describe your main life goals that your habits will help you achieve.</p>
                  <p class="text-xs mt-1">Example: "Read more books, Improve fitness consistency, Learn a new language"
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea id="personal-goals" v-model="personalInfo.personalGoals"
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
            <!-- time units -->
            <Select id="time-units" v-model="personalInfo.preferredTimeUnits">
              <template #field-label>
                <Label class="flex items-center gap-2" for="time-units">Time Units
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <button type="button" class="text-muted-foreground hover:text-foreground">
                        <IconInfo class="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose how you prefer to track time-based habits.</p>
                      <p class="text-xs mt-1">Example: "30 minutes of reading" vs "0.5 hours of reading"</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
              </template>
              <SelectTrigger>
                <SelectValue placeholder="Select time units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
              </SelectContent>
            </Select>

            <!-- count units -->
            <Select id="count-units" v-model="personalInfo.preferredCountUnits">
              <template #field-label>
                <Label class="flex items-center gap-2" for="time-units">Count Units
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <button type="button" class="text-muted-foreground hover:text-foreground">
                        <IconInfo class="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose how you prefer to count habit completions.</p>
                      <p class="text-xs mt-1">Example: "10 push-ups" vs "10 repetitions of push-ups"</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
              </template>
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
            <!-- default reminder time -->
            <Input id="default-reminder-time" v-model="personalInfo.defaultReminderTime!" type="time">
            <template #field-label>
              <Label for="default-reminder-time" class="flex items-center gap-2">
                Default Reminder Time
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button type="button" class="text-muted-foreground hover:text-foreground">
                      <IconInfo class="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set the default time for habit reminders.</p>
                    <p class="text-xs mt-1">Example: 9:00 AM for morning habits, 6:00 PM for evening habits</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
            </template>
            </Input>

            <!-- default tracking type -->
            <Select id="default-tracking-type" v-model="personalInfo.defaultTrackingType">
              <template #field-label>
                <Label for="default-tracking-type" class="flex items-center gap-2">
                  Default Tracking Type
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <button type="button" class="text-muted-foreground hover:text-foreground">
                        <IconInfo class="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Set the default tracking method for new habits.</p>
                      <p class="text-xs mt-1">Duration: tracks time spent | Count: tracks repetitions | Both: tracks
                        both
                        metrics</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
              </template>
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
          <Select id="default-goal-frequency" v-model="personalInfo.defaultGoalFrequency">
            <template #field-label>
              <Label for="default-goal-frequency" class="flex items-center gap-2">
                Default Goal Frequency
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button type="button" class="text-muted-foreground hover:text-foreground">
                      <IconInfo class="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set how often you want to achieve your habit goals.</p>
                    <p class="text-xs mt-1">Daily: every day | Weekly: X times per week | Monthly: X times per month
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
            </template>
            <SelectTrigger>
              <SelectValue placeholder="Select goal frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
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
          <Select v-model="personalInfo.theme" id="theme" label="Theme">
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">
import type { ProfileInfoType } from "~~/types";




const personalInfo = defineModel<Partial<ProfileInfoType>>("personalInfo", {
  required: true
})

const colorMode = useColorMode()

watch(() => personalInfo.value.theme, (newTheme) => {
  if (newTheme) {
    colorMode.preference = newTheme
  }
})

</script>

<style scoped></style>
