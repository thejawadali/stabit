<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <IconTrendingUp class="w-5 h-5" />
        Difficulty & Growth Settings
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-4">
        <Label class="text-base flex items-center gap-2">
          <IconTarget class="w-5 h-5" />
          Goal Definition
        </Label>
      </div>

      <!-- goal metric -->
      <div class="space-y-2">
        <Select name="goalMetric" v-model="selectValue" label="Goal Metric">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="metric in predefinedMetrics" :key="metric" :value="metric" class="capitalize">{{ metric }}</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        
        <!-- Custom goal metric input -->
        <Input 
          v-if="showCustomInput"
          v-model="customGoalMetric"
          name="customGoalMetric"
          label="Custom Goal Metric"
          placeholder="e.g., pushups, books, calories"
          @update:model-value="(value: string | number) => handleCustomMetricChange(String(value))"
        />
      </div>

      <!-- goal value -->
      <Input name="goalValue" type="number" placeholder="e.g., 100" v-model="goalValue" label="Ultimate Goal" />


      <!-- estimated completion date -->
      <DatePicker label="Estimated Completion Date" v-model="estimatedDate" />
      <div class=" grid grid-cols-2 gap-4 lg:grid-cols-2">
        <!-- initial value -->
        <Input name="initialValue" label="Initial Value / Starting Point" type="number" placeholder="e.g., 5 pushups"
          v-model="initialValue" />

        <!-- difficulty rate -->
        <Input label="Difficulty Increase Rate" name="difficultyRate" type="number" placeholder="e.g., +1"
          v-model="difficultyRate">
        <template #suffix>
          <span class="text-sm text-muted-foreground w-20">per week</span>
        </template>
        </Input>
      </div>

      <!-- TODO: in phase 2
             <div class="flex items-center justify-between">
              <div>
                <Label for="autoGrowth" class="text-base">Auto-Growth</Label>
                <p class="text-sm text-muted-foreground">Automatically increase difficulty over time</p>
              </div>
              <Switch id="autoGrowth" v-model="formData.autoGrowth" />
            </div> -->

    </CardContent>
  </Card>
</template>

<script setup lang="ts">

const initialValue = defineModel<number>('initialValue')
const difficultyRate = defineModel<number>('difficultyRate')
const goalValue = defineModel<number>('goalValue')
const goalMetric = defineModel<string>('goalMetric')
const estimatedDate = defineModel<Date>('estimatedDate', {
  default: new Date()
})

const predefinedMetrics = ['sessions', 'days', 'hours', 'repetitions', 'pages', 'miles']
const customGoalMetric = ref('')

// Computed property to determine what to show in the select
const selectValue = computed({
  get: () => {
    if (!goalMetric.value) return 'sessions'
    return predefinedMetrics.includes(goalMetric.value) ? goalMetric.value : 'custom'
  },
  set: (value: string) => {
    handleSelectChange(value)
  }
})

// Computed property to determine if custom input should be shown
const showCustomInput = computed(() => {
  return selectValue.value === 'custom' || (goalMetric.value && !predefinedMetrics.includes(goalMetric.value))
})

// Handle select dropdown changes
function handleSelectChange(value: string) {
  if (value === 'custom') {
    // If switching to custom, preserve existing custom value if it exists
    if (goalMetric.value && !predefinedMetrics.includes(goalMetric.value)) {
      customGoalMetric.value = goalMetric.value
    } else {
      customGoalMetric.value = ''
      goalMetric.value = 'custom'
    }
  } else {
    // Predefined value selected, update goalMetric directly
    customGoalMetric.value = ''
    goalMetric.value = value
  }
}

// Handle custom metric input changes
function handleCustomMetricChange(value: string) {
  customGoalMetric.value = value
  if (value.trim()) {
    goalMetric.value = value.trim().toLowerCase()
  } else {
    // If cleared, keep as 'custom' placeholder
    goalMetric.value = 'custom'
  }
}

// Initialize customGoalMetric if goalMetric is already a custom value
onMounted(() => {
  if (goalMetric.value && !predefinedMetrics.includes(goalMetric.value)) {
    customGoalMetric.value = goalMetric.value
  }
})

</script>

<style scoped></style>