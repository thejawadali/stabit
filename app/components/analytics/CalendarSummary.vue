<template>
  <Card class="bg-gradient-card shadow-card">
    <CardHeader>
      <CardTitle class="text-lg font-semibold text-foreground flex items-center gap-2">
        <IconCalendar class="h-5 w-5 text-primary" />
        Monthly Calendar
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-3">
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div v-for="day in weekDays" :key="day" class="text-center text-xs font-medium text-muted-foreground py-1">
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button v-for="day in days" :key="day" @click="selectedDay = day"
          :class="`aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-colors ${getStatusColor(getDayStatus(day))} ${selectedDay === day ? 'ring-2 ring-primary ring-offset-2' : ''}`">
            {{ day }}
          </button>
        </div>

        <div v-if="selectedDay" class="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
          <p class="text-sm font-medium text-foreground mb-2">
            January {{ selectedDay }}, 2025
          </p>
          <p class="text-xs text-muted-foreground">
            {{ getDaySummary(selectedDay).completed }} of {{ getDaySummary(selectedDay).total }} habits completed
          </p>
        </div>

        <div class="flex items-center gap-4 pt-3 border-t border-border text-xs">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-sm bg-success" />
            <span class="text-muted-foreground">Completed</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-sm bg-warning" />
            <span class="text-muted-foreground">Partial</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-sm bg-destructive/50" />
            <span class="text-muted-foreground">Missed</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">

const selectedDay = ref<number | null>(null)


// Mock data for the calendar
const getDayStatus = (day: number) => {
  if (day % 7 === 0) return "missed"
  if (day % 5 === 0) return "partial"
  if (day <= 25) return "completed"
  return "future"
}

const getDaySummary = (day: number) => {
  const status = getDayStatus(day)
  if (status === "completed") return { completed: 8, total: 10 }
  if (status === "partial") return { completed: 5, total: 10 }
  if (status === "missed") return { completed: 2, total: 10 }
  return { completed: 0, total: 10 }
}

const days = Array.from({ length: 31 }, (_, i) => i + 1)
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-success hover:bg-success/80"
    case "partial":
      return "bg-warning hover:bg-warning/80"
    case "missed":
      return "bg-destructive/50 hover:bg-destructive/60"
    default:
      return "bg-muted hover:bg-muted/80"
  }
};


</script>

<style scoped></style>