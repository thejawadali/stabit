<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <IconCalendar class="w-5 h-5" />
        Frequency & Schedule
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <Select label="Frequency" v-model="frequency">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>

      <Input name="timeOfDay" label="Preferred Time of Day" type="time" v-model="timeOfDay" />

      <!-- Notifications -->
      <!-- Hidden for MVP -->
      <div class="pt-4 border-t space-y-4 hidden">
        <div class="flex items-center justify-between">
          <div>
            <Label class="text-base">Notifications & Reminders</Label>
            <p class="text-sm text-muted-foreground">Get reminded to complete your habit</p>
          </div>
          <Switch v-model="notificationsEnabled" />
        </div>

        <div class="space-y-2" v-if="notificationsEnabled">
          <div class="flex items-center justify-between">  
            <Label>Reminder Times</Label>
            <Button type="button" variant="outline" size="sm" @click="addReminderTime">
              <IconPlus class="w-4 h-4 mr-2" />
              Add Reminder Time
            </Button>
          </div>
          <div v-for="(_, index) in reminderTimes" :key="index" class="flex items-center gap-2">
            <template v-if="reminderTimes">
              <Input type="time" v-model="reminderTimes[index]" />
              <Button v-if="reminderTimes.length > 1" type="button" variant="ghost" size="icon"
                @click="removeReminderTime(index)">
                <IconTrash2 class="w-4 h-4" />
              </Button>
            </template>
          </div>
        </div>

        <!-- <div class="space-y-3">
          <Label>Smart Reminders</Label>
          <div class="flex items-center justify-between">
            <Label for="missedYesterday" class="font-normal">
              Send gentle reminder if missed yesterday
            </Label>
            <Switch id="missedYesterday" v-model="missedYesterday" />
          </div>

          <div class="flex items-center justify-between">
            <Label for="streakContinuation" class="font-normal">
              Encourage streak continuation
            </Label>
            <Switch id="streakContinuation" v-model="streakContinuation" />
          </div>
        </div> -->
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">

const frequency = defineModel<string>('frequency')
const timeOfDay = defineModel<string>('timeOfDay')
const notificationsEnabled = defineModel<boolean>('notificationsEnabled')
const reminderTimes = defineModel<string[]>('reminderTimes')




const removeReminderTime = (index: number) => {
  reminderTimes.value?.splice(index, 1)
}

const addReminderTime = () => {
  reminderTimes.value?.push("00:00")
}

</script>

<style scoped></style>