<template>
  <HabitForm :is-edit-mode="false" @save="handleSave" :categories="categories || []" :loading="loading" />
</template>

<script setup lang="ts">
import type HabitForm from "~/components/HabitForm.vue"

const { toast } = useToast()

const loading = ref(false)

const { data: categories } = await useFetch<{ id: string, name: string, icon: string }[]>('/api/categories', {
  transform: (data) => data.map((item) => ({
    id: item.id,
    name: item.name,
    icon: item.icon
  }))
})

const handleSave = async (data: HabitFormData) => {
  loading.value = true
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
  finally {
    loading.value = false
  }
}

// Set page title
useHead({
  title: 'Create Habit'
})
</script>

<style scoped></style>