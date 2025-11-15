<template>
  <Card>
    <CardHeader>
      <div class="flex items-center space-x-2">
        <IconTrophy class="w-5 h-5 text-warning" />
        <CardTitle class="text-lg">Milestones & Rewards</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div v-for="milestone in milestones" :key="milestone.id" class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-lg">{{ milestone.habitIcon }}</span>
              <div>
                <p class="font-medium text-sm">{{ milestone.habitName }}</p>
                <p class="text-xs text-muted-foreground">{{ milestone.name }}</p>
              </div>
            </div>
            <Badge variant="secondary" class="text-xs">{{ milestone.remainingSessions }} {{ milestone.targetMetric }}</Badge>
          </div>
          <Progress :model-value="milestone.currentProgress" class="h-2" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  milestones: DashboardMilestone[]
}>(), {
  milestones: () => [],
})
</script>

<style scoped></style>