<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-lg">Recent Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-3">
        <div v-for="activity in activities" :key="activity.id"
          class="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer">
          <div class="flex items-center space-x-3">
            <span class="text-xl">{{ activity.habit.icon }}</span>
            <div>
              <div class="flex items-center gap-2">
                <p class="font-medium">{{ activity.habit.name }}</p>
                <IconCheckCircle2 v-if="activity.completionStatus === 'completed'" class="w-4 h-4 text-success" />
                <IconXCircle v-else class="w-4 h-4 text-destructive" />
              </div>
              <p class="text-sm text-muted-foreground">{{ activity.value }} {{ activity.habit.goalMetric }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2 text-xs text-muted-foreground">
            <IconClock class="w-3 h-3" />
            <span>{{ useTimeAgo(activity.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="mt-4 pt-4 border-t">
        <Button variant="outline" class="w-full" @click="handleLoadMore" :is-loading="loading">
          Load More
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  activities: RecentLog[]
  hasMore?: boolean
  loading?: boolean
}>(), {
  activities: () => [],
  hasMore: false,
  loading: false,
})

const emit = defineEmits<{
  (e: 'load-more'): void
}>()

const handleLoadMore = () => {
  if (!props.loading) {
    emit('load-more')
  }
}
</script>

<style lang="scss" scoped></style>