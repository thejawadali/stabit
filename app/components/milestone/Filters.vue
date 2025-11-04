<template>
  <Card>
    <CardContent class="pt-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Filter by Habit -->
        <div class="space-y-2">
          <Label class="text-xs font-medium text-muted-foreground">Filter by Habit</Label>
          <Select v-model="filterHabit">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Habits</SelectItem>
              <SelectItem v-for="habit in habits" :key="habit.id" :value="habit.id">
                {{ habit.icon }} {{ habit.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <!-- filter by status -->
        <div class="space-y-2">
          <Label class="text-xs font-medium text-muted-foreground">Filter by Status</Label>
          <Select v-model="filterStatus">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="achieved">Achieved</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <!-- sort by -->
        <div class="space-y-2">
          <Label class="text-xs font-medium text-muted-foreground">Sort By</Label>
          <Select v-model="sortBy">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="progress">Progress Level</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const filterHabit = defineModel<string>("filterHabit", {default: 'all'})
const filterStatus = defineModel<string>("filterStatus", {default: 'all'})
const sortBy = defineModel<string>("sortBy", {default: 'progress'})

interface Habit {
  id: string
  name: string
  icon: string
}
defineProps<{
  habits: Habit[]
}>()
</script>

<style scoped></style>