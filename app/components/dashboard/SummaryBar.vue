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
          <IconBell class="w-4 h-4 text-warning" />
          <span class="text-sm text-muted-foreground">Next Reminder</span>
        </div>
        <div class="text-lg font-bold">{{ nextReminder }}</div>
        <p class="text-xs text-muted-foreground mt-1">Meditation session</p>
      </CardContent>
    </Card>

    <Card class="bg-gradient-card border-dashed border-2 hover:bg-accent/50 cursor-pointer transition-colors hover:text-gray-300"
      @click="emit('addHabit')">
      <CardContent class="p-4 flex flex-col items-center justify-center h-full">
        <IconPlus class="w-5 h-5 mb-1" />
        <span class="text-sm font-medium">Add Habit</span>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">

interface Props {
  completedToday: number
  totalToday: number
  currentStreak: number
  nextReminder: string
}

withDefaults(defineProps<Props>(), {
  completedToday: 0,
  totalToday: 0,
  currentStreak: 0,
  nextReminder: '',
})



const emit = defineEmits<{
  (e: 'addHabit'): void
}>();


</script>

<style scoped></style>