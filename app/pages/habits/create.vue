<template>
  <HabitForm :is-edit-mode="false" @save="handleSave" :categories="categories || []" />
</template>

<script setup lang="ts">
function handleSave(andAddAnother: boolean) {
  // Handle save logic here if needed
  // The HabitForm component already handles the main save logic
  console.log('Save triggered:', andAddAnother)
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