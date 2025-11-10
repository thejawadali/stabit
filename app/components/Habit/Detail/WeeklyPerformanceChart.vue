<template>
  <Card class="bg-gradient-card shadow-card">
    <CardHeader>
      <CardTitle class="text-lg font-semibold text-foreground">Weekly Performance</CardTitle>
    </CardHeader>
    <CardContent>
      <ClientOnly>
        <div class="h-64">
          <Bar :data="weeklyChartData" :options="chartOptions" />
        </div>
      </ClientOnly>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { Chart, registerables } from 'chart.js'
import { Bar } from 'vue-chartjs'

Chart.register(...registerables)

const props = defineProps<{
  logs: HabitLog[]
}>()

const weeklyCompletionData = computed(() => {
  const weeks: { week: string; completed: number }[] = []
  for (let i = 3; i >= 0; i--) {
    const weekStart = dayjs().subtract((i + 1) * 7, 'day').toDate()
    const weekEnd = dayjs().subtract(i * 7, 'day').toDate()
    const weekLogs = props.logs.filter((log) => {
      const logDate = dayjs(log.createdAt).toDate()
      return logDate >= weekStart && logDate < weekEnd
    })
    const completed = weekLogs.filter((log) => log.completionStatus === 'completed').length
    weeks.push({ week: `W${4 - i}`, completed })
  }
  return weeks
})

const weeklyChartData = computed(() => {
  const d = weeklyCompletionData.value
  return {

    labels: d.map((x) => x.week),
    datasets: [{
      backgroundColor: "#77c24c",
      label: 'Completed',
      data: d.map((x) => x.completed),
      borderRadius: 8
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 10,
      grid: {
        display: false,
      },
      ticks: {
        color: "#ccc",
        font: {
          size: 12,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#ccc",
        font: {
          size: 12,
        },
      },
    },
  },
}
</script>

<style scoped></style>