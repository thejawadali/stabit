<script setup lang="ts">
import type { DateValue } from "@internationalized/date"
import { CalendarDate } from '@internationalized/date'
import { cn } from "@/lib/utils"
import dayjs from "dayjs"


// Parent supplies `modelValue` (via defineModel usage)
const modelValue = defineModel<Date | null>('modelValue')

const props = defineProps({
  initialFocus: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  }
})

// Convert parent value (Date | null) → internal CalendarDate | null
const internalValue = computed(() => {
  if (!modelValue.value) return null
  const d = modelValue.value
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
})

// When user selects a date (Calendar gives a DateValue), convert → JS Date and emit
function onSelect(dateValue: DateValue | undefined) {
  if (dateValue) {
    const jsDate = new Date(dateValue.year, dateValue.month - 1, dateValue.day)
    modelValue.value = jsDate
  } else {
    modelValue.value = null
  }
}
</script>


<template>
  <Popover>
    <PopoverTrigger as-child>
      <div class="gap-y-1 flex flex-col">
        <slot name="field-label">
          <Label>{{ props.label }}</Label>
        </slot>
        <Button variant="outline" :class="cn(
          'w-full justify-start text-left font-normal hover:bg-transparent',
          !modelValue && 'text-muted-foreground'
        )">
          <IconCalendar class="mr-2 h-4 w-4" />
          {{ modelValue ? dayjs(modelValue).format('MMMM D, YYYY') : "Pick a date" }}
        </Button>
      </div>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar mode="single" :modelValue="internalValue!" @update:modelValue="onSelect" :initialFocus />
    </PopoverContent>
  </Popover>
</template>