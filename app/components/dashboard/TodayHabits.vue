<template>
  <Card>
    <CardContent class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Today's Habits</h3>
        <Badge variant="secondary">
          {{ doneCount }}/{{ habits.length }} Done
        </Badge>
      </div>

      <!-- Habits List -->
      <div class="space-y-3">
        <div v-for="habit in habits" :key="habit.id"
          class="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
          <div class="flex items-center space-x-3 flex-1">
            <template v-if="habit.status === 'done'">
              <CheckCircle2 class="w-5 h-5 text-success" />
            </template>
            <template v-else>
              <Circle class="w-5 h-5 text-muted-foreground" />
            </template>
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="text-lg">{{ habit.icon }}</span>
                <span :class="{ 'line-through text-muted-foreground': habit.status === 'done' }" class="font-medium">
                  {{ habit.name }}
                </span>
              </div>
              <div class="flex items-center space-x-2 mt-1">
                <Clock class="w-3 h-3 text-muted-foreground" />
                <span class="text-xs text-muted-foreground">{{ habit.time }}</span>
                <Badge variant="outline" class="text-xs">{{ habit.category }}</Badge>
              </div>
            </div>
          </div>

          <Button :size="'sm'" :variant="habit.status === 'done' ? 'ghost' : 'default'">
            {{ habit.status === 'done' ? 'View' : 'Log' }}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  habits: Habit[]
}>(), {
  habits: () => [],
})

const doneCount = computed(() => {
  return props.habits.filter(habit => habit.status === 'done').length;
})
</script>

<style scoped></style>