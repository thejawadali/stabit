<template>
  <Card class="bg-gradient-card shadow-card">
    <CardHeader>
      <CardTitle class="text-lg font-semibold text-foreground flex items-center gap-2">
        <IconBarChart3 class="h-5 w-5 text-primary" />
        Weekly Performance
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="h-80">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'


const props = defineProps<{
  weeklyData: {day: string, completed: number}[]
}>()


const chartData = computed(() => {
  return {
    labels: props.weeklyData.map((item) => item.day),
    datasets: [{
      backgroundColor: "#77c24c",
      label: "Completed",
      data: props.weeklyData.map((item) => item.completed),
      borderRadius: 8,
    }],
  }
})

const max = computed(() => {
  return Math.max(...props.weeklyData.map((item) => item.completed)) + 2
})

const chartOptions = ref({
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
      max: max.value,
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
})
</script>

<style scoped></style>