<template>
  <Card class="bg-gradient-card shadow-card">
    <CardHeader>
      <CardTitle class="text-lg font-semibold text-foreground flex items-center gap-2">
        <IconFlame class="h-5 w-5 text-warning" />
        Streaks & Consistency
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-5">
        <div v-for="(habit, index) in habitStreaks" :key="index" class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-foreground">{{ habit.name }}</p>
            <div class="flex items-center gap-4 text-xs text-muted-foreground">
              <span class="flex items-center gap-1">
                <IconFlame class="h-3 w-3 text-warning" />
                {{ habit.current }} days
              </span>
              <span class="flex items-center gap-1">
                <IconTrendingUp class="h-3 w-3 text-success" />
                Best: {{ habit.longest }}
              </span>
            </div>
          </div>
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Consistency</span>
              <span class="font-medium text-foreground">{{ habit.consistency }}%</span>
            </div>
            <Progress :model-value="habit.consistency" class="h-2" />
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-border">
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-3 rounded-lg bg-muted/30">
            <p class="text-2xl font-bold text-primary">23</p>
            <p class="text-xs text-muted-foreground mt-1">Longest Streak</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-muted/30">
            <p class="text-2xl font-bold text-success">77%</p>
            <p class="text-xs text-muted-foreground mt-1">Avg. Consistency</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const habitStreaks = [
  { name: "Morning Meditation", current: 23, longest: 45, consistency: 87 },
  { name: "Exercise", current: 12, longest: 30, consistency: 72 },
  { name: "Reading", current: 18, longest: 28, consistency: 81 },
  { name: "Journaling", current: 8, longest: 15, consistency: 68 },
]
</script>

<style scoped></style>