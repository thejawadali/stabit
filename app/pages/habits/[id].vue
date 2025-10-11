<template>
  <HabitForm 
    :habit-id="habitId" 
    :is-edit-mode="true" 
    :initial-data="habitData || undefined"
    :initial-custom-fields="customFields"
    :initial-rewards="rewards"
    :loading="loading"
    @update="handleUpdate" 
  />
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

const route = useRoute()
const router = useRouter()
const habitId = route.params.id as string

// Reactive data
const habitData = ref<FormData | null>(null)
const customFields = ref<CustomField[]>([])
const rewards = ref<Reward[]>([])
const loading = ref(true)
const error = ref<string | null>(null)


// Use the composable for data fetching
const { fetchHabit, fetchHabitCustomFields, fetchHabitRewards } = useHabitData()

// Fetch habit data
async function fetchHabitData() {
  try {
    loading.value = true
    error.value = null
    
    // Fetch habit data, custom fields, and rewards in parallel
    const [habit, customFieldsData, rewardsData] = await Promise.all([
      fetchHabit(habitId),
      fetchHabitCustomFields(habitId),
      fetchHabitRewards(habitId)
    ])
    
    if (habit) {
      habitData.value = habit
      customFields.value = customFieldsData
      rewards.value = rewardsData
    } else {
      error.value = "Habit not found"
      // Redirect to habits list if habit not found
      router.push('/habits')
    }
  } catch (err) {
    error.value = "Failed to load habit data"
    console.error('Error fetching habit:', err)
  } finally {
    loading.value = false
  }
}

// Load data on mount
onMounted(() => {
  fetchHabitData()
})

function handleUpdate() {
  // Handle update logic here if needed
  // The HabitForm component already handles the main update logic
  console.log('Update triggered for habit:', habitId)
}
</script>

<style scoped></style>