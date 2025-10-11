<template>
  <HabitForm :is-edit-mode="false" @save="handleSave" />
</template>

<script setup lang="ts">
function handleSave(andAddAnother: boolean) {
  // Handle save logic here if needed
  // The HabitForm component already handles the main save logic
  console.log('Save triggered:', andAddAnother)
}
</script>

<style scoped></style>