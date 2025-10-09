<template>
  <div class="">
    <main class="flex-1 p-4 sm:p-6 lg:p-8 pt-24 pb-12 max-w-[1600px] mx-auto w-full">
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
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-muted-foreground">Total Habits</div>
            <div class="text-2xl font-bold">{{ totalHabits }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-muted-foreground">Active</div>
            <div class="text-2xl font-bold text-success">{{ activeHabits }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-muted-foreground">Completed Today</div>
            <div class="text-2xl font-bold text-primary">{{ completedToday }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-muted-foreground">Avg Progress</div>
            <div class="text-2xl font-bold">{{ avgProgress }}%</div>
          </CardContent>
        </Card>
      </div>

      <!-- Filters and Actions -->
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
              <SelectItem v-for="cat in categories" :key="cat" :value="cat">{{ cat === "all" ? "All Categories" : cat }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="recurrenceFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Recurrence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="rec in recurrences" :key="rec" :value="rec">
                {{ rec === "all" ? "All Recurrence" : rec }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="statusFilter">
            <SelectTrigger class="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="streakFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Streak" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Streaks</SelectItem>
              <SelectItem value="active">Active Streaks Only</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="goalFilter">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Goal %" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Progress</SelectItem>
              <SelectItem value="high">75-100%</SelectItem>
              <SelectItem value="medium">50-74%</SelectItem>
              <SelectItem value="low">0-49%</SelectItem>
            </SelectContent>
          </Select>

          <div class="flex gap-2 ml-auto">
            <Button :variant="viewMode === 'grid' ? 'default' : 'outline'" size="icon" @click="viewMode = 'grid'">
              <IconLayoutGrid class="h-4 w-4" />
            </Button>
            <Button :variant="viewMode === 'list' ? 'default' : 'outline'" size="icon" @click="viewMode = 'list'">
              <IconList class="h-4 w-4" />
            </Button>
            <!-- <Button @click="toast.info('Add habit - coming soon')"> -->
            <Button @click="undefined">
              <IconPlus class="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </div>
        </div>

        <!-- Bulk Actions -->
        <Card v-if="selectedHabits.length > 1" class="bg-primary/5 border-primary/20">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <Checkbox :checked="selectedHabits.length === filteredHabits.length" @change="selectAllHabits" />
                <span class="font-medium">{{ selectedHabits.length }} habits selected</span>
              </div>
              <div class="flex gap-2">
                <Button variant="outline" size="sm" @click="bulkActivate">
                  <IconPlay class="h-4 w-4 mr-2" />
                  Activate
                </Button>
                <Button variant="outline" size="sm" @click="bulkDeactivate">
                  <IconPause class="h-4 w-4 mr-2" />
                  Deactivate
                </Button>
                <Button variant="destructive" size="sm" @click="bulkDelete">
                  <IconTrash2 class="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Habits Display -->
      <Card v-if="filteredHabits.length === 0">
        <CardContent class="p-12 text-center">
          <Target class="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 class="text-lg font-semibold mb-2">No habits found</h3>
          <p class="text-muted-foreground mb-4">Try adjusting your filters or create a new habit</p>
          <Button @click="navigateToCreateHabit">
            <IconPlus class="h-4 w-4 mr-2" />
            Add Habit
          </Button>
        </CardContent>
      </Card>
      <template v-else>
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HabitCard v-for="habit in filteredHabits" :key="habit.id" :habit="habit" :selected-habits="selectedHabits"
            @select-habit="selectHabit(habit.id)" @mark-complete="markComplete(habit.id)"
            @toggle-status="toggleStatus(habit.id)" @delete-habit="deleteHabit(habit.id)" />
        </div>
        <div v-else class="space-y-3">
          <HabitListRow v-for="habit in filteredHabits" :key="habit.id" :habit="habit" :selected-habits="selectedHabits"
            @select-habit="selectHabit(habit.id)" @mark-complete="markComplete(habit.id)"
            @toggle-status="toggleStatus(habit.id)" @delete-habit="deleteHabit(habit.id)" />
        </div>
      </template>
    </main>
    <AlertDialog :open="deleteDialogOpen" @update:open="setDeleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Habit?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the habit and all its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="setDeleteDialogOpen(false)">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete"
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
// import { toast } from 'vue-sonner'

// const router = useRouter()

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

const habits = ref<Habit[]>([
  {
    id: "1",
    icon: "📚",
    name: "Daily Reading",
    category: "Learning",
    recurrence: "Daily",
    status: "active",
    streak: 12,
    progress: 75,
    goalProgress: { current: 38, target: 50 },
    nextDue: "Today, 8:00 PM",
    hasMilestone: true,
    completedToday: false,
  },
  {
    id: "2",
    icon: "🏃",
    name: "Morning Run",
    category: "Health",
    recurrence: "Daily",
    status: "active",
    streak: 25,
    progress: 100,
    goalProgress: { current: 25, target: 100 },
    nextDue: "Tomorrow, 6:00 AM",
    hasMilestone: false,
    completedToday: true,
  },
  {
    id: "3",
    icon: "🧘",
    name: "Meditation",
    category: "Mindfulness",
    recurrence: "Daily",
    status: "active",
    streak: 45,
    progress: 100,
    goalProgress: { current: 45, target: 50 },
    nextDue: "Tomorrow, 7:00 AM",
    hasMilestone: true,
    completedToday: true,
  },
  {
    id: "4",
    icon: "💻",
    name: "Code Practice",
    category: "Productivity",
    recurrence: "Every 2 days",
    status: "active",
    streak: 8,
    progress: 40,
    goalProgress: { current: 16, target: 40 },
    nextDue: "Tomorrow, 2:00 PM",
    hasMilestone: false,
    completedToday: false,
  },
  {
    id: "5",
    icon: "🎨",
    name: "Creative Writing",
    category: "Learning",
    recurrence: "Weekly",
    status: "inactive",
    streak: 0,
    progress: 30,
    goalProgress: { current: 6, target: 20 },
    nextDue: "Saturday, 3:00 PM",
    hasMilestone: false,
    completedToday: false,
  },
  {
    id: "6",
    icon: "💧",
    name: "Drink Water",
    category: "Health",
    recurrence: "Daily",
    status: "active",
    streak: 60,
    progress: 62,
    goalProgress: { current: 60, target: 100 },
    nextDue: "Throughout the day",
    hasMilestone: true,
    completedToday: false,
  },
])


const searchQuery = ref('')
const categoryFilter = ref('all')
const recurrenceFilter = ref('all')
const statusFilter = ref('all')
const streakFilter = ref('all')
const goalFilter = ref('all')
const selectedHabits = ref<string[]>([])
const viewMode = ref<'grid' | 'list'>('grid')

const categories = ["all", "Health", "Learning", "Productivity", "Mindfulness"]
const recurrences = ["all", "Daily", "Weekly", "Custom"]

const filteredHabits = computed(() => {
  return habits.value.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      habit.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = categoryFilter.value === 'all' || habit.category.toLowerCase() === categoryFilter.value.toLowerCase()
    const matchesRecurrence = recurrenceFilter.value === 'all' || habit.recurrence.toLowerCase().includes(recurrenceFilter.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || habit.status === statusFilter.value
    const matchesStreak = streakFilter.value === 'all' || (streakFilter.value === 'active' && habit.streak > 0)
    const matchesGoal = goalFilter.value === 'all' ||
      (goalFilter.value === 'high' && habit.progress >= 75) ||
      (goalFilter.value === 'medium' && habit.progress >= 50 && habit.progress < 75) ||
      (goalFilter.value === 'low' && habit.progress < 50)

    return matchesSearch && matchesCategory && matchesRecurrence && matchesStatus && matchesStreak && matchesGoal
  })
})

const totalHabits = computed(() => habits.value.length)
const activeHabits = computed(() => habits.value.filter(h => h.status === "active").length)
const completedToday = computed(() => habits.value.filter(h => h.completedToday).length)
const avgProgress = computed(() => Math.round(habits.value.reduce((sum, h) => sum + h.progress, 0) / habits.value.length))

const navigateToCreateHabit = () => {
  // router.push('/habits/create')
  // toast.info('Create habit - coming soon')
}

const selectHabit = (habitId: string) => {
  if (selectedHabits.value.includes(habitId)) {
    selectedHabits.value = selectedHabits.value.filter(id => id !== habitId)
  } else {
    selectedHabits.value.push(habitId)
  }
}

const markComplete = (habitId: string) => {
  habits.value = habits.value.map(habit => habit.id === habitId ? { ...habit, completedToday: true, progress: Math.min(100, habit.progress + 10) } : habit)
  // toast.success("Habit marked as complete!");
}

const toggleStatus = (habitId: string) => {
  habits.value = habits.value.map(habit => habit.id === habitId ? { ...habit, status: habit.status === 'active' ? 'inactive' : 'active' } : habit)
  // toast.success("Status toggled!");
}

const deleteDialogOpen = ref(false)
let habitToDelete = null as string | null
const setDeleteDialogOpen = (value: boolean) => {
  deleteDialogOpen.value = value
}

const confirmDelete = () => {
  setDeleteDialogOpen(false)
  habits.value = habits.value.filter(habit => habit.id !== habitToDelete)
  // toast.success(`Deleted ${habitId}`)
  selectedHabits.value = selectedHabits.value.filter(id => id !== habitToDelete)
}

const deleteHabit = (habitId: string) => {
  habitToDelete = habitId
  setDeleteDialogOpen(true)
}


const selectAllHabits = () => {
  if (selectedHabits.value.length === filteredHabits.value.length) {
    selectedHabits.value = []
  } else {
    selectedHabits.value = filteredHabits.value.map(habit => habit.id)
  }
}

const bulkActivate = () => {
  habits.value.forEach(habit => {
    if (selectedHabits.value.includes(habit.id)) {
      habit.status = 'active'
    }
  })
  // toast.success(`Activated ${selectedHabits.value.length} habit(s)`)
  selectedHabits.value = []
}

const bulkDeactivate = () => {
  habits.value.forEach(habit => {
    if (selectedHabits.value.includes(habit.id)) {
      habit.status = 'inactive'
    }
  })
  // toast.success(`Deactivated ${selectedHabits.value.length} habit(s)`)
  selectedHabits.value = []
}

const bulkDelete = () => {
  habits.value = habits.value.filter(habit => !selectedHabits.value.includes(habit.id))
  // toast.success(`Deleted ${selectedHabits.value.length} habit(s)`)
  selectedHabits.value = []
}
</script>

<style scoped></style>