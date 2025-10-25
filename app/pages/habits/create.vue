<template>
  <HabitForm :is-edit-mode="false" @save="handleSave" :categories="categories || []" />
</template>

<script setup lang="ts">
import type { HabitFormData } from "~~/types"

const { toast } = useToast()

const { data: categories } = await useFetch<{ id: string, name: string, icon: string }[]>('/api/categories', {
  transform: (data) => data.map((item) => ({
    id: item.id,
    name: item.name,
    icon: item.icon
  }))
})


const handleSave = async (data: HabitFormData) => {
  try {
    await $fetch('/api/habits', {
      method: 'POST',
      body: data
    })
    toast({
      title: 'Habit created successfully',
      description: 'The habit has been created successfully'
    })
    navigateTo('/habits')
  } catch (error) {
    console.error('Error creating habit:', error)
    toast({
      title: 'Error creating habit',
      description: 'The habit has not been created',
      variant: 'destructive',
    })
  }
}
</script>

<style scoped></style>