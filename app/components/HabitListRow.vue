<template>
  <Card :key="habit.id" :class="habit.status === 'inactive' ? 'opacity-60' : ''">
    <CardContent class="p-4">
      <div class="flex items-center gap-4">
        <Checkbox :model-value="value" @update:model-value="handleSelectHabit" />
        <div class="text-2xl">{{ habit.icon }}</div>
        <div class="flex-1 grid grid-cols-6 gap-4 items-center">
          <div class="col-span-2">
            <div class="font-semibold flex items-center gap-2">
              {{ habit.name }}
              <IconCheckCircle2 v-if="habit.completedToday" class="h-4 w-4 text-success" />
            </div>
            <Badge variant="secondary" class="mt-1">{{ habit.category }}</Badge>
          </div>
          <div class="flex items-center gap-2">
            <IconFlame class="h-4 w-4 text-primary" />
            <span class="text-sm font-medium">{{ habit.streak }} days</span>
          </div>
          <div class="space-y-1">
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{{ habit.progress }}%</span>
            </div>
            <Progress :value="habit.progress" class="h-1.5" />
          </div>
          <div class="text-sm text-center">
            <div class="text-muted-foreground">Goal</div>
            <div class="font-medium">{{ habit.goalProgress.current }}/{{ habit.goalProgress.target }}</div>
          </div>
          <div class="flex items-center justify-end gap-1">
            <IconGift v-if="habit.hasMilestone" class="h-4 w-4 text-warning" />
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
        </div>
      </div>
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
  // Handle select habit logic
  emit('selectHabit')
}

const handleMarkComplete = () => {
  // Handle mark complete logic
  emit('markComplete')
}

const handleToggleStatus = () => {
  // Handle toggle status logic
  emit('toggleStatus')
}

const handleDeleteHabit = () => {
  // Handle delete habit logic
  emit('deleteHabit')
}

const handleEdit = () => {
  emit('edit')
}

</script>
