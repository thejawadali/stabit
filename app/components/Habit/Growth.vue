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
      <Select name="goalMetric" v-model="goalMetric" label="Goal Metric">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sessions">Sessions</SelectItem>
          <SelectItem value="days">Days</SelectItem>
          <SelectItem value="hours">Hours</SelectItem>
          <SelectItem value="repetitions">Repetitions</SelectItem>
          <SelectItem value="pages">Pages</SelectItem>
          <SelectItem value="miles">Miles</SelectItem>
        </SelectContent>
      </Select>

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

</script>

<style scoped></style>