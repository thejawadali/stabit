
import { formatSmartDate } from '~/lib/utils'


export const useHabitItem = (habit: HabitWithCategory) => {
  const goalValue = computed(() => habit.goalValue)
  const totalCompletions = computed(() => habit.totalCompletions)

  const progress = computed(() => {
    return goalValue.value > 0 ? Math.round((totalCompletions.value / goalValue.value) * 100) : 0
  })


  const isCompletedToday = computed(() => true) // TODO

  const nextDueDate = computed(() => formatSmartDate(habit.nextDueDate ?? new Date()))

  return {
    progress,
    isCompletedToday,
    nextDueDate,
    totalCompletions,
    goalValue,
  }
}