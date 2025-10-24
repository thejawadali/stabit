<template>
  <HabitForm :is-edit-mode="false" @save="handleSave" :categories="categories || []" />
</template>

<script setup lang="ts">
import type { HabitFormData } from "~~/types"

function handleSave(data: HabitFormData) {
  console.log('Save triggered:', data)
}
  

const { data: categories } = await useFetch<{id: string, name: string, icon: string}[]>('/api/categories', {
  transform: (data) => data.map((item) => ({
    id: item.id,
    name: item.name,
    icon: item.icon
  }))
})

</script>

<style scoped></style>