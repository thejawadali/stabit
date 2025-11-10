<template>
  <Card class="bg-gradient-card shadow-card">
    <CardHeader>
      <CardTitle class="text-lg font-semibold text-foreground">Status Distribution</CardTitle>
    </CardHeader>
    <CardContent>
      <ClientOnly>
        <div class="h-64">
          <Pie :data="statusChartData" :options="pieOptions" />
        </div>
      </ClientOnly>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { Pie } from 'vue-chartjs'


Chart.register(...registerables)

interface HabitLog {
  id: string
  createdAt: string
  completionStatus: string
  durationMinutes?: number
  notes?: string
}

const props = defineProps<{
  logs: HabitLog[]
}>()

const statusDistribution = computed(() => {
  const completed = props.logs.filter((l) => l.completionStatus === 'completed').length
  const skipped = props.logs.filter((l) => l.completionStatus === 'skipped').length
  const missed = Math.max(0, 30 - props.logs.length)
  return [
    { name: 'Completed', value: completed, color: 'green' },
    { name: 'Skipped', value: skipped, color: 'hsl(var(--warning))' },
    { name: 'Missed', value: missed, color: 'hsl(var(--muted))' }
  ]
})

const statusChartData = computed(() => {
  const d = statusDistribution.value
  return {
    labels: d.map((x) => x.name),
    datasets: [
      {
        data: d.map((x) => x.value),
        backgroundColor: d.map((x) => x.color)
      }
    ]
  }
})

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const, labels: { usePointStyle: true, pointStyle: 'circle', font: { size: 12 }, color: '#ccc' } } }
}
</script>

<style scoped></style>