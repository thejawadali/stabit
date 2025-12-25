<template>
  <div :class="['flex items-center justify-between p-3 rounded-lg transition-colors cursor-default',
    activity.completionStatus === 'completed' ? 'bg-success/10 hover:bg-success/20 border border-success/20' :
      activity.completionStatus === 'partial' ? 'bg-warning/10 hover:bg-warning/20 border border-warning/20' :
        activity.completionStatus === 'missed' ? 'bg-destructive/10 hover:bg-destructive/20 border border-destructive/20'
          : 'bg-accent/30 hover:bg-accent/50']">
    <div class="flex items-center space-x-3">
      <span class="text-xl">{{ activity.habit.icon }}</span>
      <div>
        <div class="flex items-center gap-2">
          <p class="font-medium">{{ activity.habit.name }}</p>
          <IconCheckCircle2 v-if="activity.completionStatus === 'completed'" class="w-4 h-4 text-success" />
          <IconMinusCircle v-else-if="activity.completionStatus === 'partial'" class="w-4 h-4 text-warning" />
          <IconXCircle v-else-if="activity.completionStatus === 'missed'" class="w-4 h-4 text-destructive" />
          <IconCircle v-else class="w-4 h-4 text-muted-foreground" />
        </div>
        <p class="text-sm text-muted-foreground">{{ activity.value }} {{ activity.habit.goalMetric }}</p>
      </div>
    </div>
    <div class="flex flex-col md:flex-row items-center gap-x-2 gap-y-1">
      <Badge :variant="activity.completionStatus === 'completed' ? 'success' :
        activity.completionStatus === 'partial' ? 'warning' :
          activity.completionStatus === 'missed' ? 'destructive' : 'secondary'" class="capitalize">
        {{ activity.completionStatus }}
      </Badge>
      <div class="flex items-center space-x-2 text-xs text-muted-foreground">
        <IconClock class="w-3 h-3" />
        <span>{{ useTimeAgo(activity.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

defineProps<{
  activity: RecentLog
}>()
</script>

<style></style>