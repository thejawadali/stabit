<template>
  <main class="flex-1 p-4 sm:p-6 lg:p-8 pt-24 pb-12 max-w-7xl mx-auto w-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-foreground mb-2">Dashboard 👋</h1>
      <p class="text-muted-foreground">Track your habits and achieve your goals</p>
    </div>
    <div class="space-y-6">
      <!-- Summary Bar -->
      <SummaryBar 
        :completed-today="dashboardData?.todayProgress.completed ?? 0" 
        :total-today="dashboardData?.todayProgress.total ?? 0" 
        :current-streak="dashboardData?.activeStreak ?? 0" 
        :total-habits="dashboardData?.totalHabits ?? 0" 
        :weekly-completion="dashboardData?.weeklyRate ?? 0" 
      />


      <!-- Filters -->
      <Filters :active-filter="'all'" :categories="dashboardData?.categories" />
      <!-- Quick Actions -->
      <!-- <QuickActions @add-habit="undefined" @add-quick-log="undefined" /> -->

      <!-- Main Content Grid -->
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Left Column - 2/3 width -->
        <div className="lg:col-span-2 space-y-6">
          <!-- Today's Habits -->
          <TodayHabits :habits="todayHabits" />

          <!-- Habit Cards List
          <div>
            <h3 className="text-lg font-semibold mb-4">All Habits</h3>
            <HabitListView :habits="habitsList" @on-edit="undefined" @on-delete="undefined"
              @on-view-history="undefined" />
          </div>
           -->

          <!-- Missed Habits -->
          <MissedHabits :habits="missedHabits" />

          <!-- Recent Activity -->
          <RecentActivity :activities="recentActivities" />
        </div>

        <!-- Right Column - 1/3 width -->
        <div className="space-y-6">
          <!-- Calendar Widget -->
          <Card class="bg-gradient-card shadow-card">
            <CardHeader class="pb-1" />
            <CardContent>
              <CalendarWidget />
            </CardContent>
          </Card>

          <!-- Progress Snapshot -->
          <ProgressSnapshot 
            :weekly-completion="dashboardData?.weeklyRate ?? 0" 
            :monthly-trend="12" 
            :remaining-sessions="15" 
            :total-sessions="247"
            :streak-text="dashboardData?.activeStreak ? `You're on a ${dashboardData.activeStreak}-day streak! 🔥` : 'Start building your streak!'" 
          />

          <!-- Milestones -->
          <MilestonesPanel :milestones="milestones" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">

// Fetch dashboard data
const { data: dashboardResponse, error: dashboardError } = await useFetch<{
  success: boolean
  data: {
    todayProgress: {
      completed: number
      total: number
    }
    activeStreak: number
    totalHabits: number
    weeklyRate: number,
    categories: Partial<Category>[],
    todayHabits: Partial<Habit>[]
  }
}>('/api/dashboard', {
  default: () => ({
    success: true,
    data: {
      todayProgress: { completed: 0, total: 0 },
      activeStreak: 0,
      totalHabits: 0,
      weeklyRate: 0,
      categories: [],
      todayHabits: []
    }
  })
})

const dashboardData = computed(() => dashboardResponse.value?.data)

if (dashboardError.value) {
  console.error('Error fetching dashboard data:', dashboardError.value)
}

// mock data
const todayHabits = computed(() => dashboardData.value?.todayHabits)

const missedHabits = [
  { id: "1", name: "Yoga Session", icon: "🧘", missedDate: "Yesterday" },
]

const habitsList = [
  {
    id: "1",
    icon: "🏃",
    name: "Morning Exercise",
    category: "Health",
    progress: 100,
    streak: 8,
    trend: [10, 15, 12, 18, 14, 20, 16],
  },
  {
    id: "2",
    icon: "🧘",
    name: "Meditation",
    category: "Mindfulness",
    progress: 100,
    streak: 25,
    trend: [12, 14, 16, 15, 18, 20, 19],
  },
  {
    id: "3",
    icon: "📚",
    name: "Daily Reading",
    category: "Learning",
    progress: 80,
    streak: 12,
    trend: [8, 12, 10, 14, 12, 16, 18],
  },
  {
    id: "4",
    icon: "💧",
    name: "Drink Water",
    category: "Health",
    progress: 50,
    streak: 15,
    trend: [10, 12, 11, 13, 12, 14, 13],
  },
  {
    id: "5",
    icon: "📝",
    name: "Journal Writing",
    category: "Reflection",
    progress: 0,
    streak: 5,
    trend: [6, 8, 10, 9, 11, 10, 12],
  },
]

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