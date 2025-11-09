<template>
  <Card :class="`relative ${habit.status === 'inactive' ? 'opacity-60' : ''}`">
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          <Checkbox :model-value="value" @update:model-value="handleSelectHabit" />
          <div class="text-3xl">{{ habit.icon }}</div>
          <div>
            <CardTitle class="text-lg flex items-center gap-2">
              {{ habit.name }}
              <IconCheckCircle2 v-if="habit.completedToday" class="h-4 w-4 text-success" />
            </CardTitle>
            <Badge variant="secondary" class="mt-1">{{ habit.category }}</Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <IconMoreVertical class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="handleMarkComplete">
              Add Log / Session
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleEdit">
              <IconEdit class="h-4 w-4 mr-2" />
              Edit Habit
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleToggleStatus">
              <template v-if="habit.status === 'active'">
                <IconPause class="h-4 w-4 mr-2" />
                Pause Habit
              </template>
              <template v-else>
                <IconPlay class="h-4 w-4 mr-2" />
                Activate Habit
              </template>
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleDeleteHabit" class="text-destructive">
              <IconTrash2 class="h-4 w-4 mr-2" />
              Delete Habit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-2 text-muted-foreground">
          <IconFlame class="h-4 w-4 text-primary" />
          <span class="font-medium">{{ habit.streak }} day streak</span>
        </div>
        <IconGift v-if="habit.hasMilestone" class="h-4 w-4 text-warning" />
      </div>

      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Progress</span>
          <span class="font-medium">{{ habit.progress }}%</span>
        </div>
        <Progress :value="habit.progress" class="h-2" />
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">Recurrence</span>
          <span class="font-medium">{{ habit.recurrence }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground flex items-center gap-1">
            <IconClock class="h-3 w-3" />
            Next Due
          </span>
          <span class="font-medium">{{ habit.nextDue }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground flex items-center gap-1">
            <IconTarget class="h-3 w-3" />
            Goal Progress
          </span>
          <span class="font-medium">{{ habit.goalProgress.current }} / {{ habit.goalProgress.target }}</span>
        </div>
      </div>

      <Button v-if="!habit.completedToday && habit.status === 'active'" @click="handleMarkComplete"
        class="w-full" size="sm">
        Mark as Complete
      </Button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
// import { toast } from 'vue-sonner'

type Habit = {
  id: string
  icon: string
  name: string
  category: string
  recurrence: string
  status: "active" | "inactive" | "completed"
  streak: number
  progress: number
  goalProgress: { current: number; target: number }
  nextDue: string
  hasMilestone: boolean
  completedToday: boolean
}
// Props
const props = defineProps<{ habit: Habit, selectedHabits: string[] }>()

const emit = defineEmits<{
  (e: 'selectHabit'): void
  (e: 'markComplete'): void
  (e: 'toggleStatus'): void
  (e: 'deleteHabit'): void
  (e: 'edit'): void
}>()


// Methods
const handleSelectHabit = () => {
  emit('selectHabit')
}

const handleMarkComplete = () => {
  emit('markComplete')
}
const handleEdit = () => {
  emit('edit')
}

const handleToggleStatus = () => {
  emit('toggleStatus')
}

const handleDeleteHabit = () => {
  emit('deleteHabit')
}


</script>
