<template>
  <Card class="bg-gradient-card shadow-card">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
      <CardTitle class="text-lg font-semibold text-foreground flex items-center gap-2">
        <IconCalendar class="h-5 w-5 text-primary" />
        Completion Trend -- {{ max }}
      </CardTitle>
      <Select v-model="viewType">
        <SelectTrigger class="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Daily</SelectItem>
          <SelectItem value="week">Weekly</SelectItem>
          <SelectItem value="month">Monthly</SelectItem>
        </SelectContent>
      </Select>
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


const viewType = ref<string>("date")

const dailyData = [
  { date: "Jan 1", completion: 75 },
  { date: "Jan 2", completion: 82 },
  { date: "Jan 3", completion: 78 },
  { date: "Jan 4", completion: 85 },
  { date: "Jan 5", completion: 90 },
  { date: "Jan 6", completion: 88 },
  { date: "Jan 7", completion: 92 },
]

const weeklyData = [
  { week: "Week 1", completion: 78 },
  { week: "Week 2", completion: 85 },
  { week: "Week 3", completion: 82 },
  { week: "Week 4", completion: 88 },
]

const monthlyData = [
  { month: "Oct", completion: 75 },
  { month: "Nov", completion: 80 },
  { month: "Dec", completion: 85 },
  { month: "Jan", completion: 87 },
]

const max = computed(() => {
  return Math.max(...getData().map((item) => item.completion)) + 10
})

const getData = () => {
  switch (viewType.value) {
    case "week":
      return weeklyData
    case "month":
      return monthlyData
    default:
      return dailyData
  }
}


const data = computed(() => {
  return {
    labels: getData().map((item) => item[viewType.value as keyof typeof item]),
    datasets: [
      {
        label: 'Completion',
        backgroundColor: '#77c24c',
        data: getData().map((item) => item.completion),
        borderColor: '#77c24c',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        pointRadius: 6,
        pointHoverRadius: 8,
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
      max: max.value,
    },
  },
  plugins: {
    legend: {
      display: false,
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
      const x = activeElements[0].element.x;
      const yAxis = chart.scales.y;
      
      // Clear previous vertical line
      chart.ctx.clearRect(0, 0, chart.width, chart.height);
      
      // Redraw chart
      chart.draw();
      
      // Draw vertical line
      chart.ctx.save();
      chart.ctx.strokeStyle = '#77c24c';
      chart.ctx.lineWidth = 1;
      chart.ctx.setLineDash([5, 5]);
      chart.ctx.beginPath();
      chart.ctx.moveTo(x, yAxis.top);
      chart.ctx.lineTo(x, yAxis.bottom);
      chart.ctx.stroke();
      chart.ctx.restore();
    }
  },
}))

</script>

<style scoped></style>