import dayjs from 'dayjs'
import { formatSmartDate } from '~/lib/utils'


export const useHabitItem = (habit: HabitWithCategory) => {
  const goalValue = computed(() => habit.goalValue)
  const totalCompletions = computed(() => habit.totalCompletions)

  const progress = computed(() => {
    return goalValue.value > 0 ? Math.round((totalCompletions.value / goalValue.value) * 100) : 0
  })

  const isTaskCompleted = computed(() => {
    const log = habit.mostRecentLog

    // either no log or the log's status is not completed, means the task is not completed
    if (!log || log.completionStatus !== 'completed') {
      return false
    }

    const now = dayjs()
    const logDate = dayjs(log.createdAt)

    // Check if log is for the current period based on frequency
    switch (habit.frequency) {
      case 'daily':
        return logDate.isSame(now, 'day')
      case 'weekly':
        return logDate.isSame(now, 'week')
      case 'monthly':
        return logDate.isSame(now, 'month')
      default:
        return false
    }
  })

  const showLogButton = computed(() => !isTaskCompleted.value && (habit.nextDueDate && dayjs(habit.nextDueDate).isSame(dayjs(), 'day')))

  const formattedNextDueDate = computed(() => formatSmartDate(habit.nextDueDate ?? new Date()))

  return {
    progress,
    showLogButton,
    isTaskCompleted,
    formattedNextDueDate,
    totalCompletions,
    goalValue,
  }
}