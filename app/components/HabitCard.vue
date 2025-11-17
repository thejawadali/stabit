<template>
  <Card :class="`relative ${habit.isArchived ? 'opacity-60' : ''}`">
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-3">
          <div class="text-3xl">{{ habit.icon }}</div>
          <div>
            <CardTitle class="text-lg flex items-center gap-2">
              {{ habit.name }}
              <IconCheckCircle2 v-if="isCompletedToday" class="h-4 w-4 text-success" />
            </CardTitle>
            <Badge variant="secondary" class="mt-1">{{ habit.category.name }}</Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <IconMoreVertical class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem v-for="option in dropdownOptions" :key="option.id" @click="handleAction(option.action)">
              <component :is="option.icon" class="w-4 h-4 mr-2" />
              {{ option.label }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="flex items-center justify-between text-sm"
        :class="`${habit.currentStreak > 0 ? 'opacity-100' : 'opacity-0'}`">
        <div class="flex items-center gap-2 text-muted-foreground">
          <IconFlame class="h-4 w-4 text-primary" />
          <span class="font-medium">{{ habit.currentStreak }} day streak</span>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Progress</span>
          <span class="font-medium">{{ progress }}%</span>
        </div>
        <Progress :model-value="progress" class="h-2" />
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">Frequency</span>
          <span class="font-medium capitalize">{{ habit.frequency }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground flex items-center gap-1">
            <IconClock class="h-3 w-3" />
            Next Due
          </span>
          <span class="font-medium">{{ nextDueDate }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground flex items-center gap-1">
            <IconTarget class="h-3 w-3" />
            Goal Progress
          </span>
          <span class="font-medium">{{ totalCompletions }} / {{ goalValue }}</span>
        </div>
      </div>

      <Button v-if="!isCompletedToday && !habit.isArchived" @click="handleAction('recordLog')" class="w-full"
        size="sm">
        Mark as Complete
      </Button>
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

const { dropdownOptions, progress, isCompletedToday, nextDueDate, totalCompletions, goalValue } = useHabitItem(props.habit)
</script>
