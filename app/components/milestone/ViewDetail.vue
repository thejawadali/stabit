<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-3 text-2xl">
          <span class="text-4xl">{{ viewMilestone?.emoji }}</span>
          {{ viewMilestone?.title }}
        </DialogTitle>
        <DialogDescription>
          {{ viewMilestone?.habitName }}
        </DialogDescription>
      </DialogHeader>

      <div v-if="viewMilestone" class="space-y-6 py-4">
        <!-- Status Badge -->
        <div class="flex items-center gap-3">
          <component :is="getStatusIcon(viewMilestone)?.icon" :class="getStatusIcon(viewMilestone)?.class" />
          <Badge :class="getStatusBadge(viewMilestone)?.class" :variant="getStatusBadge(viewMilestone)?.variant">
            {{ viewMilestone.status }}</Badge>
        </div>

        <!-- Progress Section -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Progress</h3>
            <span class="text-2xl font-bold text-primary">
              {{ Math.round((viewMilestone.current / viewMilestone.target) * 100) }}%
            </span>
          </div>
          <Progress :value="(viewMilestone.current / viewMilestone.target) * 100" class="h-3" />
          <div class="flex justify-between text-sm text-muted-foreground">
            <span>{{ viewMilestone.current }} completed</span>
            <span>{{ viewMilestone.target - viewMilestone.current }} remaining</span>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <h3 class="font-semibold">Description</h3>
          <p class="text-muted-foreground">{{ viewMilestone.description }}</p>
        </div>

        <!-- Reward Section -->
        <div class="space-y-3 p-4 rounded-lg bg-muted/50 border">
          <div class="flex items-center gap-2">
            <IconGift class="w-5 h-5 text-success" />
            <h3 class="font-semibold">Reward</h3>
          </div>
          <div>
            <p class="font-medium text-success">{{ viewMilestone.rewardTitle }}</p>
            <p class="text-sm text-muted-foreground mt-1">
              {{ viewMilestone.rewardDescription }}
            </p>
          </div>
        </div>

        <!-- Achievement Date -->
        <div v-if="viewMilestone.dateAchieved" class="flex items-center gap-2 text-sm">
          <Award class="w-4 h-4 text-success" />
          <span class="text-muted-foreground">
            Achieved on {{ viewMilestone.dateAchieved }}
          </span>
        </div>

        <!-- Status-specific message -->
        <div v-if="viewMilestone.status === 'Locked'" class="p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
          This milestone will unlock automatically as you make progress on your habit.
        </div>

        <div v-if="viewMilestone.status === 'In Progress'" class="p-3 rounded-lg bg-primary/10 text-sm">
          Keep going! You're {{ viewMilestone.target - viewMilestone.current }} sessions away from your reward.
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

withDefaults(defineProps<{
  viewMilestone: Milestone | null
}>(), {
  viewMilestone: null
})


const isOpen = defineModel<boolean>('isOpen', { default: false })


// Optionally: methods to return status icon/badge components
const getStatusIcon = (milestone: Milestone | null) => {
  if (!milestone) return null
  switch (milestone.status) {
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
}

const getStatusBadge = (milestone: Milestone) => {
  if (!milestone) return null
  switch (milestone.status) {
    case "Achieved":
      return { class: "bg-success/20 text-success border-success/30", variant: "success" as any }
    case "In Progress":
      return { class: "", variant: "secondary" as any }
    case "Locked":
      return { class: "", variant: "outline" as any }
    default:
      return null
  }
}




</script>

<style scoped></style>