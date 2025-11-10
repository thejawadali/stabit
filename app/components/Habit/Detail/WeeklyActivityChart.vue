<template>
  <Card class="bg-gradient-card shadow-card">
    <CardHeader>
      <CardTitle class="text-lg font-semibold text-foreground">7-Day Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <ClientOnly>
        <div class="h-64">
          <Bar :data="sevenDayChartData" :options="chartOptions" />
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

const last7DaysData = computed(() => {
  const data: { day: string; completed: number; duration: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day')
    const dateStr = date.format('YYYY-MM-DD')
    const dayLogs = props.logs.filter((log) => {
      const logDate = dayjs(log.createdAt).format('YYYY-MM-DD')
      return logDate === dateStr
    })
    const completed = dayLogs.some((log) => log.completionStatus === 'completed')
    data.push({ day: date.format('ddd'), completed: completed ? 1 : 0, duration: dayLogs.reduce((s, l) => s + (l.durationMinutes || 0), 0) })
  }
  return data
})

const sevenDayChartData = computed(() => {
  const d = last7DaysData.value
  return {
    labels: d.map((x) => x.day),
    datasets: [
      {
        backgroundColor: "#77c24c",
        label: 'Completed',
        data: d.map((x) => x.completed),
        borderRadius: 8
      }
    ]
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
      max: 2,
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