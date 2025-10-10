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

    <Tabs defaultValue="general" class="space-y-6 w-full">
      <TabsList class="grid w-full grid-cols-5">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="growth">Growth</TabsTrigger>
        <TabsTrigger value="custom">Custom Fields</TabsTrigger>
        <TabsTrigger value="rewards">Rewards</TabsTrigger>
      </TabsList>

      <!-- General Information -->
      <TabsContent value="general" class="space-y-4">
        <HabitGeneralInfo v-model:icon="formData.icon" v-model:name="formData.name" v-model:category="formData.category" v-model:description="formData.description" :categories="cateogries" />
      </TabsContent>


      <!-- Schedule & Recurrence  -->
      <TabsContent value="schedule" class="space-y-4">
        <HabitSchedule v-model:recurrenceType="formData.recurrenceType" v-model:timeOfDay="formData.timeOfDay" v-model:startDate="formData.startDate" v-model:endDate="formData.endDate" v-model:notificationsEnabled="formData.notificationsEnabled" v-model:reminderTimes="formData.reminderTimes" v-model:missedYesterday="formData.smartReminders.missedYesterday" v-model:streakContinuation="formData.smartReminders.streakContinuation" />
      </TabsContent>

      <!-- Difficulty & Growth -->
      <TabsContent value="growth" class="space-y-4">
        <HabitGrowth v-model:initialValue="formData.initialValue" v-model:difficultyRate="formData.difficultyRate" v-model:goalValue="formData.goalValue" v-model:goalMetric="formData.goalMetric" v-model:estimatedDate="formData.estimatedDate" />
      </TabsContent>


      <!-- Custom Fields -->
      <TabsContent value="custom" class="space-y-4">
        <HabitCustomFields v-model:customFields="customFields" />
      </TabsContent>


      <!-- Rewards & Milestones -->
      <TabsContent value="rewards" class="space-y-4">
        <HabitRewards v-model:rewards="rewards" :goalMetric="formData.goalMetric" />
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
  type: "text" | "number" | "select" | "boolean"
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
  recurrenceType: "daily" | "weekly" | "monthly"
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

const cateogries = ["Health", "Learning", "Productivity", "Fitness"]

const router = useRouter()
const route = useRoute()
const editMode = computed(() => route.query.edit === "true")



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
  initialValue: 12,
  difficultyRate: 1,
  autoGrowth: false,
  goalValue: 30,
  goalMetric: "sessions",
  estimatedDate: "",
  notificationsEnabled: true,
  reminderTimes: ["09:00"],
  smartReminders: {
    missedYesterday: true,
    streakContinuation: false,
  },
})

const customFields = ref<CustomField[]>([])
const rewards = ref<Reward[]>([])
const showPreview = ref(false)

function updateFormData<K extends keyof FormData>(key: K, value: FormData[K]) {
  formData[key] = value
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