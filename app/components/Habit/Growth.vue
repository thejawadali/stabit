<template>
  <TooltipProvider>
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <IconTrendingUp class="w-5 h-5" />
          Difficulty & Growth Settings
        </CardTitle>
      </CardHeader>
      <CardContent class="grid grid-cols-2 gap-4">
        <Label class="text-base flex items-center gap-2 col-span-2">
          <IconTarget class="w-5 h-5" />
          Goal Definition
        </Label>

        <!-- goal metrics -->
        <div class="flex gap-4 col-span-2">
          <!-- goal metric -->
          <div class="w-full">
            <Select name="goalMetric" v-model="goalMetric">
              <template #field-label>
                <Label class="flex items-center gap-x-1">
                  Goal Metric
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <button type="button" class="text-muted-foreground hover:text-foreground">
                        <IconInfo class="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The unit of measurement for tracking your habit progress.</p>
                      <p class="text-xs mt-1">Examples: Pages (for reading), Repetitions (for exercises), Minutes (for
                        meditation)</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
              </template>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="metric in PREDEFINED_METRICS" :key="metric.value" :value="metric.value">
                  {{ metric.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <!-- Custom goal metric input -->
          <div class="[&_label]:flex w-full" v-if="goalMetric === 'custom'">
            <Input v-model="customGoalMetric" name="customGoalMetric" label="Custom Goal Metric"
              placeholder="e.g., pushups, books, calories"
              @update:model-value="(value: string | number) => handleCustomMetricChange(String(value))" />
          </div>
        </div>

        <!-- initial value -->
        <Input name="initialValue" type="number" placeholder="e.g., 5 pushups" v-model="initialValue">
        <template #field-label>
          <Label class="flex items-center gap-2">
            Initial Rate / Starting Point
            <Tooltip>
              <TooltipTrigger as-child>
                <button type="button" class="text-muted-foreground hover:text-foreground">
                  <IconInfo class="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>How much you can currently do at the beginning.</p>
                <p class="text-xs mt-1">Example: If you can read 2 pages now, enter 2. This will be your starting
                  target.</p>
              </TooltipContent>
            </Tooltip>
          </Label>
        </template>
        </Input>

        <!-- difficulty rate -->
        <Input name="difficultyRate" type="number" placeholder="e.g., +1" v-model="difficultyRate">
        <template #field-label>
          <Label class="flex items-center gap-2">
            Difficulty Rate Per Week
            <Tooltip>
              <TooltipTrigger as-child>
                <button type="button" class="text-muted-foreground hover:text-foreground">
                  <IconInfo class="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>How much you want to increase your target each week.</p>
                <p class="text-xs mt-1">Example: If you want to read 1 more page per week, enter 1. Your target will
                  automatically increase every 7 days.</p>
              </TooltipContent>
            </Tooltip>
          </Label>
        </template>
        <!-- <template #suffix>
          <span class="text-sm text-muted-foreground w-20">per week</span>
        </template> -->
        </Input>

        <!-- ultimate goal -->
        <Input name="goalValue" type="number" placeholder="e.g., 100" v-model="goalValue">
          <template #field-label>
            <Label class="flex items-center gap-2">
              Ultimate Goal
              <Tooltip>
                <TooltipTrigger as-child>
                  <button type="button" class="text-muted-foreground hover:text-foreground">
                    <IconInfo class="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The final target value you want to achieve for this habit.</p>
                  <p class="text-xs mt-1">Example: If your goal metric is "Pages", enter how many pages you ultimately
                    want to read per session.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
          </template>
        </Input>

        <!-- estimated completion date -->
        <DatePicker label="Estimated Completion Date" v-model="estimatedDate" />

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
  </TooltipProvider>
</template>

<script setup lang="ts">

const initialValue = defineModel<number>('initialValue')
const difficultyRate = defineModel<number>('difficultyRate')
const goalValue = defineModel<number>('goalValue')
const goalMetric = defineModel<string>('goalMetric')
const customGoalMetric = defineModel<string>('customGoalMetric', { default: '' })
const estimatedDate = defineModel<Date>('estimatedDate', {
  default: new Date()
})

// Handle custom metric input changes
function handleCustomMetricChange(value: string) {
  const trimmedValue = value.trim().toLowerCase()
  if (!trimmedValue) {
    customGoalMetric.value = ''
    return
  }

  const matchingMetric = PREDEFINED_METRICS.find(metric => metric.value === trimmedValue)
  if (matchingMetric) {
    // metric already exists, update goalMetric with the matching value
    goalMetric.value = matchingMetric.value
    customGoalMetric.value = ''
  } else {
    // Update customGoalMetric with the trimmed value
    customGoalMetric.value = value.trim()
  }
}

</script>

<style scoped></style>