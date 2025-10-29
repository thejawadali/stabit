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
        <HabitGeneralInfo v-model:icon="formData.icon" v-model:name="formData.name"
          v-model:categoryId="formData.categoryId" v-model:description="formData.description"
          :categories="categories" />
      </TabsContent>

      <!-- Schedule & Recurrence  -->
      <TabsContent value="schedule" class="space-y-4">
        <HabitSchedule v-model:recurrenceType="formData.recurrenceType" v-model:timeOfDay="formData.timeOfDay"
          v-model:notificationsEnabled="formData.enableNotifications" v-model:reminderTimes="formData.reminderTimes" />
      </TabsContent>

      <!-- Difficulty & Growth -->
      <TabsContent value="growth" class="space-y-4">
        <HabitGrowth v-model:initialValue="formData.initialValue" v-model:difficultyRate="formData.difficultyRate"
          v-model:goalValue="formData.goalValue" v-model:goalMetric="formData.goalMetric"
          v-model:estimatedDate="formData.estimatedCompletionDate" />
      </TabsContent>

      <!-- Custom Fields -->
      <TabsContent value="custom" class="space-y-4">
        <HabitCustomFields v-model:customFields="customFields" />
      </TabsContent>

      <!-- Rewards & Milestones -->
      <TabsContent value="rewards" class="space-y-4">
        <HabitRewards v-model:rewards="rewards" :goalMetric="formData.goalMetric ?? 'sessions'" />
      </TabsContent>
    </Tabs>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between mt-6">
      <Button variant="outline" @click="navigateTo('/habits')">
        Cancel
      </Button>
      <div class="flex items-center gap-3">
        <Button variant="outline" @click="showPreview = true" :is-loading="loading">
          Preview Summary
        </Button>
        <Button :is-loading="loading" @click="handleSave">
          <IconSave class="w-4 h-4 mr-2" />
          {{ isEditMode ? "Update Habit" : "Save Habit" }}
        </Button>
      </div>
    </div>
  </main>

  <HabitPreviewDialog v-model="showPreview" :formData="formData" :categories="categories" :customFields="customFields"
    :rewards="rewards" @save="handleSave" />
</template>

<script setup lang="ts">
import type { FieldType, RecurrenceType } from "@prisma/client"
import type { HabitFormData } from "~~/types"

const { validate } = useForm()
const INITIAL_FORM_DATA: HabitFormData = {
  name: "",
  categoryId: "", // categoryId
  description: "",
  icon: "🎯",

  recurrenceType: "daily" as RecurrenceType,
  timeOfDay: "19:00",
  reminderTimes: ["09:00"],
  enableNotifications: true,

  goalMetric: "sessions",
  goalValue: 0,
  estimatedCompletionDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
  initialValue: 0,
  difficultyRate: 1,
}

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

// Props
interface Props {
  categories: { id: string, name: string, icon: string }[]
  habitId?: string
  isEditMode?: boolean
  initialData?: HabitFormData
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
  save: [HabitFormData]
  update: [HabitFormData]
}>()

const showPreview = ref(false)
const router = useRouter()



// Initialize form data
const formData = reactive<HabitFormData>(INITIAL_FORM_DATA)

const customFields = ref<CustomField[]>([])
const rewards = ref<Reward[]>([])

// Load habit data on component mount or when props change
onMounted(() => {
  initializeFormData()
})


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
  Object.assign(formData, INITIAL_FORM_DATA)
  customFields.value = []
  rewards.value = []
}

async function handleSave() {
  const { valid } = await validate()
  if (!valid) return

  const cleanFields = customFields.value
    .filter(({ title = "" }) => title.trim() !== "")
    .map(({ title, type, options, required }, index) => ({
      sortingOrder: index + 1,
      title: title.trim(),
      fieldType: type as FieldType,
      options: options || [],
      isRequired: !!required,
    }))

  const cleanRewards = rewards.value
    .filter(({ name = "" }) => name.trim() !== "")
    .map(({ name, description, icon, milestoneValue }) => ({
      name,
      description,
      icon,
      milestoneValue,
    }))

  const payload = {
    ...formData,
    customFields: cleanFields,
    rewards: cleanRewards,
  }


  if (props.isEditMode) {
    emit('update', payload)
  } else {
    emit('save', payload)
  }
}


</script>