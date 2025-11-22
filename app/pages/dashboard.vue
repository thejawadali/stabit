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
      <Filters v-model:search="searchQuery" v-model:category="categoryFilter"
        :categories="dashboardData?.categories ?? []" />

      <!-- Main Content Grid -->
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Left Column - 2/3 width -->
        <div className="lg:col-span-2 space-y-6">
          <!-- Today's Habits -->
          <TodayHabits :habits="filteredTodayHabits" @refresh="handleRefresh" />


          <!-- Missed Habits -->
          <MissedHabits :missedHabitLogs="missedHabits" />
          <!-- Recent Activity -->
          <RecentActivity :activities="recentLogsData?.logs ?? []"
            :has-more="recentLogsData?.pagination?.hasMore ?? false" :loading="recentLogsLoading"
            @load-more="loadRecentLogs" />
        </div>

        <!-- Right Column - 1/3 width -->
        <div className="space-y-6">
          <!-- Calendar Widget -->
          <Card class="bg-gradient-card shadow-card" v-loading="calendarLoading">
            <CardHeader class="pb-1" />
            <CardContent>
              <CalendarWidget :completed-days="calendarData.completed" :partially-completed="calendarData.partial"
                :missed-days="calendarData.missed" v-model:currentDate="calendarDate" />
            </CardContent>
          </Card>

          <!-- Progress Snapshot -->
          <ProgressSnapshot :weekly-completion="dashboardData.weeklyCompletionPercentage"
            :monthly-trend="dashboardData.monthlyTrend" :total-sessions="dashboardData.totalSessions"
            :active-streak-count="dashboardData.activeStreak" />

          <!-- Milestones -->
          <MilestonesPanel :milestones="dashboardData.milestones" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// Types for API responses
type DashboardData = {
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
  monthlyTrend: number
  totalSessions: number
  weeklyCompletionPercentage: number
  milestones: DashboardMilestone[]
}

type CalendarData = {
  completed: number[]
  partial: number[]
  missed: number[]
}

type RecentLogsData = {
  logs: RecentLog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}


// Calendar state
const calendarDate = ref<Date>(new Date())



// Filter state
const searchQuery = ref('')
const categoryFilter = ref<string | null>(null)


// Fetch dashboard data
const { data: dashboardData, refresh: refreshDashboard } = await useFetch<DashboardData>('/api/dashboard', {
  transform: (data: any) => data.data,
  default: () => ({
    todayProgress: { completed: 0, total: 0 },
    activeStreak: 0,
    totalHabits: 0,
    weeklyRate: 0,
    categories: [],
    todayHabits: [],
    missedHabits: [],
    monthlyTrend: 0,
    totalSessions: 0,
    weeklyCompletionPercentage: 0,
    milestones: []
  })
})

// Fetch calendar data
const { data: calendarData, pending: calendarLoading, refresh: refreshCalendar } = await useFetch<CalendarData>('/api/dashboard/calendar', {
  query: computed(() => ({
    month: calendarDate.value.getMonth() + 1,
    year: calendarDate.value.getFullYear()
  })),
  transform: (data: any) => data.data,
  default: () => ({
    completed: [],
    partial: [],
    missed: []
  })
})

const recentLogsData = ref<RecentLogsData>({
  logs: [],
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    hasMore: true
  }
})

const recentLogsLoading = ref(false)


// fetch recent logs
const loadRecentLogs = async (refresh = false) => {
  if (recentLogsLoading.value || !recentLogsData.value.pagination.hasMore) return
  if (refresh) {
    recentLogsData.value.pagination.page = 1 
  }

  recentLogsLoading.value = true
  try {
    const response = await $fetch<{ success: boolean; data: RecentLogsData }>('/api/dashboard/recent-logs', {
      query: {
        page: recentLogsData.value.pagination.page,
        limit: recentLogsData.value.pagination.limit
      }
    })

    const data = response.data

    // Append new logs to existing logs
    recentLogsData.value = {
      logs: [...recentLogsData.value.logs, ...data.logs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), // sort by createdAt descending
      pagination: {
        ...data.pagination,
        page: data.pagination.page + 1
      }
    }
  } catch (error) {
    console.error('Error loading more recent logs:', error)
  } finally {
    recentLogsLoading.value = false
  }
}


loadRecentLogs()

const handleRefresh = () => {
  refreshDashboard()
  refreshCalendar()
  loadRecentLogs(true)
}

const todayHabits = computed(() => dashboardData.value.todayHabits)
const missedHabits = computed(() => dashboardData.value.missedHabits)


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


  // Filter by category
  if (categoryFilter.value) {
    filtered = filtered.filter(habit => {
      const category = (habit as any).category as { id?: string; name?: string } | undefined
      return category?.id === categoryFilter.value
    })
  }

  return filtered
})

// Set page title - dashboard should show just "Stabit" (no page name)
useHead({
  title: 'Stabit',
  titleTemplate: ''
})

</script>