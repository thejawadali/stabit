<template>
  <div class="flex flex-col sm:flex-row gap-3">
    <!-- Search input -->
    <div class="relative flex-1">
      <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input 
        v-model="searchQuery"
        placeholder="Search habits..." 
        class="pl-10 h-10" 
      />
    </div>

    <!-- Filters and Categories -->
    <div class="flex gap-2">
      <!-- Category Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">
            {{ selectedCategoryLabel }}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuItem 
            @click="onCategoryFilterChange(null)"
            :class="{ 'bg-accent': selectedCategoryId === null }"
          >
            All Categories
          </DropdownMenuItem>
          <DropdownMenuItem 
            v-for="category in categories" 
            :key="category.id"
            @click="onCategoryFilterChange(category.id ?? null)"
            :class="{ 'bg-accent': selectedCategoryId === category.id }"
          >
            {{ category.icon }} {{ category.name }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  categories: Partial<Category>[]
}>(), {
  categories: () => []
})

const searchQuery = defineModel<string>('search', { default: '' })
const selectedCategoryId = defineModel<string | null>('category', { default: null })



const selectedCategoryLabel = computed(() => {
  if (!selectedCategoryId.value) return 'Category'
  const category = props.categories.find(c => c.id === selectedCategoryId.value)
  return category ? `${category.icon} ${category.name}` : 'Category'
})



const onCategoryFilterChange = (categoryId: string | null) => {
  selectedCategoryId.value = categoryId
}
</script>

<style scoped></style>