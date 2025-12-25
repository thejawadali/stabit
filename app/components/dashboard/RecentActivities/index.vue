<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-lg">Recent Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-3">
        <Item v-for="activity in activities" :key="activity.id" :activity="activity" />
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