<template>
  <Card>
    <CardHeader>
      <div class="flex items-center space-x-2">
        <Trophy class="w-5 h-5 text-warning" />
        <CardTitle class="text-lg">Milestones & Rewards</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div v-for="milestone in milestones" :key="milestone.id" class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-lg">{{ milestone.icon }}</span>
              <div>
                <p class="font-medium text-sm">{{ milestone.habit }}</p>
                <p class="text-xs text-muted-foreground">{{ milestone.nextMilestone }}</p>
              </div>
            </div>
            <Badge variant="secondary" class="text-xs">{{ milestone.daysRemaining }} days</Badge>
          </div>
          <Progress :value="milestone.progress" class="h-2" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  milestones: Milestone[]
}>(), {
  milestones: () => [],
})
</script>

<style scoped></style>