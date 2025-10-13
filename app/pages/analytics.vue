<template>
  <main class="flex-1 p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Analytics</h1>
        <p class="text-muted-foreground">Comprehensive insights into your habit performance</p>
      </div>

      <!-- Filters -->
      <AnalyticsFilterControls />

      <!-- Global Overview Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card v-for="(stat, index) in stats" :key="index" class="bg-gradient-card shadow-card">
          <CardContent class="p-4">
            <div class="flex items-center justify-between mb-3">
              <component :is="stat.icon" :class="`h-7 w-7 ${stat.color}`" />
              <TrendingUp v-if="stat.trend === 'up'" class="h-4 w-4 text-success" />
              <TrendingDown v-else class="h-4 w-4 text-destructive" />
            </div>
            <h3 class="text-xs font-medium text-muted-foreground mb-1">
              {{ stat.title }}
            </h3>
            <p class="text-2xl font-bold text-foreground mb-1">
              {{ stat.value }}
            </p>
            <p :class="`text-xs ${stat.trend === 'up' ? 'text-success' : 'text-muted-foreground'}`">
              {{ stat.change }}
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Performance Charts -->
      <div className="grid grid-cols-1lg: grid-cols-2 gap-6">
        <ClientOnly>
          <AnalyticsWeeklyPerformanceChart :weeklyData />
          <AnalyticsMonthlyTrendChart />
        </ClientOnly>
      </div>


      <!-- Habit Comparison -->
      <ClientOnly>
        <AnalyticsHabitComparisonChart />
      </ClientOnly>


       <!-- Streaks & Goals -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsStreaksPanel />
        <AnalyticsGoalProgressPanel />
      </div>
      <!-- 
      



      {/* Category & Calendar */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdown />
        <CalendarSummary />
      </div> -->
    </div>
  </main>
</template>

<script setup lang="ts">
import { IconTarget, IconActivity, IconZap, IconAward, IconTrendingUp } from "#components"

const stats = [
  {
    title: "Total Habits",
    value: "12",
    change: "+2 this month",
    trend: "up",
    icon: IconTarget,
    color: "text-primary"
  },
  {
    title: "Active Habits",
    value: "10",
    change: "2 completed",
    trend: "up",
    icon: IconActivity,
    color: "text-success"
  },
  {
    title: "Total Sessions",
    value: "156",
    change: "+18 this week",
    trend: "up",
    icon: IconZap,
    color: "text-warning"
  },
  {
    title: "Completion Rate",
    value: "87%",
    change: "+5% vs last week",
    trend: "up",
    icon: IconAward,
    color: "text-accent"
  },
  {
    title: "Longest Streak",
    value: "23 days",
    change: "Best: 45 days",
    trend: "up",
    icon: IconTrendingUp,
    color: "text-primary"
  },
]

const weeklyData = [
  { day: "Mon", completed: 8 },
  { day: "Tue", completed: 7 },
  { day: "Wed", completed: 9 },
  { day: "Thu", completed: 6 },
  { day: "Fri", completed: 10 },
  { day: "Sat", completed: 8 },
  { day: "Sun", completed: 5 },
]
</script>

<style scoped></style>