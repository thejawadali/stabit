<template>
  <Card class="bg-gradient-card shadow-card">
    <CardHeader class="pb-4">
      <div class="flex items-center justify-between">
        <CardTitle class="text-lg font-semibold text-foreground">
          {{ monthNames[currentDate.getMonth()] }} {{ currentDate.getFullYear() }}
        </CardTitle>
        <div class="flex space-x-1">
          <Button variant="ghost" size="icon" class="h-8 w-8" @click="previousMonth">
            <IconChevronLeft class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" class="h-8 w-8" @click="nextMonth">
            <IconChevronRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <div class="grid grid-cols-7 gap-1">
        <!-- Days of the week headers -->
        <div v-for="day in daysOfWeek" :key="day"
          class="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
          {{ day }}
        </div>

        <!-- Empty cells before the first day of month -->
        <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="h-8"></div>

        <!-- Days of the month -->
        <Button v-for="day in daysInMonth" :key="day" variant="ghost" class="h-8 w-8 p-0 text-sm relative" :class="{
          'bg-primary text-primary-foreground': isToday(day),
          'bg-success/10 hover:bg-success/20': isCompleted(day),
          'hover:bg-muted': !isToday(day) && !isCompleted(day)
        }">
          <template v-if="isCompleted(day)">
            <IconCheck class="h-4 w-4 text-success" />
          </template>
          <template v-else>
            {{ day }}
          </template>
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const currentDate = ref(new Date())

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const daysInMonth = computed(() => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay()
})

// Mock completed days
const completedDays = ref([1, 3, 5, 7, 8, 10, 12, 15, 17, 20, 22])

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const isCompleted = (day: number) => completedDays.value.includes(day)
const isToday = (day: number) => {
  const today = new Date()
  return day === today.getDate() &&
    currentDate.value.getMonth() === today.getMonth() &&
    currentDate.value.getFullYear() === today.getFullYear()
}
</script>

<style scoped></style>