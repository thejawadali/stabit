<template>
  <Card :key="habit.id" :class="habit.isArchived ? 'opacity-60' : ''">
    <CardContent class="p-4">
      <div class="flex items-center gap-4">
        <div class="text-2xl">{{ habit.icon }}</div>
        <div class="flex-1 grid grid-cols-6 gap-4 items-center">
          <div class="col-span-2">
            <div class="font-semibold flex items-center gap-2">
              {{ habit.name }}
              <IconCheckCircle2 v-if="isTaskCompleted" class="h-4 w-4 text-success" />
            </div>
            <Badge variant="secondary" class="mt-1">{{ habit.category.name }}</Badge>
          </div>
          <div class="flex items-center gap-2">
            <IconFlame class="h-4 w-4 text-primary" />
            <span class="text-sm font-medium">{{ habit.currentStreak }} days</span>
          </div>
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{{ progress }}%</span>
            </div>
            <Progress :model-value="progress" class="h-1.5" />
          </div>
          <div class="text-sm text-center">
            <div class="text-muted-foreground">Goal</div>
            <div class="font-medium">{{ totalCompletions }}/{{ goalValue }}</div>
          </div>
          <div class="flex items-center justify-end gap-1">
            <HabitActionsDropdown :habit @handleAction="handleAction" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const props = defineProps<{ habit: HabitWithCategory }>()

const emit = defineEmits<{
  (e: 'handleAction', action: string): void
}>()


const handleAction = (action: string) => {
  emit('handleAction', action)
}

const { progress, isTaskCompleted, totalCompletions, goalValue } = useHabitItem(props.habit)
</script>
