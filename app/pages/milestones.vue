<template>
  <main class="flex-1 p-6 overflow-auto">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold flex items-center gap-2">
            <IconTrophy class="w-8 h-8 text-warning" />
            Milestones & Rewards
          </h1>
          <p class="text-muted-foreground mt-1">
            Track your progress and celebrate achievements
          </p>
        </div>
        <Dialog :open="isAddDialogOpen" @update:open="isAddDialogOpen = $event">
          <DialogTrigger asChild>
            <Button class="gap-2">
              <IconPlus class="w-4 h-4" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Milestone</DialogTitle>
              <DialogDescription>
                Set up a new milestone and reward for your habit
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-4">
              <Select label="Habit">
                <SelectTrigger>
                  <SelectValue placeholder="Select habit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workout">Morning Workout</SelectItem>
                  <SelectItem value="reading">Daily Reading</SelectItem>
                  <SelectItem value="meditation">Meditation</SelectItem>
                </SelectContent>
              </Select>
              <Input label="Milestone Name" placeholder="e.g., First 10 Sessions" />
              <Input label="Target (sessions or days)" type="number" placeholder="10" />
              <Input label="Reward Name" placeholder="e.g., Weekend Treat" />
              <Textarea label="Reward Description" placeholder="Describe your reward..." />
              <div class="space-y-2">
                <Input label="Emoji / Icon" placeholder="🎉" maxLength={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="isAddDialogOpen = false">
                Cancel
              </Button>
              <Button @click="isAddDialogOpen = false">
                Create Milestone
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <!-- Filters -->
      <Card>
        <CardContent class="pt-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="space-y-2">
              <Label class="text-xs font-medium text-muted-foreground">Filter by Habit</Label>
              <Select v-model="filterHabit">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Habits</SelectItem>
                  <SelectItem value="Morning Workout">Morning Workout</SelectItem>
                  <SelectItem value="Daily Reading">Daily Reading</SelectItem>
                  <SelectItem value="Meditation">Meditation</SelectItem>
                  <SelectItem value="Language Learning">Language Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label class="text-xs font-medium text-muted-foreground">Filter by Status</Label>
              <Select v-model="filterStatus">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Achieved">Achieved</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Locked">Locked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label class="text-xs font-medium text-muted-foreground">Sort By</Label>
              <Select v-model="sortBy">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="progress">Progress Level</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex items-end">
              <Button variant="outline" class="w-full gap-2">
                <IconFilter class="w-4 h-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center gap-3">
              <div class="p-3 rounded-lg bg-primary/10">
                <IconTrophy class="w-6 h-6 text-primary" />
              </div>
              <div>
                <p class="text-2xl font-bold">
                  {{milestones.filter((m: Milestone) => m.status === "Achieved").length}}
                </p>
                <p class="text-xs text-muted-foreground">Achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center gap-3">
              <div class="p-3 rounded-lg bg-warning/10">
                <IconTarget class="w-6 h-6 text-warning" />
              </div>
              <div>
                <p class="text-2xl font-bold">
                  {{milestones.filter((m: Milestone) => m.status === "In Progress").length}}
                </p>
                <p class="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center gap-3">
              <div class="p-3 rounded-lg bg-muted">
                <IconMedal class="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p class="text-2xl font-bold">
                  {{milestones.filter((m: Milestone) => m.status === "Locked").length}}
                </p>
                <p class="text-xs text-muted-foreground">Locked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center gap-3">
              <div class="p-3 rounded-lg bg-success/10">
                <IconGift class="w-6 h-6 text-success" />
              </div>
              <div>
                <p class="text-2xl font-bold">{{ milestones.length }}</p>
                <p class="text-xs text-muted-foreground">Total Rewards</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Milestones Table -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <IconAward class="w-5 h-5" />
            All Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Habit</TableHead>
                <TableHead>Milestone</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="milestone in filteredMilestones" :key="milestone.id">
                <TableCell>
                  <div class="flex items-center gap-2">
                    <!-- icon -->
                    <component :is="getStatusIcon(milestone.status).icon"
                      :class="getStatusIcon(milestone.status).class" />
                    <!-- badge -->
                    <Badge :class="getStatusBadge(milestone.status).class"
                      :variant="getStatusBadge(milestone.status).variant">{{ milestone.status }}</Badge>
                  </div>
                </TableCell>
                <TableCell class="font-medium">
                  {{ milestone.habitName }}
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">{{ milestone.emoji }}</span>
                    <div>
                      <p class="font-medium">{{ milestone.title }}</p>
                      <p class="text-sm text-muted-foreground">
                        {{ milestone.description }}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="space-y-1 min-w-[200px]">
                    <div class="flex justify-between text-sm">
                      <span class="text-muted-foreground">
                        {{ milestone.current }} / {{ milestone.target }}
                      </span>
                      <span class="font-medium">
                        {{ Math.round((milestone.current / milestone.target) * 100) }}%
                      </span>
                    </div>
                    <Progress :value="(milestone.current / milestone.target) * 100" class="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p class="font-medium text-sm">{{ milestone.rewardTitle }}</p>
                    <p class="text-xs text-muted-foreground">
                      {{ milestone.rewardDescription }}
                    </p>
                    <p v-if="milestone.dateAchieved" class="text-xs text-success mt-1">
                      Achieved: {{ milestone.dateAchieved }}
                    </p>
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <Button v-if="milestone.status === 'Achieved'" size="sm" variant="outline"
                    @click="handleCelebration(milestone)" class="gap-1">
                    <IconSparkles class="w-3 h-3" />
                    Celebrate
                  </Button>
                  <Button v-else size="sm" variant="ghost">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div v-if="filteredMilestones.length === 0" class="text-center py-12">
            <Trophy class="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
            <p class="text-muted-foreground">No milestones found</p>
            <p class="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or create a new milestone
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Completed Rewards History -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Star class="w-5 h-5 text-warning" />
            Completed Rewards History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="milestone in milestones.filter((m: Milestone) => m.status === 'Achieved')" :key="milestone.id"
              class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="text-4xl">{{ milestone.emoji }}</div>
                <div>
                  <p class="font-medium">{{ milestone.title }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ milestone.habitName }}
                  </p>
                  <p class="text-xs text-success mt-1">
                    Completed on {{ milestone.dateAchieved }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium text-sm">{{ milestone.rewardTitle }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ milestone.rewardDescription }}
                </p>
              </div>
            </div>
            <div v-if="milestones.filter((m: Milestone) => m.status === 'Achieved').length === 0"
              class="text-center py-8 text-muted-foreground">
              <IconCrown class="w-10 h-10 mx-auto opacity-50 mb-2" />
              <p>No rewards achieved yet</p>
              <p class="text-sm mt-1">Keep working on your habits!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { IconCrown, IconTarget, IconMedal } from '#components'



interface Milestone {
  id: string
  habitName: string
  title: string
  description: string
  target: number
  current: number
  status: "Locked" | "In Progress" | "Achieved"
  rewardTitle: string
  rewardDescription: string
  emoji: string
  dateAchieved?: string
}


const filterHabit = ref<string>("all")
const filterStatus = ref<string>("all")
const sortBy = ref<string>("progress")
const isAddDialogOpen = ref(false)

// Mock data
const milestones = ref<Milestone[]>([
  {
    id: "1",
    habitName: "Morning Workout",
    title: "First 10 Sessions",
    description: "Complete 10 workout sessions",
    target: 10,
    current: 7,
    status: "In Progress",
    rewardTitle: "Weekend Treat",
    rewardDescription: "Buy your favorite smoothie",
    emoji: "💪",
  },
  {
    id: "2",
    habitName: "Daily Reading",
    title: "30 Day Streak",
    description: "Maintain a 30-day reading streak",
    target: 30,
    current: 30,
    status: "Achieved",
    rewardTitle: "New Book",
    rewardDescription: "Buy a new book from your wishlist",
    emoji: "📚",
    dateAchieved: "2024-01-15",
  },
  {
    id: "3",
    habitName: "Meditation",
    title: "7 Day Challenge",
    description: "Meditate for 7 consecutive days",
    target: 7,
    current: 4,
    status: "In Progress",
    rewardTitle: "Relaxation Day",
    rewardDescription: "Take a spa day or relaxation time",
    emoji: "🧘",
  },
  {
    id: "4",
    habitName: "Language Learning",
    title: "100 Sessions Mastery",
    description: "Complete 100 language practice sessions",
    target: 100,
    current: 15,
    status: "Locked",
    rewardTitle: "Premium Course",
    rewardDescription: "Unlock a premium language course",
    emoji: "🌍",
  },
])

const filteredMilestones = computed(() => {
  return milestones.value
    .filter((m) => filterHabit.value === "all" || m.habitName === filterHabit.value)
    .filter((m) => filterStatus.value === "all" || m.status === filterStatus.value)
    .sort((a, b) => {
      if (sortBy.value === "progress") {
        return (b.current / b.target) - (a.current / a.target)
      } else if (sortBy.value === "newest") {
        return b.id.localeCompare(a.id)
      } else {
        return a.id.localeCompare(b.id)
      }
    })
})

const handleCelebration = (milestone: Milestone) => {
  // toast.success
  console.log(`🎉 You've reached your ${milestone.title}! 🎊`, {
    description: `Reward unlocked: ${milestone.rewardTitle}`,
    duration: 5000,
  })
}


const getStatusBadge = (status: string) => {
  switch (status) {
    case "Achieved":
      return { class: "bg-success/20 text-success border-success/30", variant: "success" }
    case "In Progress":
      return { class: "", variant: "secondary" }
    case "Locked":
      return { class: "", variant: "outline" }
    default:
      return null
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Achieved":
      return {
        icon: IconCrown,
        class: "w-5 h-5 text-warning"
      }
    case "In Progress":
      return {
        icon: IconTarget,
        class: "w-5 h-5 text-primary"
      }
    case "Locked":
      return {
        icon: IconMedal,
        class: "w-5 h-5 text-muted-foreground"
      }
    default:
      return null
  }
};


</script>

<style scoped></style>