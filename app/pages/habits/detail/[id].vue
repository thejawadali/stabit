<template>
  <main class="container mx-auto p-6 w-full space-y-6 max-w-5xl">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <Button variant="ghost" size="icon" @click="router.push('/habits')">
          <IconArrowLeft class="h-5 w-5" />
        </Button>
        <div>
          <div class="flex items-center space-x-3">
            <span class="text-3xl">{{ habit?.icon }}</span>
            <h1 class="text-3xl font-bold text-foreground">{{ habit?.name }}</h1>
          </div>
          <p class="text-muted-foreground mt-1">{{ habit?.description }}</p>
        </div>
      </div>

      <div class="flex space-x-2">
        <Button variant="outline" @click="router.push(`/habits/${habit?.id}`)">
          <IconEdit class="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" @click="handleDelete">
          <IconTrash2 class="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <HabitDetailStatsCard v-for="stat in habitStats" :key="stat.title" 
       :title="stat.title" :value="stat.value" :subtitle="stat.subtitle" :icon="stat.icon" :iconColor="stat.iconColor" :suffix="stat.suffix" />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 7-Day Activity -->
      <HabitDetailWeeklyActivityChart :logs="logs" />

      <!-- 30-Day Trend -->
      <HabitDetailOneMonthTrendChart :logs="logs" />

      <!-- Weekly Performance -->
      <HabitDetailWeeklyPerformanceChart :logs="logs" />

      <!-- Status Distribution -->
      <HabitDetailStatusChart :logs="logs" />
    </div>

    <!-- Recent Activity -->
    <Card class="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-if="logs.length === 0" class="text-center text-muted-foreground py-8">No activity recorded yet</div>

          <div v-for="log in logs.slice(0, 10)" :key="log.id"
            class="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div class="flex items-center space-x-4">
              <IconCalendar class="h-5 w-5 text-muted-foreground" />
              <div>
                <p class="font-medium text-foreground">{{ formatDate(log.createdAt) }}</p>
                <p v-if="log.notes" class="text-sm text-muted-foreground">{{ log.notes }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span v-if="log.durationMinutes" class="text-sm text-muted-foreground">{{ log.durationMinutes }}
                min</span>
              <Badge :variant="log.completionStatus === 'completed' ? 'default' : 'secondary'" class="capitalize">
                {{ log.completionStatus }}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </main>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { IconFlame, IconTarget, IconTrophy, IconClock } from "#components";
const { confirm } = useConfirm()

const route = useRoute()
const router = useRouter()
const { toast } = useToast()
const id = String(route.params.id || '')

const habit = ref<HabitDetail | null>(null)
const logs = ref<HabitLog[]>([])
const isLoading = ref(true)

// const stats = reactive({
//   completionRate: 0,
//   avgDuration: 0,
//   totalDays: 0,
//   consecutiveDays: 0
// })
const stats = reactive({
  completionRate: 75,
  avgDuration: 17,
  totalDays: 87,
  consecutiveDays: 12
})


const habitStats = [
  {
    title: "Current Streak",
    value: habit.value?.currentStreak || 0,
    subtitle: "days",
    icon: IconFlame,
    iconColor: "text-primary",
  },
  {
    title: "Completion Rate",
    value: stats.completionRate,
    suffix: "%",
    subtitle: "last 30 days",
    icon: IconTarget,
    iconColor: "text-success",
  },
  {
    title: "Total Completions",
    value: habit.value?.totalCompletions || 0,
    subtitle: "all time",
    icon: IconTrophy,
    iconColor: "text-warning",
  },
  {
    title: "Avg Duration",
    value: stats.avgDuration,
    subtitle: "minutes",
    icon: IconClock,
    iconColor: "text-primary",
  },
]



onMounted(() => {
  if (id) fetchHabitDetails()
})

async function fetchHabitDetails() {
  habit.value = {
    id: id || "1",
    name: "Morning Meditation",
    description: "Start the day with 15 minutes of mindfulness meditation",
    category: "Health",
    frequency: "daily",
    icon: "🧘",
    currentStreak: 12,
    longestStreak: 25,
    totalCompletions: 87,
    currentGoal: 100,
    status: "active",
    createdAt: new Date("2024-01-15")
  }

  logs.value = [
    { id: "1", createdAt: dayjs().format("YYYY-MM-DD"), completionStatus: "completed", durationMinutes: 15, notes: "Great session!" },
    { id: "2", createdAt: dayjs().subtract(1, "day").format("YYYY-MM-DD"), completionStatus: "completed", durationMinutes: 20 },
    { id: "3", createdAt: dayjs().subtract(2, "day").format("YYYY-MM-DD"), completionStatus: "completed", durationMinutes: 15 },
    { id: "4", createdAt: dayjs().subtract(3, "day").format("YYYY-MM-DD"), completionStatus: "skipped", notes: "Overslept" },
    { id: "5", createdAt: dayjs().subtract(4, "day").format("YYYY-MM-DD"), completionStatus: "completed", durationMinutes: 18 },
    { id: "6", createdAt: dayjs().subtract(5, "day").format("YYYY-MM-DD"), completionStatus: "completed", durationMinutes: 15 },
    { id: "7", createdAt: dayjs().subtract(6, "day").format("YYYY-MM-DD"), completionStatus: "completed", durationMinutes: 20 },
    { id: "8", createdAt: dayjs().subtract(8, "day").format("YYYY-MM-DD"), completionStatus: "completed", durationMinutes: 15 },
    { id: "9", createdAt: dayjs().subtract(10, "day").format("YYYY-MM-DD"), completionStatus: "completed", durationMinutes: 22 },
    { id: "10", createdAt: dayjs().subtract(12, "day").format("YYYY-MM-DD"), completionStatus: "completed", durationMinutes: 15 },
  ]

  return
  try {
    // TODO: don't fetch habit and logs diffently, fetch both together in a single api
    isLoading.value = true

    // Fetch habit
    const habitResponse = await $fetch<{ success: boolean; data: any }>(`/api/habits/${id}`)
    if (!habitResponse.success || !habitResponse.data) {
      throw new Error('Failed to fetch habit')
    }
    habit.value = habitResponse.data as Habit

    // Fetch logs (last 30 days)
    const thirtyDaysAgo = dayjs().subtract(30, 'day')
    const logsResponse = await $fetch<{ success: boolean; data: any[] }>('/api/habit-logs', {
      query: {
        habitId: id,
        createdAtStart: thirtyDaysAgo.format('YYYY-MM-DD')
      }
    })

    if (!logsResponse.success || !logsResponse.data) {
      throw new Error('Failed to fetch logs')
    }
    logs.value = logsResponse.data as HabitLog[]

    calculateStats(logs.value, habit.value as Habit)
  } catch (err: any) {
    console.error('Error fetching habit details:', err)
    toast({
      title: 'Error',
      description: err?.data?.message || err?.message || 'Failed to load habit details',
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}

function calculateStats(logsData: HabitLog[], habitData: HabitDetail) {
  const last30Days = 30
  const completedLogs = logsData.filter((l) => l.completionStatus === 'completed')
  const completionRate = (completedLogs.length / last30Days) * 100
  const avgDuration = completedLogs.length > 0
    ? Math.round(completedLogs.reduce((s, l) => s + (l.durationMinutes || 0), 0) / completedLogs.length)
    : 0

  stats.completionRate = Math.round(completionRate)
  stats.avgDuration = avgDuration
  stats.totalDays = completedLogs.length
  stats.consecutiveDays = habitData.currentStreak || 0
}

function formatDate(dateStr: string) {
  try { return dayjs(dateStr).format('MMMM DD, YYYY') } catch { return dateStr }
}

async function handleDelete() {
  const confirmed = await confirm({
    title: 'Delete Habit?',
    description: 'This action cannot be undone. This will permanently delete the habit and all its data.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/habits/${id}`, {
      method: 'DELETE'
    })

    toast({
      title: 'Success',
      description: 'Habit deleted successfully'
    })

    router.push('/habits')
  } catch (err: any) {
    console.error('Error deleting habit:', err)
    toast({
      title: 'Error',
      description: err?.data?.message || err?.message || 'Failed to delete habit',
      variant: 'destructive'
    })
  }
}
</script>
