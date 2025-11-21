import dayjs from 'dayjs'
import { formatSmartDate } from '~/lib/utils'


export const useHabitItem = ({ habit, refresh }: { habit: HabitWithCategory, refresh: () => void }) => {

  const { toast } = useToast()
  const { confirm } = useConfirm()
  const router = useRouter()

  const loading = ref(false)

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



  // actions
  const toggleStatus = async () => {
    try {
      loading.value = true
      const archivedStatus = !habit.isArchived
      await $fetch(`/api/habits/${habit.id}/toggle-status`, {
        method: 'POST'
      })
      refresh()
      loading.value = false
      toast({
        title: 'Status changed',
        description: `The habit has been ${archivedStatus ? 'archived' : 'activated'} successfully.`,
      })
    } catch (error) {
      console.error('Error changing status:', error)
      toast({
        title: 'Error',
        description: 'Failed to change status. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const editHabit = async () => {
    router.push(`/habits/${habit.id}`)
  }

  const viewDetails = async () => {
    router.push(`/habits/detail/${habit.id}`)
  }

  const deleteHabit = async () => {
    const confirmed = await confirm({
      title: 'Delete Habit?',
      description: 'This action cannot be undone. This will permanently delete the habit and all its data.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    })
    if (!confirmed) return
    try {
      loading.value = true
      await $fetch(`/api/habits/${habit.id}`, {
        method: 'DELETE'
      })

      refresh()
      loading.value = false
      toast({
        title: 'Habit deleted',
        description: 'The habit has been deleted successfully.',
      })
    } catch (error: any) {
      console.error('Error deleting habit:', error)
      const errorMessage = error?.data?.message || error?.message || 'Failed to delete habit. Please try again.'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return {
    progress,
    showLogButton,
    isTaskCompleted,
    formattedNextDueDate,
    totalCompletions,
    goalValue,
    loading,

    // actions
    toggleStatus,
    editHabit,
    viewDetails,
    deleteHabit,
  }
}