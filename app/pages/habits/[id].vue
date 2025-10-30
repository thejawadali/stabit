<template>
  <HabitForm 
    :habit="habit"
    :categories="categories || []"
    :is-edit-mode="true"
    :loading="false"
    @update="handleUpdate" 
  />
</template>

<script setup lang="ts">
import type { Habit } from "@prisma/client"

const route = useRoute()
const habitId = route.params.id as string

interface CombinedData {
  habit: Habit | null;
  categories: { id: string; name: string; icon: string }[];
}


const { data: combinedData } = await useAsyncData<CombinedData>(
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
  title: habit.value?.name || 'Habit'
})


function handleUpdate() {
  console.log('Update triggered for habit:', habitId)
}
</script>

<style scoped></style>