<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = withDefaults(defineProps<{
  class?: HTMLAttributes["class"],
  placeholder?: string,
  name?: string,
  label?: string,
  rules?: string,
  customErrorMessage?: string,
  validateOnBlur?: boolean
}>(), {
  placeholder: '',
  name: '',
  label: '',
  rules: '',
  customErrorMessage: '',
  validateOnBlur: false
})

const { value, errorMessage, validate, handleReset } = useField(props.name || "", props.rules || "")

const modelValue = defineModel<string | number>({ default: '' })

// change value when modelValue changes
syncRefs(modelValue, value)


onMounted(() => {
  if (!modelValue.value) {
    setTimeout(handleReset)
  }
})


const inputClasses = computed(() => {
  const baseClasses = 'flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 mt-1'
  const borderClass = errorMessage.value ? 'border-destructive' : 'border-input focus-visible:ring-1 focus-visible:ring-ring'
  return cn(baseClasses, borderClass, props.class)
})
</script>

<template>
  <div class="">
    <Label :for="props.name">{{ props.label }} <span v-if="rules.includes('required')"
        class="text-destructive">*</span></Label>
    <input :id="props.name" v-model="modelValue" :class="inputClasses" :placeholder="props.placeholder"
      @blur="validateOnBlur ? validate() : null">
    <p v-if="errorMessage" class="text-sm text-destructive">{{ customErrorMessage || errorMessage }}</p>
  </div>
</template>
