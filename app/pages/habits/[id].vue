<template>
  <HabitForm 
    v-if="!pending"
    :habit="habit"
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


const { data: combinedData, pending } = await useAsyncData<CombinedData>(
  'habit-and-categories',
  async () => {
    const [habitRes, categoriesRes] = await Promise.all([
      $fetch<{ success: boolean; data: Habit }>(`/api/habits/${habitId}`),
      $fetch<{ id: string; name: string; icon: string }[]>('/api/categories')
    ]);

    return {
      habit: habitRes.data,
      categories: categoriesRes.map(item => ({
        id: item.id,
        name: item.name,
        icon: item.icon
      }))
    };
  },
  {
    default: () => ({ habit: null, categories: [] })
  }
);

const habit = computed(() => combinedData.value.habit)
const categories = computed(() => combinedData.value.categories)

useHead({
  title: computed(() => habit.value?.name || 'Habit')
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

<style scoped></style>