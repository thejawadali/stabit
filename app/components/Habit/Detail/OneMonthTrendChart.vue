<template>
  <Card class="bg-gradient-card shadow-card">
    <CardHeader>
      <CardTitle class="text-lg font-semibold text-foreground">30-Day Trend</CardTitle>
    </CardHeader>
    <CardContent>
      <ClientOnly>
        <div class="h-64">
          <Line :data="thirtyDayChartData" :options="chartOptionsLine" />
        </div>
      </ClientOnly>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { Chart, registerables } from 'chart.js'
import { Line } from 'vue-chartjs'


Chart.register(...registerables)

const props = defineProps<{
  logs: HabitLog[]
}>()

const last30DaysData = computed(() => {
  const data: { date: string; completed: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day')
    const dateStr = date.format('YYYY-MM-DD')
    const dayLogs = props.logs.filter((log) => {
      const logDate = dayjs(log.createdAt).format('YYYY-MM-DD')
      return logDate === dateStr
    })
    const completed = dayLogs.some((log) => log.completionStatus === 'completed')
    data.push({ date: date.format('MM/DD'), completed: completed ? 1 : 0 })
  }
  return data
})

const thirtyDayChartData = computed(() => {
  const d = last30DaysData.value
  return {
    labels: d.map((x) => x.date),
    datasets: [
      {
        label: 'Completed',
        backgroundColor: '#77c24c',
        borderColor: '#77c24c',
        borderWidth: 2,
        data: d.map((x) => x.completed),
        tension: 0.3,
        fill: false,
        pointRadius: 4,
      }
    ]
  }
})

// const chartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       display: false,
//     },
//   },
//   scales: {
//     y: {
//       beginAtZero: true,
//       min: 0,
//       max: 2,
//       grid: {
//         display: false,
//       },
//       ticks: {
//         color: "#ccc",
//         font: {
//           size: 12,
//         },
//       },
//     },
//     x: {
//       grid: {
//         display: false,
//       },
//       ticks: {
//         color: "#ccc",
//         font: {
//           size: 12,
//         },
//       },
//     },
//   },
// }

const chartOptionsLine = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
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