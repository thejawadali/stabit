<template>
  <main class="container mx-auto p-6 w-full max-w-5xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">
          {{ editMode ? "Edit Habit" : "Create New Habit" }}
        </h1>
        <p class="text-muted-foreground mt-1">
          {{ editMode ? "Update your habit details" : "Set up a new habit to track" }}
        </p>
      </div>
      <Button variant="ghost" @click="navigateTo('/habits')">
        <IconX class="w-4 h-4 mr-2" />
        Cancel
      </Button>
    </div>

    <Tabs defaultValue="growth" class="space-y-6 w-full">
      <TabsList class="grid w-full grid-cols-5">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="growth">Growth</TabsTrigger>
        <TabsTrigger value="custom">Custom Fields</TabsTrigger>
        <TabsTrigger value="rewards">Rewards</TabsTrigger>
      </TabsList>

      <!-- General Information -->
      <TabsContent value="general" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="icon">Habit Icon</Label>
              <div class="flex items-center gap-4">
                <Button type="button" variant="outline" class="text-4xl h-16 w-16"
                  @click="showEmojiPicker = !showEmojiPicker">
                  {{ formData.icon }}
                </Button>
                <div v-if="showEmojiPicker" class="flex flex-wrap gap-2 p-4 border rounded-lg bg-background">
                  <Button v-for="emoji in EMOJI_OPTIONS" :key="emoji" type="button" variant="ghost"
                    @click="formData.icon = emoji; showEmojiPicker = false" class="text-2xl h-12 w-12">
                    {{ emoji }}
                  </Button>
                </div>
              </div>
            </div>

            <Input label="Habit Name" rules="required" name="name" placeholder="e.g., Daily Reading" validateOnBlur
              v-model="formData.name" />

            <Select label="Category" rules="required" name="category" placeholder="Select a category" validateOnBlur>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="cat in CATEGORIES" :key="cat" :value="cat">
                  {{ cat }}
                </SelectItem>
              </SelectContent>
            </Select>
            <Textarea name="description" label="Description / Motivation"
              placeholder="Why is this habit important to you?" />

          </CardContent>
        </Card>
      </TabsContent>


      <!-- Schedule & Recurrence  -->
      <TabsContent value="schedule" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <CalendarIcon class="w-5 h-5" />
              Recurrence & Schedule
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <Select label="Recurrence Type" v-model="formData.recurrenceType">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            <Input v-if="formData.recurrenceType === 'custom'" label="Custom Recurrence Pattern" name="customRecurrence"
              placeholder="e.g., Every 2 days, Mon-Wed-Fri" v-model="formData.customRecurrence" />

            <Input name="timeOfDay" label="Preferred Time of Day" type="time" v-model="formData.timeOfDay" />

            <div class="grid grid-cols-2 gap-4">
              <Input name="startDate" type="date" v-model="formData.startDate" label="Start Date" />
              <Input name="endDate" type="date" v-model="formData.endDate" label="End Date (Optional)" />
            </div>

            <!-- Notifications -->
            <div class="pt-4 border-t space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-base">Notifications & Reminders</Label>
                  <p class="text-sm text-muted-foreground">Get reminded to complete your habit</p>
                </div>
                <Switch v-model="formData.notificationsEnabled" />
              </div>

              <div class="space-y-2" v-if="formData.notificationsEnabled">
                <Label>Reminder Times</Label>
                <div v-for="(time, index) in formData.reminderTimes" :key="index" class="flex items-center gap-2">
                  <Input type="time" v-model="formData.reminderTimes[index]" />
                  <Button v-if="formData.reminderTimes.length > 1" type="button" variant="ghost" size="icon"
                    @click="removeReminderTime(index)">
                    <IconTrash2 class="w-4 h-4" />
                  </Button>
                </div>
                <Button type="button" variant="outline" size="sm" @click="addReminderTime">
                  <IconPlus class="w-4 h-4 mr-2" />
                  Add Reminder Time
                </Button>
              </div>

              <div class="space-y-3">
                <Label>Smart Reminders</Label>
                <div class="flex items-center justify-between">
                  <Label for="missedYesterday" class="font-normal">
                    Send gentle reminder if missed yesterday
                  </Label>
                  <Switch id="missedYesterday" v-model="formData.smartReminders.missedYesterday" />
                </div>

                <div class="flex items-center justify-between">
                  <Label for="streakContinuation" class="font-normal">
                    Encourage streak continuation
                  </Label>
                  <Switch id="streakContinuation" v-model="formData.smartReminders.streakContinuation" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Difficulty & Growth -->
      <TabsContent value="growth" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <TrendingUp class="w-5 h-5" />
              Difficulty & Growth Settings
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <Input name="initialValue" label="Initial Value / Starting Point" type="number"
              placeholder="e.g., 5 pushups" v-model="formData.initialValue" />

            <Input label="Difficulty Increase Rate" name="difficultyRate" type="number" placeholder="e.g., +1"
              v-model="formData.difficultyRate">
            <template #suffix>
              <span class="text-sm text-muted-foreground w-20">per week</span>
            </template>
            </Input>

            <div class="flex items-center justify-between">
              <div>
                <Label htmlFor="autoGrowth" class="text-base">Auto-Growth</Label>
                <p class="text-sm text-muted-foreground">Automatically increase difficulty over time</p>
              </div>
              <Switch id="autoGrowth" v-model="formData.autoGrowth" />
            </div>


            <div class="pt-4 border-t space-y-4">
              <Label class="text-base flex items-center gap-2">
                <IconTarget class="w-5 h-5" />
                Goal Definition
              </Label>
            </div>


            <Input name="goalValue" type="number" placeholder="e.g., 100" v-model="formData.goalValue"
              label="Ultimate Goal" />

            <Select name="goalMetric" v-model="formData.goalMetric" label="Goal Metric">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sessions">Sessions</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="repetitions">Repetitions</SelectItem>
                <SelectItem value="pages">Pages</SelectItem>
                <SelectItem value="miles">Miles</SelectItem>
              </SelectContent>
            </Select>

            <Input name="estimatedDate" type="date" v-model="formData.estimatedDate"
              label="Estimated Completion Date" />
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>


    <!-- Action Buttons -->
    <div class="flex items-center justify-between mt-6 pt-6 border-t">
      <Button variant="outline" @click="navigateTo('/habits')">
        Cancel
      </Button>
      <div class="flex items-center gap-3">
        <Button variant="outline">
          Preview Summary
        </Button>
        <Button v-if="!editMode" variant="secondary">
          Save & Add Another
        </Button>
        <Button>
          <IconSave class="w-4 h-4 mr-2" />
          {{ editMode ? "Update Habit" : "Save Habit" }}
        </Button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
