<template>
  <main class="flex-1 p-6 lg:p-8">
    <div class="container space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Progress</h1>
        <p class="text-muted-foreground">Track your journey and achievements</p>
      </div>

      <!-- Overall Progress -->
      <Card class="bg-gradient-card shadow-card">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="text-lg font-semibold text-foreground">
              Overall Progress
            </CardTitle>
            <Badge variant="secondary" class="text-sm">
              {{ overallProgress.completed }} / {{ overallProgress.total }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <Progress :model-value="overallProgress.percentage" class="h-3" />
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">
                You're {{ overallProgress.percentage }}% towards your goal
              </span>
              <span class="text-2xl font-bold text-primary">
                {{ overallProgress.percentage }}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Goals Grid -->
      <div>
        <h2 class="text-xl font-semibold text-foreground mb-4">Active Goals</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card v-for="(goal, index) in goals" :key="index" class="bg-gradient-card shadow-card">
            <CardContent class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div :class="`p-2 rounded-lg ${goal.bgColor}`">
                    <component :is="goal.icon" :class="`h-5 w-5 ${goal.color}`" />
                  </div>
                  <div>
                    <h3 class="font-medium text-foreground">{{ goal.name }}</h3>
                    <p class="text-xs text-muted-foreground">
                      {{ goal.current }} of {{ goal.target }}
                    </p>
                  </div>
                </div>
                <!-- percentage -->
                <Badge variant="outline">{{ Math.round((goal.current / goal.target) * 100) }}%</Badge>
              </div>
              <Progress value={percentage} class="h-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Milestones -->
        <Card class="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle class="text-lg font-semibold text-foreground">
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <!-- {milestones.map((milestone, index) => ( -->
              <div v-for="(milestone, index) in milestones" :key="index"
                class="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                <div class="mt-1">
                  <IconCheckCircle2 v-if="milestone.completed" class="h-5 w-5 text-success" />
                  <div v-else class="h-5 w-5 rounded-full border-2 border-muted" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h4
                      :class="`font-medium text-sm ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`">
                      {{ milestone.title }}
                    </h4>
                    <span class="text-xs text-muted-foreground">
                      {{ milestone.date }}
                    </span>
                  </div>
                  <p class="text-xs text-muted-foreground">
                    {{ milestone.description }}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Achievements -->
        <Card class="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle class="text-lg font-semibold text-foreground">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-4">
              <!-- {achievements.map((achievement, index) => ( -->
              <!-- class={`p-4 rounded-lg text-center transition-all ${ achievement.unlocked
                ? "" : ""
                }`} -->
              <div v-for="(achievement, index) in achievements" :key="index"
                :class="`p-4 rounded-lg text-center transition-all ${achievement.unlocked ? 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20' : 'bg-muted/30 opacity-50'}`">
                <div class="flex justify-center mb-2">
                  <div :class="`p-3 rounded-full ${achievement.unlocked ? 'bg-primary/10' : 'bg-muted'}`">
                    <component :is="achievement.icon" :class="`h-6 w-6 ${achievement.unlocked ? achievement.color
                      : 'text-muted-foreground'}`" />
                  </div>
                </div>
                <h4 class="font-medium text-sm text-foreground mb-1">
                  {{ achievement.title }}
                </h4>
                <p class="text-xs text-muted-foreground">
                  {{ achievement.description }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Weekly Progress Trend -->
      <Card class="bg-gradient-card shadow-card">
        <CardHeader>
          <div class="flex items-center space-x-2">
            <IconTrendingUp class="h-5 w-5 text-success" />
            <CardTitle class="text-lg font-semibold text-foreground">
              Weekly Progress Trend
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="(week, index) in weeklyProgress" :key="index" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-foreground">
                  {{ week.week }}
                </span>
                <span class="text-sm font-semibold text-primary">
                  {{ week.percentage }}%
                </span>
              </div>
              <Progress value={week.percentage} class="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { IconTarget, IconZap, IconClock, IconStar, IconTrophy, IconAward } from "#components"

const overallProgress = {
  completed: 156,
  total: 200,
  percentage: 78,
}

const goals = [
  {
    name: "30-Day Meditation Streak",
    current: 23,
    target: 30,
    icon: IconTarget,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    name: "Read 12 Books",
    current: 8,
    target: 12,
    icon: IconAward,
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    name: "100 Workouts",
    current: 67,
    target: 100,
    icon: IconZap,
    color: "text-warning",
    bgColor: "bg-warning/10"
  },
  {
    name: "Daily Journaling",
    current: 45,
    target: 90,
    icon: IconClock,
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
]

const milestones = [
  {
    title: "First Week Complete",
    date: "Jan 8, 2025",
    completed: true,
    description: "Completed 7 days in a row"
  },
  {
    title: "50 Habits Milestone",
    date: "Jan 15, 2025",
    completed: true,
    description: "Reached 50 total completions"
  },
  {
    title: "Perfect Month",
    date: "Feb 1, 2025",
    completed: false,
    description: "Complete all habits for 30 days"
  },
  {
    title: "100 Day Streak",
    date: "Mar 15, 2025",
    completed: false,
    description: "Maintain streak for 100 days"
  },
]

const achievements = [
  {
    title: "Early Bird",
    icon: IconStar,
    description: "Complete morning routine 10 days in a row",
    unlocked: true,
    color: "text-warning"
  },
  {
    title: "Consistency King",
    icon: IconTrophy,
    description: "Maintain 30-day streak",
    unlocked: false,
    color: "text-primary"
  },
  {
    title: "Habit Master",
    icon: IconAward,
    description: "Complete 100 habits",
    unlocked: true,
    color: "text-success"
  },
  {
    title: "Weekend Warrior",
    icon: IconZap,
    description: "Perfect weekend completion rate",
    unlocked: true,
    color: "text-accent"
  },
]

const weeklyProgress = [
  { week: "Week 1", percentage: 65 },
  { week: "Week 2", percentage: 72 },
  { week: "Week 3", percentage: 78 },
  { week: "Week 4", percentage: 85 },
];

// Set page title
useHead({
  title: 'Progress'
})

</script>

<style scoped></style>