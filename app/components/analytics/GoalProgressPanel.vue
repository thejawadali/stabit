<template>
  <Card class="bg-gradient-card shadow-card">
    <CardHeader>
      <CardTitle class="text-lg font-semibold text-foreground flex items-center gap-2">
        <IconTarget class="h-5 w-5 text-primary" />
        Goal Progress
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-5">
        <div v-for="(goal, index) in goals" :key="index" class="space-y-3 p-3 rounded-lg bg-muted/20 border border-border">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-foreground">{{ goal.habit }}</p>
            <span class="text-xs text-muted-foreground">
              {{ goal.current }}/{{ goal.target }} sessions
            </span>
          </div>

          <Progress :model-value="goal.progress" class="h-2.5" />

          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <span class="flex items-center gap-1">
              <IconTrendingUp class="h-3 w-3" />
              {{ goal.remaining }} remaining
            </span>
            <span class="flex items-center gap-1">
              <IconCalendar class="h-3 w-3" />
              Est: {{ goal.estimatedDate }}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const goals = [
  {
    habit: "Morning Meditation",
    current: 28,
    target: 30,
    remaining: 2,
    estimatedDate: "Jan 15, 2025",
    progress: 93,
  },
  {
    habit: "Exercise",
    current: 40,
    target: 60,
    remaining: 20,
    estimatedDate: "Feb 5, 2025",
    progress: 67,
  },
  {
    habit: "Reading",
    current: 15,
    target: 25,
    remaining: 10,
    estimatedDate: "Jan 25, 2025",
    progress: 60,
  },
  {
    habit: "Journaling",
    current: 12,
    target: 20,
    remaining: 8,
    estimatedDate: "Jan 20, 2025",
    progress: 60,
  },
]
</script>

<style scoped></style>