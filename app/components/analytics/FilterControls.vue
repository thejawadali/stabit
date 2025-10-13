<template>
  <div class="bg-card rounded-lg border border-border p-4 shadow-card">
    <div class="flex flex-wrap gap-4 items-center justify-between">
      <div class="flex flex-wrap gap-3 items-center">
        <Select v-model="timeRange" class="!w-[360px]">
          <SelectTrigger>
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="selectedHabit">
          <SelectTrigger class="w-[160px]">
            <SelectValue placeholder="All Habits" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Habits</SelectItem>
            <SelectItem value="meditation">Morning Meditation</SelectItem>
            <SelectItem value="exercise">Exercise</SelectItem>
            <SelectItem value="reading">Reading</SelectItem>
            <SelectItem value="journaling">Journaling</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="selectedCategory">
          <SelectTrigger class="w-[160px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="learning">Learning</SelectItem>
            <SelectItem value="productivity">Productivity</SelectItem>
            <SelectItem value="mindfulness">Mindfulness</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="selectedStatus">
          <SelectTrigger class="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" class="gap-2">
        <IconDownload class="h-4 w-4" />
        Export
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const timeRange = defineModel<string>("timeRange", {default: '7days'})
const selectedHabit = defineModel<string>("selectedHabit", {default: 'all'})
const selectedCategory = defineModel<string>("selectedCategory", {default: 'all'})
const selectedStatus = defineModel<string>("selectedStatus", {default: 'all'})
</script>

<style scoped></style>