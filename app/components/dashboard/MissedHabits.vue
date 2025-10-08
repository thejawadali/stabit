<template>
  <div v-if="habits.length > 0">
    <Card class="border-warning/50 bg-warning/5">
      <CardHeader>
        <div class="flex items-center space-x-2">
          <AlertCircle class="w-5 h-5 text-warning" />
          <CardTitle class="text-lg">Missed & Overdue</CardTitle>
          <Badge variant="outline" class="ml-auto">{{ habits.length }}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div v-for="habit in habits" :key="habit.id" class="flex items-center justify-between p-3 rounded-lg bg-background">
            <div class="flex items-center space-x-3">
              <span class="text-lg">{{ habit.icon }}</span>
              <div>
                <p class="font-medium">{{ habit.name }}</p>
                <p class="text-xs text-muted-foreground">Missed on {{ habit.missedDate }}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <Button size="sm" variant="outline" @click="onLog(habit.id)">
                <IconPlus class="w-3 h-3 mr-1" />
                Log
              </Button>
              <Button size="sm" variant="ghost" @click="onSkip(habit.id)">
                <IconX class="w-3 h-3 mr-1" />
                Skip
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  habits: Habit[]
}>(), {
  habits: [],
})

const emit = defineEmits<{
  (e: 'log', id: string): void
  (e: 'skip', id: string): void
}>();

const onLog = (id: string) => {
  emit('log', id);
}

const onSkip = (id: string) => {
  emit('skip', id);
}

</script>

<style scoped>
/* Add any custom styles if needed */
</style>
