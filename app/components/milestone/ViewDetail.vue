<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-3 text-2xl">
          <span class="text-4xl">{{ viewMilestone?.rewardIcon }}</span>
          {{ viewMilestone?.name }}
        </DialogTitle>
        <DialogDescription>
          {{ viewMilestone?.habitName }}
        </DialogDescription>
      </DialogHeader>

      <div v-if="viewMilestone" class="space-y-6 py-4">
        <!-- Status Badge -->
        <div class="flex items-center gap-3">
          <component :is="getStatusIcon(viewMilestone)?.icon" :class="getStatusIcon(viewMilestone)?.class" />
          <Badge :class="getStatusBadge(viewMilestone)?.class" :variant="getStatusBadge(viewMilestone)?.variant as any">
            {{ formatStatus(viewMilestone.status) }}</Badge>
        </div>

        <!-- Progress Section -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Progress</h3>
            <span class="text-2xl font-bold text-primary">
              {{ Math.round((viewMilestone.currentProgress / viewMilestone.targetValue) * 100) }}%
            </span>
          </div>
          <Progress :model-value="(viewMilestone.currentProgress / viewMilestone.targetValue) * 100" class="h-3" />
          <div class="flex justify-between text-sm text-muted-foreground">
            <span>{{ viewMilestone.currentProgress }} completed</span>
            <span>{{ viewMilestone.targetValue - viewMilestone.currentProgress }} remaining</span>
          </div>
        </div>

        <!-- Description -->
        <div v-if="viewMilestone.description" class="space-y-2">
          <h3 class="font-semibold">Description</h3>
          <p class="text-muted-foreground line-clamp-4">{{ viewMilestone.description }}</p>
        </div>

        <!-- Reward Section -->
        <div v-if="viewMilestone.rewardName" class="space-y-3 p-4 rounded-lg bg-muted/50 border">
          <div class="flex items-center gap-2">
            <IconGift class="w-5 h-5 text-success" />
            <h3 class="font-semibold">Reward</h3>
          </div>
          <div>
            <p class="font-medium text-success">{{ viewMilestone.rewardName }}</p>
            <p v-if="viewMilestone.rewardDescription" class="text-sm text-muted-foreground mt-1 line-clamp-4">
              {{ viewMilestone.rewardDescription }}
            </p>
          </div>
        </div>

        <!-- Achievement Date -->
        <div v-if="viewMilestone.achievedDate" class="flex items-center gap-2 text-sm">
          <IconTrophy class="w-4 h-4 text-success" />
          <span class="text-muted-foreground">
            Achieved on {{ formatDate(viewMilestone.achievedDate) }}
          </span>
        </div>

        <!-- Status-specific message -->
        <div v-if="viewMilestone.status === 'locked'" class="p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
          This milestone will unlock automatically as you make progress on your habit.
        </div>

        <div v-if="viewMilestone.status === 'inProgress'" class="p-3 rounded-lg bg-primary/10 text-sm">
          Keep going! You're {{ viewMilestone.targetValue - viewMilestone.currentProgress }} {{ viewMilestone.targetMetric }} away from your reward.
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="isOpen = false">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { IconCrown, IconTarget, IconMedal, IconTrophy } from '#components'

withDefaults(defineProps<{
  viewMilestone: Milestone | null
}>(), {
  viewMilestone: null
})


const isOpen = defineModel<boolean>('isOpen', { default: false })


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

// Optionally: methods to return status icon/badge components
const getStatusIcon = (milestone: Milestone | null) => {
  if (!milestone) return null
  switch (milestone.status) {
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
      return null
  }
}

const getStatusBadge = (milestone: Milestone | null) => {
  if (!milestone) return null
  switch (milestone.status) {
    case "achieved":
      return { class: "bg-success/20 text-success border-success/30", variant: "success" as any }
    case "inProgress":
      return { class: "", variant: "secondary" as any }
    case "locked":
      return { class: "", variant: "outline" as any }
    default:
      return null
  }
}




</script>

<style scoped></style>