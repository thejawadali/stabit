<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" class="h-8 w-8">
        <IconMoreVertical class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuItem v-for="option in filteredDropdownOptions" :key="option.id" @click="handleAction(option.action)">
        <component :is="option.icon" class="w-4 h-4 mr-2" />
        {{ option.label }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { IconPlus, IconBarChart3, IconEdit, IconPause, IconPlay, IconTrash2 } from '#components'

const props = defineProps<{
  habit: HabitWithCategory,
  isArchived: boolean,
  isTaskCompleted: boolean,
}>()

const emit = defineEmits<{
  (e: 'handleAction', action: string): void
}>()

const handleAction = (action: string) => {
  emit('handleAction', action)
}

const dropdownOptions = computed(() => [
  {
    id: 1,
    label: 'View Details',
    icon: IconBarChart3,
    action: 'viewDetails',
    disabled: false
  },
  {
    id: 2,
    label: 'Record Progress',
    icon: IconPlus,
    action: 'recordLog',
    disabled: props.isArchived || props.isTaskCompleted
  },
  {
    id: 3,
    label: 'Edit Habit',
    icon: IconEdit,
    action: 'edit',
    disabled: false
  },
  {
    id: 4,
    label: props.habit.isArchived ? 'Activate Habit' : 'Archive Habit',
    icon: props.habit.isArchived ? IconPlay : IconPause,
    action: 'toggleStatus',
    disabled: false
  },
  {
    id: 5,
    label: 'Delete Habit',
    icon: IconTrash2,
    action: 'delete',
    disabled: false
  },
])

const filteredDropdownOptions = computed(() => dropdownOptions.value.filter(option => !option.disabled))
</script>

<style scoped></style>