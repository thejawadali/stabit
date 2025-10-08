<template>
  <div class="flex flex-wrap gap-3">
    <!-- Add Habit Button -->
    <Button class="flex items-center space-x-2" @click="emit('addHabit')">
      <IconPlus class="w-4 h-4" />
      <span>Add Habit</span>
    </Button>

    <!-- Quick Log Button -->
    <Button variant="outline" class="flex items-center space-x-2" @click="emit('addQuickLog')">
      <IconClock class="w-4 h-4" />
      <span>Quick Log</span>
    </Button>

    <!-- Calendar Button -->
    <Button variant="outline" class="flex items-center space-x-2" @click="navigateTo('/calendar')">
      <IconCalendar class="w-4 h-4" />
      <span>Calendar</span>
    </Button>

    <!-- Analytics Button -->
    <Button variant="outline" class="flex items-center space-x-2" @click="navigateTo('/analytics')">
      <IconBarChart3 class="w-4 h-4" />
      <span>Analytics</span>
    </Button>

    <!-- Settings Button -->
    <Button variant="ghost" class="flex items-center space-x-2">
      <IconSettings class="w-4 h-4" />
      <span>Settings</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()


const navigateTo = (path: string) => {
  router.push(path)
}

const emit = defineEmits<{
  (e: 'addHabit'): void
  (e: 'addQuickLog'): void
}>();

</script>

<style scoped></style>