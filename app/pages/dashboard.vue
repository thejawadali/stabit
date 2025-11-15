<template>
  <main class="flex-1 p-4 sm:p-6 lg:p-8 pt-24 pb-12 max-w-7xl mx-auto w-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-foreground mb-2">Dashboard 👋</h1>
      <p class="text-muted-foreground">Track your habits and achieve your goals</p>
    </div>
    <div class="space-y-6">
      <!-- Summary Bar -->
      <SummaryBar :completed-today="dashboardData?.todayProgress.completed ?? 0"
        :total-today="dashboardData?.todayProgress.total ?? 0" :current-streak="dashboardData?.activeStreak ?? 0"
        :total-habits="dashboardData?.totalHabits ?? 0" :weekly-completion="dashboardData?.weeklyRate ?? 0" />


      <!-- Filters -->
      <Filters v-model:search="searchQuery" v-model:status="statusFilter" v-model:category="categoryFilter"
        :categories="dashboardData?.categories ?? []" />

      <!-- Main Content Grid -->
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Left Column - 2/3 width -->
        <div className="lg:col-span-2 space-y-6">
          <!-- Today's Habits -->
          <TodayHabits :habits="filteredTodayHabits" />


          <!-- Missed Habits -->
          <MissedHabits :missedHabitLogs="missedHabits" />

          <!-- Recent Activity -->
          <RecentActivity :activities="recentActivities" />
        </div>

        <!-- Right Column - 1/3 width -->
        <div className="space-y-6">
          <!-- Calendar Widget -->
          <Card class="bg-gradient-card shadow-card" v-loading="calendarLoading">
            <CardHeader class="pb-1" />
            <CardContent>
              <CalendarWidget :completed-days="calendarData.completed" :partially-completed="calendarData.partial"
                :missed-days="calendarData.missed" v-model:currentDate="calendarDate"
                @onDateChange="fetchCalendarData" />
            </CardContent>
          </Card>

          <!-- Progress Snapshot -->
          <ProgressSnapshot :weekly-completion="dashboardData?.weeklyRate ?? 0" :monthly-trend="12"
            :remaining-sessions="15" :total-sessions="247"
            :streak-text="dashboardData?.activeStreak ? `You're on a ${dashboardData.activeStreak}-day streak! 🔥` : 'Start building your streak!'" />

          <!-- Milestones -->
          <!-- <MilestonesPanel :milestones="milestones" /> -->
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// Types for API responses
type DashboardResponse = {
  success: boolean
  data: {
    todayProgress: {
      completed: number
      total: number
    }
    activeStreak: number
    totalHabits: number
    weeklyRate: number
    categories: Partial<Category>[]
    todayHabits: TodayHabit[]
    missedHabits: MissedHabitLogs[]
  }
}

type CalendarResponse = {
  success: boolean
  data: {
    completed: number[]
    partial: number[]
    missed: number[]
  }
}

type DashboardAndCalendarData = {
  dashboard: DashboardResponse['data']
  calendar: CalendarResponse['data']
}

// Calendar state
const calendarDate = ref<Date>(new Date())
const calendarLoading = ref(false)
const calendarData = ref<CalendarResponse['data']>({
  completed: [],
  partial: [],
  missed: []
})

// Filter state
const searchQuery = ref('')
const statusFilter = ref<HabitStatus | 'all'>('all')
const categoryFilter = ref<string | null>(null)

// Fetch calendar data
const fetchCalendarData = async () => {
  calendarLoading.value = true
  try {
    const response = await $fetch<CalendarResponse>('/api/dashboard/calendar', {
      query: {
        month: calendarDate.value.getMonth() + 1,
        year: calendarDate.value.getFullYear()
      }
    })
    calendarData.value = response.data
    return response
  } catch (error) {
    console.error('Error fetching calendar data:', error)
  } finally {
    calendarLoading.value = false
  }
}

// Fetch both dashboard and calendar data together using useAsyncData
const { data: combinedData, error } = await useAsyncData<DashboardAndCalendarData>(
  'dashboard-and-calendar',
  async () => {
    const [dashboardRes, _] = await Promise.all([
      $fetch<DashboardResponse>('/api/dashboard'),
      fetchCalendarData()
    ])

    return {
      dashboard: dashboardRes.data,
      calendar: calendarData.value
    }
  },
  {
    default: () => ({
      dashboard: {
        todayProgress: { completed: 0, total: 0 },
        activeStreak: 0,
        totalHabits: 0,
        weeklyRate: 0,
        categories: [],
        todayHabits: [],
        missedHabits: []
      },
      calendar: {
        completed: [],
        partial: [],
        missed: []
      }
    })
  }
)

const dashboardData = computed(() => combinedData.value?.dashboard)


const todayHabits = computed(() => dashboardData.value?.todayHabits ?? [])
const missedHabits = computed(() => dashboardData.value?.missedHabits ?? [])

// Filter today's habits based on search, status, and category
const filteredTodayHabits = computed(() => {
  let filtered = [...todayHabits.value]

  // Filter by search query (name)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(habit =>
      habit.name?.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(habit => habit.status === statusFilter.value)
  }

  // Filter by category
  if (categoryFilter.value) {
    filtered = filtered.filter(habit => {
      const category = (habit as any).category as { id?: string; name?: string } | undefined
      return category?.id === categoryFilter.value
    })
  }

  return filtered
})



const recentActivities = [
  {
    id: "1",
    habit: "Morning Exercise",
    value: "15 minutes",
    timestamp: "2 hours ago",
    icon: "🏃",
  },
  {
    id: "2",
    habit: "Meditation",
    value: "3 minutes",
    timestamp: "3 hours ago",
    icon: "🧘",
  },
  {
    id: "3",
    habit: "Water Intake",
    value: "4 glasses",
    timestamp: "5 hours ago",
    icon: "💧",
  },
]

const milestones = [
  {
    id: "1",
    habit: "Meditation",
    icon: "🧘",
    nextMilestone: "30-day streak",
    progress: 83,
    daysRemaining: 5,
  },
  {
    id: "2",
    habit: "Running",
    icon: "🏃",
    nextMilestone: "100 sessions",
    progress: 65,
    daysRemaining: 35,
  },
]
</script>

<style scoped></style>