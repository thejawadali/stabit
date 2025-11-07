<template>
  <Card>
    <CardHeader>
      <CardTitle>General Information</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <IconPicker v-model="icon" label="Habit Icon" name="icon" />

      <Input label="Habit Name" rules="required" name="name" placeholder="e.g., Daily Reading" validateOnBlur
        v-model="name" customErrorMessage="Please enter a habit name" />

      <Select label="Category" v-model="category" rules="required" name="category"
        placeholder="Select a category" validateOnBlur customErrorMessage="Please select a category">
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.icon }} {{ cat.name }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Textarea name="description" label="Description / Motivation" placeholder="Why is this habit important to you?"
        v-model="description" />

    </CardContent>
  </Card>

</template>

<script setup lang="ts">
const icon = defineModel<string>('icon')
const name = defineModel<string>('name')
const category = defineModel<string>('categoryId')
const description = defineModel<string>('description')

defineProps<{
  categories: {id: string, name: string, icon: string}[]
}>()
</script>

<style scoped></style>