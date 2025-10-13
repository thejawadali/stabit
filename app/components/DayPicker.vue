<template>
  <div>
    <h2>Day Picker - {{ date }}</h2>
    <VueDatePicker v-model="date" multi-dates />
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'


const date = ref()


</script>

<style scoped></style>