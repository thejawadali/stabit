<template>
  <div class="space-y-6">
    <!-- Notification Types -->
    <Card class="relative">
      <div v-if="!enabled"
        class="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
        <div class="text-center">
          <div class="text-2xl mb-2">🔕</div>
          <p class="text-sm text-muted-foreground">Enable notifications to configure settings</p>
        </div>
      </div>
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl">🔔</span>
            <div>
              <div>Notifications</div>
              <CardDescription class="mt-0">
                Enable or disable the entire notification system
              </CardDescription>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Habit Reminders</p>
              <p class="text-sm text-muted-foreground">
                Get reminded to complete your habits
              </p>
            </div>
            <Switch v-model="notificationData.enableReminders" />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Milestone Achievements</p>
              <p class="text-sm text-muted-foreground">
                Celebrate when you reach important milestones
              </p>
            </div>
            <Switch v-model="notificationData.enableMilestones" />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Streak Updates</p>
              <p class="text-sm text-muted-foreground">
                Stay motivated with streak progress updates
              </p>
            </div>
            <Switch v-model="notificationData.enableStreaks" />
          </div>

          <!-- <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">System Updates</p>
              <p class="text-sm text-muted-foreground">
                Receive app updates and maintenance notifications
              </p>
            </div>
            <Switch v-model="notificationData" />
          </div> -->
        </div>
      </CardContent>
    </Card>

    <!-- Reminder Preferences -->
    <Card class="relative">
      <div v-if="!enabled"
        class="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
        <div class="text-center">
          <div class="text-2xl mb-2">🔕</div>
          <p class="text-sm text-muted-foreground">Enable notifications to configure settings</p>
        </div>
      </div>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">⏰</span>
          Reminder Preferences
        </CardTitle>
        <CardDescription>
          Configure default reminder settings for new habits
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Default Reminder Time -->
          <Input id="default-reminder-time" label="Default Reminder Time"
            v-model="notificationData.defaultReminderTime!" type="time" />

          <!-- Reminder Tone -->
          <Select id="reminder-tone" label="Reminder Tone" v-model="notificationData.reminderTone">
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gentle">Gentle</SelectItem>
              <SelectItem value="motivational">Motivational</SelectItem>
              <SelectItem value="energetic">Energetic</SelectItem>
              <SelectItem value="calm">Calm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Smart Reminders</p>
            <p class="text-sm text-muted-foreground">
              Get intelligent reminders based on your patterns
            </p>
          </div>
          <Switch v-model="notificationData.smartReminders" />
        </div>
      </CardContent>
    </Card>

    <!-- Frequency Control -->
    <Card class="relative" v-if="false">
      <div v-if="!enabled"
        class="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
        <div class="text-center">
          <div class="text-2xl mb-2">🔕</div>
          <p class="text-sm text-muted-foreground">Enable notifications to configure settings</p>
        </div>
      </div>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">📅</span>
          Frequency Control
        </CardTitle>
        <CardDescription>
          Choose how often you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="notification-frequency">Notification Frequency</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="daily-summary">Daily Summary</SelectItem>
              <SelectItem value="weekly-summary">Weekly Summary</SelectItem>
              <SelectItem value="custom">Custom Schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- <div v-if="notificationData.frequency === 'custom'" class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Monday</p>
            </div>
            <Switch v-model="notificationData.customSchedule.monday" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Tuesday</p>
            </div>
            <Switch v-model="notificationData.customSchedule.tuesday" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Wednesday</p>
            </div>
            <Switch v-model="notificationData.customSchedule.wednesday" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Thursday</p>
            </div>
            <Switch v-model="notificationData.customSchedule.thursday" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Friday</p>
            </div>
            <Switch v-model="notificationData.customSchedule.friday" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Saturday</p>
            </div>
            <Switch v-model="notificationData.customSchedule.saturday" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Sunday</p>
            </div>
            <Switch v-model="notificationData.customSchedule.sunday" />
          </div>
        </div> -->
      </CardContent>
    </Card>

    <!-- Delivery Channels -->
    <Card class="relative" v-if="false">
      <div v-if="!enabled"
        class="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
        <div class="text-center">
          <div class="text-2xl mb-2">🔕</div>
          <p class="text-sm text-muted-foreground">Enable notifications to configure settings</p>
        </div>
      </div>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">📱</span>
          Delivery Channels
        </CardTitle>
        <CardDescription>
          Choose how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">In-App Notifications</p>
              <p class="text-sm text-muted-foreground">
                Show notifications within the app
              </p>
            </div>
            <Switch v-model="notificationData.inAppNotifications" />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Email Notifications</p>
              <p class="text-sm text-muted-foreground">
                Send notifications to your email
              </p>
            </div>
            <Switch v-model="notificationData.emailNotifications" />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Push Notifications</p>
              <p class="text-sm text-muted-foreground">
                Send push notifications to your device
              </p>
            </div>
            <Switch v-model="notificationData.pushNotifications" />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Quiet Hours -->
    <Card class="relative">
      <div v-if="!enabled"
        class="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
        <div class="text-center">
          <div class="text-2xl mb-2">🔕</div>
          <p class="text-sm text-muted-foreground">Enable notifications to configure settings</p>
        </div>
      </div>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">🌙</span>
          Quiet Hours
        </CardTitle>
        <CardDescription>
          Set times when you don't want to be disturbed
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Enable Quiet Hours</p>
            <p class="text-sm text-muted-foreground">
              Automatically mute notifications during specified hours
            </p>
          </div>
          <Switch v-model="notificationData.quietHoursEnabled" />
        </div>

        <div v-if="notificationData.quietHoursEnabled" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Start Time -->
          <Input label="Start Time" id="quiet-start" v-model="notificationData.quietHoursStart!" type="time" />
          <!-- End Time -->
          <Input id="quiet-end" label="End Time" v-model="notificationData.quietHoursEnd!" type="time" />
        </div>

        <div v-if="notificationData.quietHoursEnabled" class="space-y-1">
          <Label for="quiet-days">Quiet Days</Label>
          <div class="flex flex-wrap gap-2">
            <Button v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day"
              :variant="notificationData.quietHoursDays.includes(day.toLowerCase()) ? 'default' : 'outline'" size="sm"
              @click="toggleQuietDay(day.toLowerCase())">
              {{ day }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Snooze Option -->
    <Card class="relative">
      <div v-if="!enabled"
        class="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
        <div class="text-center">
          <div class="text-2xl mb-2">🔕</div>
          <p class="text-sm text-muted-foreground">Enable notifications to configure settings</p>
        </div>
      </div>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span class="text-xl">😴</span>
          Snooze Option
        </CardTitle>
        <CardDescription>
          Temporarily mute all notifications
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Snooze Duration -->
        <Select id="snooze-duration" label="Snooze Duration" v-model="notificationData.snoozeDuration">
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15min">15 minutes</SelectItem>
            <SelectItem value="1hour">1 hour</SelectItem>
            <SelectItem value="2hours">2 hours</SelectItem>
            <SelectItem value="4hours">4 hours</SelectItem>
            <SelectItem value="8hours">8 hours</SelectItem>
            <SelectItem value="24hours">24 hours</SelectItem>
          </SelectContent>
        </Select>

        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Currently Snoozed</p>
            <p class="text-sm text-muted-foreground">
              {{ notificationData.isSnoozed ? 'Notifications are snoozed' : 'Notifications are active' }}
            </p>
          </div>
          <Button :variant="notificationData.isSnoozed ? 'default' : 'outline'" size="sm" @click="toggleSnooze">
            {{ notificationData.isSnoozed ? 'Unsnooze' : 'Snooze Now' }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { NotificationSettingsType } from "~~/types"

defineProps<{
  enabled: boolean
}>()

const notificationData = defineModel<NotificationSettingsType>('notificationSettings', { required: true })

function toggleQuietDay(day: string) {
  const index = notificationData.value.quietHoursDays.indexOf(day)
  if (index > -1) {
    notificationData.value.quietHoursDays.splice(index, 1)
  } else {
    notificationData.value.quietHoursDays.push(day)
  }
}

function toggleSnooze() {
  notificationData.value.isSnoozed = !notificationData.value.isSnoozed
  if (notificationData.value.isSnoozed) {
    // toast.success(`Notifications snoozed for ${notificationData.snoozeDuration}`)
  } else {
    // toast.success('Notifications unsnoozed')
  }
}
</script>

<style scoped></style>