type CustomField = {
  id: string
  title: string
  type: "text" | "number" | "date" | "select" | "boolean"
  options?: string[]
  required: boolean
}

type Reward = {
  id: string
  milestoneValue: number
  name: string
  description: string
  icon: string
}

type FormData = {
  name: string
  category: string
  description: string
  icon: string
  recurrenceType: "daily" | "weekly" | "custom"
  customRecurrence: string
  timeOfDay: string
  startDate: string
  endDate: string
  initialValue: number
  difficultyRate: number
  autoGrowth: boolean
  goalValue: number
  goalMetric: string
  estimatedDate: string
  notificationsEnabled: boolean
  reminderTimes: string[]
  smartReminders: {
    missedYesterday: boolean
    streakContinuation: boolean
  }
}

// withDefaults(defineProps<{
//   editMode: boolean
// }>(), {
//   editMode: false
// })


const EMOJI_OPTIONS = ["📚", "🏃", "💪", "🎯"]
const CATEGORIES = ["Health", "Learning", "Productivity", "Fitness"]

const router = useRouter()
const route = useRoute()
const editMode = computed(() => route.query.edit === "true")


const showEmojiPicker = ref(false)
const formData = reactive<FormData>({
  name: "Daily Walk",
  category: "",
  description: "",
  icon: "🏃",
  recurrenceType: "daily",
  customRecurrence: "",
  timeOfDay: "09:00",
  startDate: new Date().toISOString().split("T")[0] || "",
  endDate: "",
  initialValue: 1,
  difficultyRate: 1,
  autoGrowth: false,
  goalValue: 30,
  goalMetric: "sessions",
  estimatedDate: "",
  notificationsEnabled: true,
  reminderTimes: ["09:00"],
  smartReminders: {
    missedYesterday: true,
    streakContinuation: true,
  },
})

const customFields = ref<CustomField[]>([])
const rewards = ref<Reward[]>([])
const showPreview = ref(false)

function updateFormData<K extends keyof FormData>(key: K, value: FormData[K]) {
  formData[key] = value
}

function addReminderTime() {
  formData.reminderTimes.push("09:00")
}

function removeReminderTime(index: number) {
  formData.reminderTimes.splice(index, 1)
}

function handleSave(andAddAnother = false) {
  if (!formData.name) {
    // toast.error("Please enter a habit name");
    return
  }
  if (!formData.category) {
    // toast.error("Please select a category");
    return
  }
  // toast.success(editMode.value ? "Habit updated successfully!" : "Habit created successfully!");

  if (andAddAnother) {
    Object.assign(formData, {
      name: "",
      category: "",
      description: "",
      icon: "🎯",
    })
    customFields.value = []
    rewards.value = []
  } else {
    router.push("/habits")
  }
}
</script>

<style scoped></style>