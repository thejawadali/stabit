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
            <span class="text-xl">{{ activity.icon }}</span>
            <div>
              <p class="font-medium">{{ activity.habit }}</p>
              <p class="text-sm text-muted-foreground">{{ activity.value }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock class="w-3 h-3" />
            <span>{{ activity.timestamp }}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
  activities: Activity[]
}>(), {
  activities: () => [],
})

</script>

<style lang="scss" scoped></style>