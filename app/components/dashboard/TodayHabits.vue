<template>
  <Card>
    <CardContent class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Today's Tasks</h3>
        <Badge variant="secondary">
          {{ doneCount }}/{{ habits.length }} Done
        </Badge>
      </div>

      <!-- Habits List -->
      <div v-if="habits.length > 0" class="space-y-3">
        <div v-for="habit in habits" :key="habit.id"
          class="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
          <div class="flex items-center space-x-3 flex-1">
            <template v-if="habit.status === 'completed'">
              <IconCheckCircle2 class="w-5 h-5 text-success" />
            </template>
            <template v-else>
              <IconCircle class="w-5 h-5 text-muted-foreground" />
            </template>
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="text-lg">{{ habit.icon }}</span>
                <span :class="{ 'line-through text-muted-foreground': habit.status === 'completed' }" class="font-medium">
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

          <!-- <Button :size="'sm'" :variant="habit.status === 'done' ? 'ghost' : 'default'">
            {{ habit.status === 'done' ? 'View' : 'Log' }}
          </Button> -->
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
</template>

<script setup lang="ts">
import { formatTime } from '~/lib/utils'

const props = withDefaults(defineProps<{
  habits: TodayHabit[]
}>(), {
  habits: () => [],
})

const doneCount = computed(() => {
  return props.habits.filter(habit => habit.status === 'completed').length;
})
</script>

<style scoped></style>