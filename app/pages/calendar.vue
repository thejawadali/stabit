<template>
  <main class="flex-1 p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Calendar</h1>
        <p class="text-muted-foreground">Track your daily habit completions</p>
      </div>

      <!-- Streak Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card class="bg-gradient-card shadow-card">
          <CardContent class="p-6">
            <div class="flex items-center space-x-3">
              <div class="p-3 rounded-full bg-primary/10">
                <IconFlame class="h-6 w-6 text-primary" />
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Current Streak</p>
                <p class="text-2xl font-bold text-foreground">{{ streakData.current }} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="bg-gradient-card shadow-card">
          <CardContent class="p-6">
            <div class="flex items-center space-x-3">
              <div class="p-3 rounded-full bg-success/10">
                <IconCheckCircle2 class="h-6 w-6 text-success" />
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Longest Streak</p>
                <p class="text-2xl font-bold text-foreground">{{ streakData.longest }} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="bg-gradient-card shadow-card">
          <CardContent class="p-6">
            <div class="flex items-center space-x-3">
              <div class="p-3 rounded-full bg-warning/10">
                <IconCircle class="h-6 w-6 text-warning" />
              </div>
              <div>
                <p class="text-sm text-muted-foreground">This Month</p>
                <p class="text-2xl font-bold text-foreground">{{ streakData.thisMonth }} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Calendar -->
        <Card class="lg:col-span-2 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle class="text-lg font-semibold text-foreground">
              Habit Completion Calendar
            </CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col items-center">
            <!-- <CalendarComponent mode="single" selected={date} onSelect={setDate}
              class="rounded-md border-0 pointer-events-auto" modifiers={{ completed: completedDates, partial:
              partialDates, }} modifiersStyles={{ completed: { backgroundColor: "hsl(var(--success) / 0.2)" ,
              color: "hsl(var(--success))" , fontWeight: "bold" , }, partial: {
              backgroundColor: "hsl(var(--warning) / 0.2)" , color: "hsl(var(--warning))" , fontWeight: "bold" , },
              }} /> -->

            <!-- Legend -->
            <div class="flex items-center justify-center space-x-6 mt-6 flex-wrap gap-3">
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full bg-success/20 border-2 border-success"></div>
                <span class="text-sm text-muted-foreground">All Completed</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full bg-warning/20 border-2 border-warning"></div>
                <span class="text-sm text-muted-foreground">Partially Completed</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full border-2 border-muted"></div>
                <span class="text-sm text-muted-foreground">Not Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Selected Day Details -->
        <Card class="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle class="text-lg font-semibold text-foreground">
              {{ date ? $dayjs(date).format("MMMM D, YYYY") : "Select a date" }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="date" class="space-y-4">
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm text-muted-foreground">Habits</span>
                <Badge variant="secondary" class="text-xs">
                  3/4 completed
                </Badge>
              </div>

              <div class="space-y-3">
                <div v-for="(habit, index) in selectedDayHabits" :key="index"
                  class="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <IconCheckCircle2 v-if="habit.completed" class="h-5 w-5 text-success mt-0.5" />
                  <IconCircle v-else class="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div class="flex-1">
                    <p :class="`text-sm font-medium ${habit.completed ? 'text-foreground' : 'text-muted-foreground'}`">
                      {{ habit.name }}
                    </p>
                    <p class="text-xs text-muted-foreground">{{ habit.time }}</p>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-border">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">Daily Progress</span>
                  <span class="text-sm font-semibold text-primary">75%</span>
                </div>
                <div class="w-full bg-muted rounded-full h-2 mt-2">
                  <div class="bg-primary rounded-full h-2 transition-all" style="width: 75%;" />
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-muted-foreground text-center py-8">
              Select a date to view details
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const date = ref<Date | undefined>(new Date())

// Mock data for completed habits on specific dates
const completedDates = [
  new Date(2025, 9, 1),
  new Date(2025, 9, 2),
  new Date(2025, 9, 3),
  new Date(2025, 9, 5),
  new Date(2025, 9, 6),
  new Date(2025, 9, 8),
  new Date(2025, 9, 9),
  new Date(2025, 9, 10),
]

const partialDates = [
  new Date(2025, 9, 4),
  new Date(2025, 9, 7),
]

const isDateCompleted = (day: Date) => {
  return completedDates.some(
    (d) => d.toDateString() === day.toDateString()
  )
}

const isDatePartial = (day: Date) => {
  return partialDates.some(
    (d) => d.toDateString() === day.toDateString()
  )
}

const selectedDayHabits = [
  { name: "Morning Meditation", completed: true, time: "7:00 AM" },
  { name: "Exercise", completed: true, time: "8:30 AM" },
  { name: "Reading", completed: true, time: "9:00 PM" },
  { name: "Journaling", completed: false, time: "Not completed" },
]

const streakData = {
  current: 23,
  longest: 45,
  thisMonth: 28,
}
</script>

<style scoped></style>