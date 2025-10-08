<template>
  <div class="flex flex-col sm:flex-row gap-3">
    <!-- Search input -->
    <div class="relative flex-1">
      <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input placeholder="Search habits..." class="pl-10 h-10" @input="onSearchChange($event.target.value)" />
    </div>

    <!-- Filters and Categories -->
    <div class="flex gap-2">
      <!-- Filter Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">
            <IconFilter class="w-4 h-4 mr-2" />
            {{ activeFilter === 'all' ? 'All Habits' : activeFilter }}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuItem v-for="filter in filters" :key="filter.value" @click="onFilterChange(filter.value)">
            {{ filter.label }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Category Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">Category</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuItem v-for="category in categories" :key="category">
            {{ category }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
  activeFilter: string
}>(), {
  activeFilter: 'all'
})

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Active Streaks', value: 'streaks' },
]

const categories = ['Health', 'Learning', 'Mindfulness', 'Productivity']

const onSearchChange = (value: string) => {
  console.log(value)
  // Handle search input change
}

const onFilterChange = (filter: string) => {
  console.log(filter)
  // Handle filter change
};

</script>

<style scoped></style>