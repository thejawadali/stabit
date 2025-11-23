<template>
  <Card>
    <CardContent class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Today's Tasks</h3>
      </div>

      <!-- Habits List -->
      <div v-if="habits.length > 0" class="space-y-3">
        <div v-for="habit in habits" :key="habit.id"
          class="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
          <div class="flex items-center space-x-3 flex-1">
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="text-lg">{{ habit.icon }}</span>
                <span :class="{ 'line-through text-muted-foreground': isHabitCompleted(habit.id) }" class="font-medium">
                  {{ habit.name }}
                </span>
              </div>
              <div class="flex items-center space-x-2 mt-1">
                <IconClock class="w-3 h-3 text-muted-foreground" />
                <span class="text-xs text-muted-foreground">{{ formatTime(habit.timeOfDay) }}</span>
                <Badge variant="outline" class="text-xs">{{ habit.category.name }}</Badge>
              </div>
            </div>
          </div>

          <Button 
            :size="'sm'" 
            :variant="isHabitCompleted(habit.id) ? 'outline' : 'default'"
            @click="addRecord(habit)"
            :disabled="isHabitCompleted(habit.id)"
          >
            {{ isHabitCompleted(habit.id) ? 'Completed' : 'Complete' }}
          </Button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-12 text-center">
        <div class="w-20 h-20 mx-auto mb-4 bg-accent/50 rounded-full flex items-center justify-center">
          <IconCheckCircle2 class="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-semibold mb-2">No tasks for today</h3>
        <p class="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          You're all caught up! No habits scheduled for today, or try adjusting your filters.
        </p>
      </div>
    </CardContent>
  </Card>
  <HabitLogDialog 
    :habit="selectedHabitToLog" 
    v-model:is-dialog-open="isLogHabitDialogOpen" 
    @refresh="handleRefresh" 
  />
</template>

<script setup lang="ts">
import { formatTime } from '~/lib/utils'

const props = withDefaults(defineProps<{
  habits: TodayHabit[]
}>(), {
  habits: () => [],
})

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const isLogHabitDialogOpen = ref(false)
const selectedHabitToLog = ref<{ id: string, name: string, goalMetric: string, currentTargetValue: number } | null>(null)
const completedHabitIds = ref<Set<string>>(new Set())

const addRecord = (habit: TodayHabit) => {
  if (!habit) return
  selectedHabitToLog.value = { id: habit.id || '', name: habit.name || '', goalMetric: habit.goalMetric || '', currentTargetValue: habit.currentTargetValue || 0 }
  isLogHabitDialogOpen.value = true
}

const handleRefresh = () => {
  emit('refresh')
  if (selectedHabitToLog.value) {
    completedHabitIds.value.add(selectedHabitToLog.value.id)
  }
}

const isHabitCompleted = (habitId: string | undefined) => {
  if (!habitId) return false
  const habit = props.habits.find(h => h.id === habitId)
  return completedHabitIds.value.has(habitId) || (habit as any)?.hasCompletedToday || habit?.isCompleted
}

</script>