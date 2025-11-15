<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-lg">Progress Snapshot</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <!-- Weekly Completion -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center space-x-2">
              <IconTrendingUp class="w-4 h-4 text-success" />
              <span class="text-muted-foreground">Weekly Completion</span>
            </div>
            <span class="font-bold">{{ weeklyCompletion }}%</span>
          </div>
          <Progress :value="weeklyCompletion" class="h-2" />
        </div>

        <!-- Monthly Trend -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center space-x-2">
              <IconTarget class="w-4 h-4 text-primary" />
              <span class="text-muted-foreground">Monthly Trend</span>
            </div>
            <span class="font-bold text-success">{{ monthlyTrendText }}</span>
          </div>
          <Progress :value="monthlyTrend" class="h-2" />
        </div>

        <!-- Sessions Info -->
        <div class="pt-4 border-t space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Total Sessions</span>
            <span class="font-bold">{{ totalSessions }}</span>
          </div>
        </div>

        <!-- Streak Info -->
        <div class="pt-4 border-t">
          <div class="flex items-center space-x-2 p-3 rounded-lg bg-primary/10">
            <IconFlame class="w-5 h-5 text-primary" />
            <p class="text-sm font-medium">
              {{ streakText }}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  weeklyCompletion: number
  monthlyTrend: number
  totalSessions: number
  activeStreakCount: number
}>(), {
  weeklyCompletion: 0,
  monthlyTrend: 0,
  totalSessions: 0,
  activeStreakCount: 0,
})

const streakText = computed(() => {
  return props.activeStreakCount > 0 ? `You're on a ${props.activeStreakCount}-day streak! 🔥` : 'Start building your streak!'
})

const monthlyTrendText = computed(() => {
  return props.monthlyTrend > 0 ? `+${Math.floor(props.monthlyTrend)}%` : '0%'
})
</script>

<style scoped></style>