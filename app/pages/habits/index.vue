<template>
  <div>
    <main class="flex-1 p-4 sm:p-6 lg:p-8 pt-24 pb-12 mx-auto w-full">
      <!-- Header -->
      <div class="mb-6 flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">My Habits</h1>
          <p class="text-muted-foreground">Manage and track all your habits</p>
        </div>
        <Button @click="navigateToCreateHabit">
          <IconPlus class="w-4 h-4 mr-2" />
          Create Habit
        </Button>
      </div>

      <!-- Stats -->
      <HabitStatCards :total-habits="stats.totalHabits" :active-habits="stats.activeHabits"
        :completed-today="stats.completedToday" :avg-progress="stats.avgProgress" />


      <div class="space-y-4 mb-6">
        <div class="flex flex-wrap gap-3">
          <div class="relative flex-1 min-w-[200px]">
            <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search habits..." v-model="searchQuery" class="pl-10" />
          </div>

          <!-- Filters -->
          <Select v-model="categoryFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.name }}
              </SelectItem>
            </SelectContent>
          </Select>


          <Select v-model="frequencyFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frequency</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="dueDateFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Due Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
            </SelectContent>
          </Select>

          <!-- view mode buttons -->
          <div class="flex gap-2 ml-auto">
            <Button :variant="viewMode === 'grid' ? 'default' : 'outline'" size="icon" @click="viewMode = 'grid'">
              <IconLayoutGrid class="h-4 w-4" />
            </Button>
            <Button :variant="viewMode === 'list' ? 'default' : 'outline'" size="icon" @click="viewMode = 'list'">
              <IconList class="h-4 w-4" />
            </Button>
          </div>
        </div>


        <!-- habits empty state -->
        <Card v-if="filteredHabits.length === 0">
          <CardContent class="p-12 text-center">
            <IconTarget class="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 class="text-lg font-semibold mb-2">No habits found</h3>
            <p class="text-muted-foreground mb-4">Try adjusting your filters or create a new habit</p>
            <Button @click="navigateToCreateHabit">
              <IconPlus class="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </CardContent>
        </Card>

        <!-- habits listing -->
        <template v-else>
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <HabitCard v-for="habit in filteredHabits" :key="habit.id" :habit="habit"
              @handleAction="handleAction($event, habit.id)" />
          </div>
          <div v-else class="space-y-3">
            <HabitListRow v-for="habit in filteredHabits" :key="habit.id" :habit="habit"
              @handleAction="handleAction($event, habit.id)" />
          </div>
        </template>
      </div>
    </main>
    <HabitLogDialog :habit-id="selectedHabitToLog?.id" :habit-name="selectedHabitToLog?.name"
      v-model:is-dialog-open="isLogHabitDialogOpen" />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const { toast } = useToast()
const { confirm } = useConfirm()
const router = useRouter()

type HabitsAndCategoriesResponse = {
  habitData: { habits: HabitWithCategory[], completedToday: number },
  categories: { id: string; name: string; icon: string }[]
}

interface HabitWithCategory extends Habit {
  category: {
    id: string
    name: string
    icon: string
  }
}

// fetch habits and categories
const { data } = await useAsyncData<HabitsAndCategoriesResponse>(
  'habits-and-categories',
  async () => {
    const [habitsRes, categoriesRes] = await Promise.all([
      $fetch<{ success: boolean; data: { habits: HabitWithCategory[], completedToday: number } }>(`/api/habits`),
      $fetch<{ id: string; name: string; icon: string }[]>('/api/categories')
    ])

    return {
      habitData: habitsRes.data,
      categories: categoriesRes.map(item => ({
        id: item.id,
        name: item.name,
        icon: item.icon
      }))
    }
  },
  {
    default: () => ({ habitData: { habits: [], completedToday: 0 }, categories: [] })
  }
)

const habitData = computed(() => data.value.habitData)
const categories = computed(() => data.value.categories)

const stats = computed(() => {
  const habits = habitData.value.habits

  if (habits.length === 0) {
    return {
      totalHabits: 0,
      activeHabits: 0,
      completedToday: habitData.value.completedToday,
      avgProgress: 0
    }
  }


  const completionPercentages = habits
    .filter(h => h.goalValue > 0) // Filter out habits with zero goal value
    .map(h => (h.totalCompletions / h.goalValue) * 100)

  const avgProgress = completionPercentages.length > 0
    ? completionPercentages.reduce((sum, p) => sum + p, 0) / completionPercentages.length
    : 0

  return {
    totalHabits: habits.length,
    activeHabits: habits.filter(h => !h.isArchived && !h.isCompleted).length,
    completedToday: habitData.value.completedToday,
    avgProgress: Math.round(avgProgress)
  }
})



