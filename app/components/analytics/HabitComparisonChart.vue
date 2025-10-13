<template>
  <Card class="bg-gradient-card shadow-card">
    <CardHeader>
      <CardTitle class="text-lg font-semibold text-foreground flex items-center gap-2">
        <IconTrendingUp class="h-5 w-5 text-primary" />
        Habit Comparison
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="h-80">
        <Line :data="data" :options="options" />
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const comparisonData = [
  { week: "W1", meditation: 6, exercise: 5, reading: 4 },
  { week: "W2", meditation: 7, exercise: 6, reading: 5 },
  { week: "W3", meditation: 6, exercise: 7, reading: 6 },
  { week: "W4", meditation: 7, exercise: 6, reading: 7 },
  { week: "W5", meditation: 7, exercise: 7, reading: 6 },
]


const data = computed(() => {
  return {
    labels: comparisonData.map((item) => item.week),
    datasets: [
      {
        label: 'Meditation',
        backgroundColor: '#77c24c',
        data: comparisonData.map((item) => item.meditation),
        borderColor: '#77c24c',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 4,
      }, {
        label: 'Exercise',
        backgroundColor: '#4BDE80',
        data: comparisonData.map((item) => item.exercise),
        borderColor: '#4BDE80',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 4,
      }, {
        label: 'Reading',
        backgroundColor: '#F8C631',
        data: comparisonData.map((item) => item.reading),
        borderColor: '#F8C631',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 4,
      }
    ]
  }
})

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 12,
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  onHover: (event: any, activeElements: any, chart: any) => {
    if (activeElements.length > 0) {
      const x = activeElements[0].element.x
      const yAxis = chart.scales.y

      // Clear previous vertical line
      chart.ctx.clearRect(0, 0, chart.width, chart.height)

      // Redraw chart
      chart.draw()

      // Draw vertical line
      chart.ctx.save()
      // chart.ctx.strokeStyle = '#77c24c'
      chart.ctx.strokeStyle = '#fff'
      chart.ctx.lineWidth = 1
      // chart.ctx.setLineDash([5, 5])
      chart.ctx.beginPath()
      chart.ctx.moveTo(x, yAxis.top)
      chart.ctx.lineTo(x, yAxis.bottom)
      chart.ctx.stroke()
      chart.ctx.restore()
    }
  },
}))
</script>

<style scoped></style>