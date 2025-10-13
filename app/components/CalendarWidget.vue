<template>
  <div class="max-w-64 mx-auto space-y-2">
    <!-- calendar widget header -->
    <div class="flex items-center justify-between">
      <Button variant="ghost" size="icon" class="h-8 w-8" @click="previousMonth">
        <IconChevronLeft class="h-4 w-4" />
      </Button>
      <h1 class="text-xl font-semibold text-foreground">
        {{ monthNames[currentDate.getMonth()] }} {{ currentDate.getFullYear() }}
      </h1>
      <Button variant="ghost" size="icon" class="h-8 w-8" @click="nextMonth">
        <IconChevronRight class="h-4 w-4" />
      </Button>
    </div>

    <div class="grid grid-cols-7 gap-1 bg">
      <!-- Days of the week headers -->
      <div v-for="day in daysOfWeek" :key="day"
        class="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
        {{ day }}
      </div>

      <!-- All calendar days -->
      <Button 
        v-for="(dayObj, index) in calendarDays" 
        :key="index" 
        variant="ghost" 
        class="h-8 w-8 p-0 text-sm relative" 
        :class="{
          'bg-primary text-primary-foreground': dayObj.isCurrentMonth && isToday(dayObj.day),
          'bg-success/10 hover:bg-success/20': dayObj.isCurrentMonth && isCompleted(dayObj.day),
          'hover:bg-muted': dayObj.isCurrentMonth && !isToday(dayObj.day) && !isCompleted(dayObj.day),
          'text-muted-foreground/50 cursor-not-allowed': !dayObj.isCurrentMonth
        }"
        :disabled="!dayObj.isCurrentMonth"
      >
        <template v-if="dayObj.isCurrentMonth && isCompleted(dayObj.day)">
          <IconCheck class="h-4 w-4 text-success" />
        </template>
        <template v-else>
          {{ dayObj.day }}
        </template>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentDate = ref(new Date())

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDay = new Date(year, month, 1).getDay()
  
  // Get number of days in current month
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
  
  // Get number of days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  
  const days = []
  
  // Add previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPreviousMonth: true
    })
  }
  
  // Add current month days
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      isPreviousMonth: false
    })
  }
  
  // Add next month days to fill remaining cells
  const totalCells = Math.ceil(days.length / 7) * 7
  const remainingCells = totalCells - days.length
  
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isPreviousMonth: false
    })
  }
  
  console.log(`Calendar days for ${month + 1}/${year}:`, days)
  return days
})

// Mock completed days
const completedDays = ref([1, 3, 5, 7, 8, 10, 12, 15, 17, 20, 21])

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