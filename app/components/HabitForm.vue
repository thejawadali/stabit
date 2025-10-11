<template>
  <main class="container mx-auto p-6 w-full max-w-5xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">
          {{ isEditMode ? "Edit Habit" : "Create New Habit" }}
        </h1>
        <p class="text-muted-foreground mt-1">
          {{ isEditMode ? "Update your habit details" : "Set up a new habit to track" }}
        </p>
      </div>
      <Button variant="ghost" @click="navigateTo('/habits')">
        <IconX class="w-4 h-4 mr-2" />
        Cancel
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-muted-foreground">Loading habit data...</p>
      </div>
    </div>

    <!-- Form Content -->
    <div v-else>

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
        <HabitGeneralInfo v-model:icon="formData.icon" v-model:name="formData.name" v-model:category="formData.category" v-model:description="formData.description" :categories="categories" />
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
        <Button v-if="!isEditMode" variant="secondary" @click="handleSave(true)">
          Save & Add Another
        </Button>
        <Button @click="handleSave(false)">
          <IconSave class="w-4 h-4 mr-2" />
          {{ isEditMode ? "Update Habit" : "Save Habit" }}
        </Button>
      </div>
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

// Props
interface Props {
  habitId?: string
  isEditMode?: boolean
  initialData?: FormData
  initialCustomFields?: CustomField[]
  initialRewards?: Reward[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  habitId: undefined,
  isEditMode: false,
  initialData: undefined,
  initialCustomFields: undefined,
  initialRewards: undefined,
  loading: false
})

// Emits
const emit = defineEmits<{
  save: [andAddAnother: boolean]
  update: []
}>()

const categories = ["Health", "Learning", "Productivity", "Fitness"]

const router = useRouter()

// Initialize form data
const formData = reactive<FormData>({
  name: "",
  category: "",
  description: "",
  icon: "🎯",
  recurrenceType: "daily",
  customRecurrence: "",
  timeOfDay: "09:00",
  startDate: new Date().toISOString().split("T")[0] || "",
  endDate: "",
  initialValue: 0,
  difficultyRate: 1,
  autoGrowth: false,
  goalValue: 0,
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

// Load habit data on component mount or when props change
onMounted(() => {
  initializeFormData()
})

watch(() => [props.initialData, props.initialCustomFields, props.initialRewards], () => {
  initializeFormData()
}, { deep: true })

function initializeFormData() {
  if (props.isEditMode && props.initialData) {
    // Use data passed from parent (fetched from API)
    Object.assign(formData, props.initialData)
    customFields.value = props.initialCustomFields || []
    rewards.value = props.initialRewards || []
  } else if (!props.isEditMode) {
    // For create mode, use default values
    resetToDefaults()
  }
}

function resetToDefaults() {
  Object.assign(formData, {
    name: "",
    category: "",
    description: "",
    icon: "🎯",
    recurrenceType: "daily",
    customRecurrence: "",
    timeOfDay: "09:00",
    startDate: new Date().toISOString().split("T")[0] || "",
    endDate: "",
    initialValue: 0,
    difficultyRate: 1,
    autoGrowth: false,
    goalValue: 0,
    goalMetric: "sessions",
    estimatedDate: "",
    notificationsEnabled: true,
    reminderTimes: ["09:00"],
    smartReminders: {
      missedYesterday: true,
      streakContinuation: false,
    },
  })
  customFields.value = []
  rewards.value = []
}

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
  
  if (props.isEditMode) {
    // In a real app, this would make an API call to update the habit
    // toast.success("Habit updated successfully!");
    emit('update')
  } else {
    // In a real app, this would make an API call to create the habit
    // toast.success("Habit created successfully!");
    emit('save', andAddAnother)
  }
  
  if (!andAddAnother) {
    router.push("/habits")
  } else {
    // Reset form for adding another habit
    Object.assign(formData, {
      name: "",
      category: "",
      description: "",
      icon: "🎯",
    })
    customFields.value = []
    rewards.value = []
  }
}
</script>

<style scoped></style>
