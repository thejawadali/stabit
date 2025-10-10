<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from "reka-ui"
import { SelectRoot, useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"

interface SelectProps extends SelectRootProps {
  class?: HTMLAttributes["class"]
  placeholder?: string
  name?: string
  label?: string
  rules?: string
  customErrorMessage?: string
  validateOnBlur?: boolean
}

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: '',
  name: '',
  label: '',
  rules: '',
  customErrorMessage: '',
  validateOnBlur: false
})

const emits = defineEmits<SelectRootEmits>()

const { value, errorMessage, validate, handleReset } = useField(props.name || "", props.rules || "")

const modelValue = defineModel<string | number>({ default: '' })

// change value when modelValue changes
syncRefs(modelValue, value)

let resetHasDone = false
onMounted(() => {
  if (!modelValue.value) {
    setTimeout(() => {
      handleReset()
      resetHasDone = true
    })
  }
})

const showError = computed(() => {
  return resetHasDone && errorMessage.value
})

const forwarded = useForwardPropsEmits(props, emits)

const handleBlur = () => {
  if (props.validateOnBlur) {
    validate()
  }
}
</script>

<template>
  <div class="">
    <Label :for="props.name">{{ props.label }} <span v-if="rules.includes('required')"
        class="text-destructive">*</span></Label>
    <SelectRoot :id="props.name" v-bind="forwarded" @blur="handleBlur">
      <slot />
    </SelectRoot>
    <p v-if="showError" class="text-sm text-destructive">{{ customErrorMessage || errorMessage }}</p>
  </div>
</template>
