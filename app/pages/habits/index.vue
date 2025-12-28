<template>
  <div>
    <main class="flex-1 p-4 sm:p-6 lg:p-8 pt-24 pb-12 mx-auto w-full">
      <!-- Header -->
      <div class="mb-6 flex flex-col md:flex-row gap-3 items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">My Habits</h1>
          <p class="text-muted-foreground">Manage and track all your habits</p>
        </div>
        <Button @click="navigateToCreateHabit" class="w-full md:w-auto">
          <IconPlus class="w-4 h-4 mr-2" />
          Create Habit
        </Button>
      </div>

      <!-- Stats -->
      <HabitStatCards :total-habits="stats.totalHabits" :active-habits="stats.activeHabits"
        :completed-today="stats.completedToday" :avg-progress="stats.avgProgress" />


      <div class="space-y-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="grid grid-cols-12 gap-3 w-full">
            <!-- search input -->
            <div class="relative col-span-12 xl:col-span-6">
              <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search habits..." v-model="searchQuery" class="pl-10" />
            </div>

            <!-- Filters -->
            <div class="col-span-6 md:col-span-4 xl:col-span-2">
              <Select v-model="categoryFilter">
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="col-span-6 md:col-span-4 xl:col-span-2">
              <Select v-model="frequencyFilter">
                <SelectTrigger>
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequency</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="col-span-6 md:col-span-4 xl:col-span-2">
              <Select v-model="dueDateFilter">
                <SelectTrigger>
                  <SelectValue placeholder="Due Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <!-- view mode buttons -->
          <div class="hidden xl:flex gap-2 ml-auto">
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
          <div v-if="viewMode === 'grid'" class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
            <HabitCard v-for="habit in filteredHabits" :key="habit.id" :habit="habit" @addRecord="addRecord(habit)"
              @refresh="refreshHabits" />
          </div>
          <div v-else class="space-y-3">
            <HabitListRow v-for="habit in filteredHabits" :key="habit.id" :habit="habit" @addRecord="addRecord(habit)"
              @refresh="refreshHabits" />
          </div>
        </template>
      </div>
    </main>
    <HabitLogDialog :habit="selectedHabitToLog" v-model:is-dialog-open="isLogHabitDialogOpen"
      @refresh="refreshHabits" />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const router = useRouter()


interface HabitWithCategory extends Habit {
  category: {
    id: string
    name: string
    icon: string
  }
}

// fetch categories
const { data: categories } = useFetch<{ id: string; name: string; icon: string }[]>('/api/categories', {
  transform: (data: any) => data.map((item: any) => ({
    id: item.id,
    name: item.name,
    icon: item.icon
  }))
})

// fetch habits
const { data: habitData, refresh: refreshHabits } = useFetch<{ habits: HabitWithCategory[], completedToday: number }>('/api/habits', {
  transform: (data: any) => data.data,
  default: () => ({ habits: [], completedToday: 0 })
})


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
const selectedHabitToLog = ref<{ id: string, name: string, goalMetric: string, currentTargetValue: number } | null>(null)

const addRecord = (habit: TodayHabit) => {
  if (!habit) return
  selectedHabitToLog.value = { id: habit.id || '', name: habit.name || '', goalMetric: habit.goalMetric || '', currentTargetValue: habit.currentTargetValue || 0 }
  isLogHabitDialogOpen.value = true
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