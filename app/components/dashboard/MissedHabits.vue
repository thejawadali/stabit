<template>
  <div v-if="missedHabitLogs.length > 0">
    <Card class="border-warning/50 bg-warning/5">
      <CardHeader>
        <div class="flex items-center space-x-2">
          <IconAlertCircle class="w-5 h-5 text-warning" />
          <CardTitle class="text-lg">Missed & Overdue</CardTitle>
          <Badge variant="outline" class="ml-auto">{{ missedHabitLogs.length }}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div v-for="log in missedHabitLogs" :key="log.id"
            class="flex items-center justify-between p-3 rounded-lg bg-background">
            <div class="flex items-center space-x-3">
              <span class="text-lg">{{ log.habit.icon }}</span>
              <div>
                <p class="font-medium">{{ log.habit.name }}</p>
                <p class="text-xs text-muted-foreground">Missed {{ getTimeAgo(log.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
  missedHabitLogs: MissedHabitLogs[]
}>(), {
  missedHabitLogs: () => [],
})

const getTimeAgo = (date: string) => {
  const timeAgo = useTimeAgo(new Date(date))
  return timeAgo
}

</script>