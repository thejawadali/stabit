<template>
  <HabitForm 
    v-if="!pending"
    :habit="habitData.data"
    :categories="categories || []"
    :is-edit-mode="true"
    :loading
    @update="handleUpdate" 
  />
  
</template>

<script setup lang="ts">

const { toast } = useToast()
const route = useRoute()
const habitId = route.params.id as string
const loading = ref(false)


const {data: habitData, pending } = useFetch<{success: boolean, data: Habit | null}>(`/api/habits/${habitId}`, {
  default: () => ({ success: false, data: {} as Habit })
})
const {data: categories} = useFetch<{ id: string; name: string; icon: string }[]>('/api/categories', {
  transform: (data: any) => data.map((item: any) => ({
    id: item.id,
    name: item.name,
    icon: item.icon
  }))
})


useHead({
  title: computed(() => habitData.value?.data?.name || 'Habit')
})



async function handleUpdate(data: HabitFormData) {
  loading.value = true
  try {
    await $fetch(`/api/habits/${habitId}`, {
      method: 'PUT',
      body: data
    })
    toast({
      title: 'Habit updated successfully',
      description: 'The habit has been updated successfully'
    })
    navigateTo('/habits')
  } catch (error) {
    console.error('Error updating habit:', error)
    toast({
      title: 'Error updating habit',
      description: 'The habit has not been updated',
      variant: 'destructive',
    })
  }
}
</script>