<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card class="bg-gradient-card">
      <CardContent class="p-4">
        <div class="flex items-center space-x-2 mb-2">
          <IconCheckCircle2 class="w-4 h-4 text-success" />
          <span class="text-sm text-muted-foreground">Today's Progress</span>
        </div>
        <div class="text-2xl font-bold">{{ completedToday }}/{{ totalToday }}</div>
        <p class="text-xs text-muted-foreground mt-1">
          {{ Math.round((completedToday / totalToday) * 100) }}% completed
        </p>
      </CardContent>
    </Card>

    <Card class="bg-gradient-card">
      <CardContent class="p-4">
        <div class="flex items-center space-x-2 mb-2">
          <IconFlame class="w-4 h-4 text-primary" />
          <span class="text-sm text-muted-foreground">Active Streak</span>
        </div>
        <div class="text-2xl font-bold">{{ currentStreak }} days</div>
        <p class="text-xs text-success mt-1">Keep it going! 🔥</p>
      </CardContent>
    </Card>

    <Card class="bg-gradient-card">
        <CardContent class="p-4">
          <div class="flex items-center space-x-2 mb-2">
            <IconTarget class="w-4 h-4 text-primary" />
            <span class="text-sm text-muted-foreground">Total Habits</span>
          </div>
          <div class="text-2xl font-bold">{{totalHabits}}</div>
          <p class="text-xs text-muted-foreground mt-1">Active tracking</p>
        </CardContent>
      </Card>

      <Card class="bg-gradient-card">
        <CardContent class="p-4">
          <div class="flex items-center space-x-2 mb-2">
            <IconTrendingUp class="w-4 h-4 text-accent" />
            <span class="text-sm text-muted-foreground">Weekly Rate</span>
          </div>
          <div class="text-2xl font-bold">{{weeklyCompletion}}%</div>
          <p class="text-xs text-success mt-1">Great progress! 📈</p>
        </CardContent>
      </Card>
  </div>
</template>

<script setup lang="ts">

interface Props {
  completedToday: number;
  totalToday: number;
  currentStreak: number;
  totalHabits: number;
  weeklyCompletion: number;
}

withDefaults(defineProps<Props>(), {
  completedToday: 0, 
  totalToday: 0, 
  currentStreak: 0,
  totalHabits: 0,
  weeklyCompletion: 0
})



const emit = defineEmits<{
  (e: 'addHabit'): void
}>();


</script>

<style scoped></style>