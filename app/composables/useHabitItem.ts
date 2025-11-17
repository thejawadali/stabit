import { IconPlus, IconBarChart3, IconEdit, IconPause, IconPlay, IconTrash2 } from '#components'
import { formatSmartDate } from '~/lib/utils'


export const useHabitItem = (habit: HabitWithCategory) => {

  const dropdownOptions = computed(() => [
    {
      id: 1,
      label: 'View Details',
      icon: IconBarChart3,
      action: 'viewDetails'
    },
    {
      id: 2,
      label: 'Record Progress',
      icon: IconPlus,
      action: 'recordLog'
    },
    {
      id: 3,
      label: 'Edit Habit',
      icon: IconEdit,
      action: 'edit'
    },
    {
      id: 4,
      label: habit.isArchived ? 'Activate Habit' : 'Archive Habit',
      icon: habit.isArchived ? IconPlay : IconPause,
      action: 'toggleStatus'
    },
    {
      id: 5,
      label: 'Delete Habit',
      icon: IconTrash2,
      action: 'delete'
    },
  ])



  const goalValue = computed(() => habit.goalValue)
  const totalCompletions = computed(() => habit.totalCompletions)

  const progress = computed(() => {
    return goalValue.value > 0 ? Math.round((totalCompletions.value / goalValue.value) * 100) : 0
  })


  const isCompletedToday = computed(() => true) // TODO

  const nextDueDate = computed(() => formatSmartDate(habit.nextDueDate ?? new Date()))

  return {
    dropdownOptions,
    progress,
    isCompletedToday,
    nextDueDate,
    totalCompletions,
    goalValue,
  }
}