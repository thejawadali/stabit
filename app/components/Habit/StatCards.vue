<template>
  
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-muted-foreground">Total Habits</div>
            <div class="text-2xl font-bold">{{ totalHabits }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-muted-foreground">Active</div>
            <div class="text-2xl font-bold text-success">{{ activeHabits }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-muted-foreground">Completed Today</div>
            <div class="text-2xl font-bold text-primary">{{ completedToday }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-sm text-muted-foreground">Avg Progress</div>
            <div class="text-2xl font-bold">{{ avgProgress }}%</div>
          </CardContent>
        </Card>
      </div>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
  totalHabits: number
  activeHabits: number
  completedToday: number
  avgProgress: number
}>(), {
  totalHabits: 0,
  activeHabits: 0,
  completedToday: 0,
  avgProgress: 0,
})
</script>

<style scoped>

</style>