// view mode management
const viewMode = ref<'grid' | 'list'>('grid')

// filteration
const searchQuery = ref('')
const categoryFilter = ref('all')
const frequencyFilter = ref<Frequency | 'all'>('all')
const dueDateFilter = ref<'all' | 'today' | 'tomorrow' | 'thisWeek'>('all')

const filteredHabits = computed(() => {
  return habitData.value.habits.filter((habit: HabitWithCategory) => {
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      habit.category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = categoryFilter.value === 'all' || habit.categoryId === categoryFilter.value
    const matchesFrequency = frequencyFilter.value === 'all' || habit.frequency.toLowerCase() === frequencyFilter.value.toLowerCase()
    
    // Due date filter logic
    let matchesDueDate = true
    if (dueDateFilter.value !== 'all' && habit.nextDueDate) {
      const now = dayjs()
      const dueDate = dayjs(habit.nextDueDate)
      const today = now.startOf('day')
      const tomorrow = now.add(1, 'day').startOf('day')
      const endOfWeek = now.endOf('week')
      
      switch (dueDateFilter.value) {
        case 'today':
          matchesDueDate = dueDate.isSame(today, 'day')
          break
        case 'tomorrow':
          matchesDueDate = dueDate.isSame(tomorrow, 'day')
          break
        case 'thisWeek':
          matchesDueDate = dueDate.isSame(today, 'day') || 
            (dueDate.isAfter(today) && (dueDate.isBefore(endOfWeek) || dueDate.isSame(endOfWeek, 'day')))
          break
      }
    } else if (dueDateFilter.value !== 'all' && !habit.nextDueDate) {
      // If filter is set but habit has no due date, exclude it (except for 'all')
      matchesDueDate = false
    }

    return matchesSearch && matchesCategory && matchesFrequency && matchesDueDate
  })
})


// habit logging
const isLogHabitDialogOpen = ref(false)
const selectedHabitToLog = ref<{ id: string, name: string } | null>(null)


const handleAction = (action: string, habitId: string) => {
  switch (action) {
    case 'viewDetails':
      router.push(`/habits/detail/${habitId}`)
      break
    case 'recordLog':
      addRecord(habitId)
      break
    case 'edit':
      router.push(`/habits/${habitId}`)
      break
    case 'toggleStatus':
      toggleStatus(habitId)
      break
    case 'delete':
      deleteHabit(habitId)
      break

    default:
      break
  }
}

const addRecord = (habitId: string) => {
  selectedHabitToLog.value = { id: habitId, name: filteredHabits.value.find(habit => habit.id === habitId)?.name || '' }
  isLogHabitDialogOpen.value = true
}

const toggleStatus = async (habitId: string) => {
  try {
    await $fetch(`/api/habits/${habitId}/toggle-status`, {
      method: 'POST'
    })
    let archivedStatus = false
    const index = habitData.value.habits.findIndex(habit => habit.id === habitId)
    const updatedHabits = [...habitData.value.habits];
    if (index !== -1 && updatedHabits[index]) {
updatedHabits[index].isArchived = !updatedHabits[index].isArchived;
habitData.value.habits = updatedHabits;

      // habitData.value.habits[index].isArchived = !habitData.value.habits[index].isArchived
      // archivedStatus = habitData.value.habits[index]?.isArchived || false
      // console.log('archivedStatus', habitData.value.habits[index])
    }

    toast({
      title: 'Status toggled',
      description: `The habit has been ${archivedStatus ? 'archived' : 'activated'} successfully.`,
    })
  } catch (error) {
    console.error('Error toggling status:', error)
    toast({
      title: 'Error',
      description: 'Failed to toggle status. Please try again.',
      variant: 'destructive',
    })
  }
}



const deleteHabit = async (habitId: string) => {
  const confirmed = await confirm({
    title: 'Delete Habit?',
    description: 'This action cannot be undone. This will permanently delete the habit and all its data.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
  })
  if (!confirmed) return
  try {

    await $fetch(`/api/habits/${habitId}`, {
      method: 'DELETE'
    })

    habitData.value.habits = habitData.value.habits.filter(habit => habit.id !== habitId)

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


// routing methods
const navigateToCreateHabit = () => {
  router.push('/habits/create')
}

// Set page title
useHead({
  title: 'Habits'
})

</script>