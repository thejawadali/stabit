<template>
  <main class="flex-1 overflow-auto">
    <div class="container space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row gap-2 md:items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold flex md:items-center gap-2">
            <IconTrophy class="w-8 h-8 text-warning mt-1 md:mt-0" />
            Milestones & Rewards
          </h1>
          <p class="text-muted-foreground mt-1">
            Track your progress and celebrate achievements
          </p>
        </div>
        <Button @click="isAddDialogOpen = true" class="w-full md:w-auto gap-2">
        <IconPlus class="w-4 h-4" />
        Add Milestone
      </Button>
      </div>

      <!-- Filters -->
      <MilestoneFilters :habits="habits" v-model:filterHabit="filterHabit" v-model:filterStatus="filterStatus" v-model:sortBy="sortBy" v-model:searchValue="searchValue" />

      <!-- Stats Overview -->
      <MilestoneStats :stats="stats" />

      <!-- Milestones Table -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <IconAward class="w-5 h-5" />
            All Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table v-loading="pending">
            <TableHeader>
              <TableRow>
                <TableHead>Milestone</TableHead>
                <TableHead>Habit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="milestone in milestones" :key="milestone.id">
                <TableCell>
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">{{ milestone.rewardIcon }}</span>
                    <div>
                      <p class="font-medium">{{ milestone.name }}</p>
                      <p v-if="milestone.description" class="text-sm text-muted-foreground line-clamp-2">
                        {{ milestone.description }}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell class="font-medium">
                  <div class="flex items-center gap-2">
                    <span>{{ milestone.habitIcon }}</span>
                    <span>{{ milestone.habitName }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <!-- icon -->
                    <component :is="getStatusIcon(milestone.status).icon"
                      :class="getStatusIcon(milestone.status).class" />
                    <!-- badge -->
                    <Badge :class="getStatusBadge(milestone.status).class"
                      :variant="getStatusBadge(milestone.status).variant">{{ formatStatus(milestone.status) }}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="space-y-1 min-w-[200px]">
                    <div class="flex justify-between text-sm">
                      <span class="text-muted-foreground">
                        {{ milestone.currentProgress }} / {{ milestone.targetValue }}
                      </span>
                      <span class="font-medium">
                        {{ Math.round((milestone.currentProgress / milestone.targetValue) * 100) }}%
                      </span>
                    </div>
                    <Progress :model-value="(milestone.currentProgress / milestone.targetValue) * 100" class="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p class="font-medium text-sm">{{ milestone.rewardName }}</p>
                    <p v-if="milestone.rewardDescription" class="text-xs text-muted-foreground line-clamp-2">
                      {{ milestone.rewardDescription }}
                    </p>
                    <p v-if="milestone.achievedDate" class="text-xs text-success mt-1">
                      Achieved: {{ formatDate(milestone.achievedDate) }}
                    </p>
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <Button v-if="milestone.status === 'achieved'" size="sm" variant="outline"
                      @click="handleCelebration(milestone)" class="gap-1">
                      <IconSparkles class="w-3 h-3" />
                      Celebrate
                    </Button>
                    <template v-else>
                      <IconEye class="w-4 h-4 cursor-pointer" @click="viewMilestone = milestone; isViewDetailOpen = true"/>
                      <IconTrash2 class="w-4 h-4 cursor-pointer text-destructive hover:text-destructive ml-2" @click="handleDelete(milestone)" />
                    </template>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div v-if="milestones.length === 0 && !pending" class="text-center py-12">
            <IconTrophy class="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
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
            <IconStar class="w-5 h-5 text-warning" />
            Completed Rewards History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="reward in completedHistory" :key="reward.id"
              class="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="text-4xl">{{ reward.rewardIcon }}</div>
                <div>
                  <p class="font-medium">{{ reward.milestoneName }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ reward.habitIcon }} {{ reward.habitName }}
                  </p>
                  <p v-if="reward.achievedDate" class="text-xs text-success mt-1">
                    Completed on {{ formatDate(reward.achievedDate) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium text-sm">{{ reward.rewardName }}</p>
                <p v-if="reward.rewardDescription" class="text-xs text-muted-foreground">
                  {{ reward.rewardDescription }}
                </p>
              </div>
            </div>
            <div v-if="completedHistory.length === 0 && !pending"
              class="text-center py-8 text-muted-foreground">
              <IconCrown class="w-10 h-10 mx-auto opacity-50 mb-2" />
              <p>No rewards achieved yet</p>
              <p class="text-sm mt-1">Keep working on your habits!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <MilestoneCreateDialog v-model:isAddDialogOpen="isAddDialogOpen" :habits="habits" @created="refreshMilestones" />
    <MilestoneViewDetail v-model:isOpen="isViewDetailOpen" :viewMilestone="viewMilestone" />
  </main>
</template>

<script setup lang="ts">
import { IconCrown, IconTarget, IconMedal } from '#components'
const { toast } = useToast()
const { confirm } = useConfirm()

const filterHabit = ref<string>("all")
const filterStatus = ref<string>("all")
const sortBy = ref<string>("progress")
const searchValue = ref<string>("")
const isAddDialogOpen = ref(false)
const isViewDetailOpen = ref(false)
const viewMilestone = ref<Milestone | null>(null)

// Fetch habits for filter dropdown
const { data: habitsData } = await useFetch('/api/habits', {
  default: () => ({ success: true, data: { habits: [], completedToday: 0 } }),
  transform: (data: any) => (data.data?.habits || []).map((habit: any) => ({
    id: habit.id,
    name: habit.name,
    icon: habit.icon
  }))
})

const habits = computed(() => habitsData.value || [])

// Fetch milestones using useFetch with reactive query
const { data: milestonesData, pending, refresh: refreshMilestones } = await useFetch<{
  success: boolean
  data: Milestone[]
  stats: MilestoneStats
  completedHistory: CompletedReward[]
}>('/api/milestones', {
  default: () => ({
    success: true,
    data: [],
    stats: {
      achieved: 0,
      inProgress: 0,
      locked: 0,
      totalRewards: 0
    },
    completedHistory: []
  }),
  query: computed(() => {
    const query: any = {
      sortBy: sortBy.value
    }

    if (searchValue.value) {
      query.search = searchValue.value
    }

    if (filterHabit.value !== 'all') {
      query.habitId = filterHabit.value
    }
    
    if (filterStatus.value !== 'all') {
      query.status = filterStatus.value
    }

    return query
  }),
  transform: (data: any) => data
})

const milestones = computed(() => milestonesData.value?.data || [])
const stats = computed(() => milestonesData.value?.stats || {
  achieved: 0,
  inProgress: 0,
  locked: 0,
  totalRewards: 0
})
const completedHistory = computed(() => milestonesData.value?.completedHistory || [])


const handleCelebration = (milestone: Milestone) => {
  toast({
    title: `🎉 You've reached your ${milestone.name}! 🎊`,
    description: `Reward unlocked: ${milestone.rewardName}`,
    duration: 5000,
  })
}

const handleDelete = async (milestone: Milestone) => {
  const confirmed = await confirm({
    title: 'Delete Milestone?',
    description: `Are you sure you want to delete the milestone "${milestone.name}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
  })

  if (!confirmed) return

  try {
    await $fetch(`/api/milestones/${milestone.id}`, {
      method: 'DELETE'
    })

    toast({
      title: 'Milestone deleted',
      description: 'The milestone has been deleted successfully.',
    })

    // Refresh the milestones list
    await refreshMilestones()
  } catch (error: any) {
    console.error('Error deleting milestone:', error)
    const errorMessage = error?.data?.message || error?.message || 'Failed to delete milestone. Please try again.'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    })
  }
}

const formatStatus = (status: string) => {
  switch (status) {
    case 'achieved':
      return 'Achieved'
    case 'inProgress':
      return 'In Progress'
    case 'locked':
      return 'Locked'
    default:
      return status
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}


const getStatusBadge = (status: string) => {
  switch (status) {
    case "achieved":
      return { class: "bg-success/20 text-success border-success/30", variant: "success" as any }
    case "inProgress":
      return { class: "", variant: "secondary" as any }
    case "locked":
      return { class: "", variant: "outline" as any }
    default:
      return { class: "", variant: "outline" as any }
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "achieved":
      return {
        icon: IconCrown,
        class: "w-5 h-5 text-warning"
      }
    case "inProgress":
      return {
        icon: IconTarget,
        class: "w-5 h-5 text-primary"
      }
    case "locked":
      return {
        icon: IconMedal,
        class: "w-5 h-5 text-muted-foreground"
      }
    default:
      return {
        icon: IconMedal,
        class: "w-5 h-5 text-muted-foreground"
      }
  }
}

// Set page title
useHead({
  title: 'Milestones'
})

</script>

<style scoped></style>