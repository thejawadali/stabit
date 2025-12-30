<template>
  <main class="container space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center space-x-4">
        <div>
          <div class="flex items-center space-x-3">
            <span class="text-3xl">{{ habit?.icon }}</span>
            <h1 class="text-3xl font-bold text-foreground">{{ habit?.name }}</h1>
          </div>
          <p class="text-muted-foreground mt-1">{{ habit?.description }}</p>
        </div>
      </div>

      <div class="flex space-x-2 self-end sm:self-center">
        <Button variant="outline" @click="router.push(`/habits/${habit?.id}`)">
          <IconEdit class="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" @click="handleDelete">
          <IconTrash2 class="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <HabitDetailStatsCard v-for="stat in habitStats" :key="stat.title" 
       :title="stat.title" :value="stat.value" :subtitle="stat.subtitle" :icon="stat.icon" :iconColor="stat.iconColor" :suffix="stat.suffix" />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 7-Day Activity -->
      <HabitDetailWeeklyActivityChart :logs="logs" />

      <!-- 30-Day Trend -->
      <HabitDetailOneMonthTrendChart :logs="logs" />

      <!-- Weekly Performance -->
      <HabitDetailWeeklyPerformanceChart :logs="logs" />

      <!-- Status Distribution -->
      <HabitDetailStatusChart :logs="logs" />
    </div>

    <!-- Recent Activity -->
    <Card class="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-if="logs.length === 0" class="text-center text-muted-foreground py-8">No activity recorded yet</div>

          <div v-for="log in logs.slice(0, 10)" :key="log.id"
            :class="[
              'flex items-center justify-between p-3 rounded-lg transition-colors cursor-default',
              log.completionStatus === 'completed' ? 'bg-success/10 border border-success/20' :
              log.completionStatus === 'partial' ? 'bg-warning/10 border border-warning/20' :
              log.completionStatus === 'missed' ? 'bg-destructive/10 border border-destructive/20' :
              'bg-background/50'
            ]">
            <div class="flex items-center space-x-4">
              <IconCalendar 
                :class="[
                  'h-5 w-5',
                  log.completionStatus === 'completed' ? 'text-success' :
                  log.completionStatus === 'partial' ? 'text-warning' :
                  log.completionStatus === 'missed' ? 'text-destructive' :
                  'text-muted-foreground'
                ]" />
              <div>
                <p class="font-medium text-foreground">{{ formatDate(log.createdAt) }}</p>
                <p v-if="log.notes" class="text-sm text-muted-foreground">{{ log.notes }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span v-if="log.durationMinutes" class="text-sm text-muted-foreground">{{ log.durationMinutes }}
                min</span>
              <Badge 
                :variant="log.completionStatus === 'completed' ? 'success' : 
                          log.completionStatus === 'partial' ? 'warning' : 
                          log.completionStatus === 'missed' ? 'destructive' : 'secondary'"
                class="capitalize">
                {{ log.completionStatus }}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </main>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { IconFlame, IconTarget, IconTrophy, IconClock } from "#components";
const { confirm } = useConfirm()

const route = useRoute()
const router = useRouter()
const { toast } = useToast()
const id = String(route.params.id || '')


// Type definitions
type HabitDetailsResponse = {
  success: boolean
  data: {
    id: string
    name: string
    icon: string
    description: string
    stats: {
      currentStreak: number
      completionRate: number
      totalCompletions: number
      avgDuration: number
    }
    logs: HabitLog[]
  } | null
}


const { data: habitDetailsResponse } = await useFetch<HabitDetailsResponse>(`/api/habits/${id}`, {
  query: {
    detail: 'true'
  },
  default: () => ({ success: false, data: null })
})

const habitDetails = computed(() => {
  if (!habitDetailsResponse.value?.success || !habitDetailsResponse.value?.data) {
    return null
  }
  return habitDetailsResponse.value.data
})

const habit = computed(() => {
  if (!habitDetails.value) return null
  const { stats: apiStats, logs: apiLogs, ...habitData } = habitDetails.value
  return {
    id: habitData.id,
    name: habitData.name,
    icon: habitData.icon,
    description: habitData.description,
    currentStreak: apiStats.currentStreak,
    totalCompletions: apiStats.totalCompletions
  }
})

const logs = computed(() => {
  if (!habitDetails.value) return []
  return habitDetails.value.logs.map((log: HabitLog) => ({
    id: log.id,
    createdAt: typeof log.createdAt === 'string' ? log.createdAt : new Date(log.createdAt).toISOString(),
    completionStatus: log.completionStatus,
    durationMinutes: log.durationMinutes || undefined,
    notes: log.notes || undefined
  }))
})

// Set page title with habit name
useHead({
  title: computed(() => habit.value?.name || 'Habit')
})

const stats = computed(() => {
  if (!habitDetails.value) return null
  return habitDetails.value.stats
})


const habitStats = computed(() => [
  {
    title: "Current Streak",
    value: stats.value?.currentStreak || 0,
    subtitle: "days",
    icon: IconFlame,
    iconColor: "text-primary",
  },
  {
    title: "Completion Rate",
    value: stats.value?.completionRate || 0,
    suffix: "%",
    subtitle: "last 30 days",
    icon: IconTarget,
    iconColor: "text-success",
  },
  {
    title: "Total Completions",
    value: stats.value?.totalCompletions || 0,
    subtitle: "last 30 days",
    icon: IconTrophy,
    iconColor: "text-warning",
  },
  {
    title: "Avg Duration",
    value: stats.value?.avgDuration || 0,
    subtitle: "minutes",
    icon: IconClock,
    iconColor: "text-primary",
  },
])


function formatDate(dateStr: string) {
  try { return dayjs(dateStr).format('MMMM DD, YYYY') } catch { return dateStr }
}

async function handleDelete() {
  const confirmed = await confirm({
    title: 'Delete Habit?',
    description: 'This action cannot be undone. This will permanently delete the habit and all its data.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/habits/${id}`, {
      method: 'DELETE'
    })

    toast({
      title: 'Success',
      description: 'Habit deleted successfully'
    })

    router.push('/habits')
  } catch (err: any) {
    console.error('Error deleting habit:', err)
    toast({
      title: 'Error',
      description: err?.data?.message || err?.message || 'Failed to delete habit',
      variant: 'destructive'
    })
  }
}
</script>
