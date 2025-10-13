<template>
  <Card class="bg-gradient-card shadow-card h-full">
    <CardHeader>
      <CardTitle class="text-lg font-semibold text-foreground flex items-center gap-2">
        <IconActivity class="h-5 w-5 text-primary" />
        Category Breakdown
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="h-44 my-6">
        <Doughnut :data="data" :options="options" />
      </div>
      <div class="grid grid-cols-2 gap-3 mt-4">
        <div v-for="category in categoryData" :key="category.name" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: category.color }" />
          <span class="text-sm text-foreground">{{ category.name }}</span>
          <span class="text-xs text-muted-foreground ml-auto">{{ category.value }}%</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)


const categoryData = [
  { name: "Health", value: 35, color: "#4BDE80" },
  { name: "Learning", value: 25, color: "#79C24E" },
  { name: "Productivity", value: 20, color: "#F8C631" },
  { name: "Mindfulness", value: 20, color: "#A9EFC3" },
];


const data = {
  labels: categoryData.map(cate => cate.name),
  datasets: [
    {
      backgroundColor: categoryData.map(cate => cate.color),
      data: categoryData.map(cate => cate.value)
    }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%', // Decrease donut size (higher percentage = smaller donut)
  spacing: 4, // Add gap between datasets
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    arc: {
      borderWidth: 0, // Remove border
    },
  },
}



</script>

<style scoped></style>