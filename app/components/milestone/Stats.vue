<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card>
      <CardContent class="pt-6">
        <div class="flex items-center gap-3">
          <div class="p-3 rounded-lg bg-primary/10">
            <IconTrophy class="w-6 h-6 text-primary" />
          </div>
          <div>
            <p class="text-2xl font-bold">
              {{ stats.achieved }}
            </p>
            <p class="text-xs text-muted-foreground">Achieved</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent class="pt-6">
        <div class="flex items-center gap-3">
          <div class="p-3 rounded-lg bg-warning/10">
            <IconTarget class="w-6 h-6 text-warning" />
          </div>
          <div>
            <p class="text-2xl font-bold">
              {{ stats.inProgress }}
            </p>
            <p class="text-xs text-muted-foreground">In Progress</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent class="pt-6">
        <div class="flex items-center gap-3">
          <div class="p-3 rounded-lg bg-muted">
            <IconMedal class="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p class="text-2xl font-bold">
              {{ stats.locked }}
            </p>
            <p class="text-xs text-muted-foreground">Locked</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent class="pt-6">
        <div class="flex items-center gap-3">
          <div class="p-3 rounded-lg bg-success/10">
            <IconGift class="w-6 h-6 text-success" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ stats.totalRewards }}</p>
            <p class="text-xs text-muted-foreground">Total Rewards</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">

interface Stats {
  achieved: number
  inProgress: number
  locked: number
  totalRewards: number
}
defineProps<{
  stats: Stats
}>()

</script>

<style scoped></style>