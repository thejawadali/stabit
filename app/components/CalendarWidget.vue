<template>
  <div class="max-w-64 mx-auto space-y-2">
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
      <Button v-for="(dayObj, index) in calendarDays" :key="index" variant="ghost" class="h-8 w-8 p-0 text-sm relative"
        :class="dayClass(dayObj)" :disabled="!dayObj.isCurrentMonth">
        <template v-if="dayObj.isCurrentMonth && isCompleted(dayObj.day)">
          <IconCheck class="h-4 w-4 text-success" />
        </template>
        <template v-else-if="dayObj.isCurrentMonth && isPartiallyCompleted(dayObj.day)">
          {{ dayObj.day }}
        </template>
        <template v-else>
          {{ dayObj.day }}
        </template>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  completedDays: number[]
  partiallyCompleted: number[]
  missedDays: number[],
}>(), {
  completedDays: () => [],
  partiallyCompleted: () => [],
  missedDays: () => [],
})

const emit = defineEmits<{
  (e: 'onDateChange'): void
}>()


const currentDate = defineModel<Date>('currentDate', { default: new Date() })

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()


  const firstDay = new Date(year, month, 1).getDay()


  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()


  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days = []

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPreviousMonth: true
    })
  }

  for (let i = 1; i <= daysInCurrentMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      isPreviousMonth: false
    })
  }

  const totalCells = Math.ceil(days.length / 7) * 7
  const remainingCells = totalCells - days.length

  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isPreviousMonth: false
    })
  }
  return days
})

const isCompleted = (day: number) => props.completedDays.includes(day)
const isPartiallyCompleted = (day: number) => props.partiallyCompleted.includes(day)
const isMissed = (day: number) => props.missedDays.includes(day)
const isToday = (day: number) => {
  const today = new Date()
  return day === today.getDate() &&
    currentDate.value.getMonth() === today.getMonth() &&
    currentDate.value.getFullYear() === today.getFullYear()
}


const dayClass = (dayObj: { day: number, isCurrentMonth: boolean, isPreviousMonth: boolean }) => {
  return {
    'bg-primary text-primary-foreground': dayObj.isCurrentMonth && isToday(dayObj.day),
    'bg-success/10 hover:bg-success/20': dayObj.isCurrentMonth && isCompleted(dayObj.day),
    'bg-[hsl(var(--warning)/0.2)] hover:bg-[hsl(var(--warning)/0.3)] text-[hsl(var(--warning))] hover:text-[hsl(var(--warning))]': dayObj.isCurrentMonth && isPartiallyCompleted(dayObj.day),
    'bg-destructive/10 hover:bg-destructive/20 text-destructive': dayObj.isCurrentMonth && isMissed(dayObj.day) && !isToday(dayObj.day),
    'hover:bg-muted': dayObj.isCurrentMonth && !isToday(dayObj.day) && !isCompleted(dayObj.day) && !isPartiallyCompleted(dayObj.day) && !isMissed(dayObj.day),
    'text-muted-foreground/50 cursor-not-allowed': !dayObj.isCurrentMonth
  }
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  emit('onDateChange')
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  emit('onDateChange')
}
</script>