<template>
  <div class="space-y-1">
    <Label v-if="label" :for="name">{{ label }} <span v-if="required" class="text-destructive">*</span></Label>
    <div class="flex items-center gap-4">
      <Popover v-model:open="isPopoverOpen">
        <PopoverTrigger as-child>
          <button class="border rounded-md px-3 py-[5px] border-input" :id="name">
            {{ modelValue || defaultIcon }}
          </button>
        </PopoverTrigger>
        <PopoverContent class="w-80 p-4" align="start">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-sm">Select Icon</h4>
              <Button v-if="allowCustom" type="button" variant="ghost" size="sm"
                @click="showCustomInput = !showCustomInput">
                {{ showCustomInput ? 'Pick from list' : 'Custom' }}
              </Button>
            </div>

            <!-- Custom Input -->
            <div v-if="showCustomInput" class="space-y-2">
              <Input v-model="customIconValue" placeholder="Enter emoji (e.g., 🎉)" maxlength="2"
                @update:model-value="handleCustomIconChange" />
              <p class="text-xs text-muted-foreground">Enter a single emoji character</p>
            </div>

            <!-- Emoji Grid -->
            <div v-else class="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
              <Button v-for="emoji in emojiOptions" :key="emoji" type="button" variant="ghost"
                class="text-2xl h-12 w-12 p-0 hover:bg-accent" @click="handleEmojiSelect(emoji)">
                {{ emoji }}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <div v-if="modelValue" class="text-sm text-muted-foreground">
        Click to change
      </div>
    </div>
    <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  name?: string
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  allowCustom?: boolean
  defaultIcon?: string
  emojiOptions?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  name: '',
  required: false,
  size: 'md',
  allowCustom: true,
  defaultIcon: '🎯',
  emojiOptions: () => [
    "📚", "🏃", "💪", "🎯", "🧘", "💧", "🎨", "🎵",
    "✍️", "🍎", "🌱", "🔥", "⭐", "🎮", "📱", "💼",
    "🏋️", "🚴", "🏊", "🧗", "🎪", "🎭", "🎬", "🎤",
    "🎸", "🎹", "🎺", "🎻", "🥁", "🎲", "🎳", "🏀",
    "⚽", "🏈", "⚾", "🎾", "🏐", "🏓", "🏸", "🥊",
    "🥋", "⛸️", "🎿", "⛷️", "🏂", "🏄", "🏇", "🚣",
    "🚵", "🏔️", "⛰️", "🌋", "🏕️", "🏖️", "🏜️", "🏝️",
    "🏞️", "🏟️", "🏛️", "🏗️", "🏘️", "🏚️", "🏠", "🏡",
    "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪",
    "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽",
    "⛪", "🕌", "🕍", "⛩️", "🕋", "⛲", "⛺", "🌁",
    "🌃", "🌄", "🌅", "🌆", "🌇", "🌉", "♨️", "🎠",
    "🎡", "🎢", "💈", "🎪", "🚂", "🚃", "🚄", "🚅",
    "🚆", "🚇", "🚈", "🚉", "🚊", "🚝", "🚞", "🚋",
    "🚌", "🚍", "🚎", "🚐", "🚑", "🚒", "🚓", "🚔",
    "🚕", "🚖", "🚗", "🚘", "🚙", "🚚", "🚛", "🚜",
    "🚲", "🛴", "🛵", "🛶", "🛸", "🛹", "🛺", "🎉",
    "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉", "🎖️",
    "🏅", "🎗️", "🎟️", "🎫", "🎟️", "🎪", "🎭", "🎨",
    "🎬", "🎤", "🎧", "🎼", "🎵", "🎶", "🎹", "🥁",
    "🎷", "🎺", "🎻", "🪗", "🎸", "🪕", "🎻", "🎤",
    "🎧", "🎼", "🎵", "🎶", "🎹", "🥁", "🎷", "🎺"
  ]
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showCustomInput = ref(false)
const customIconValue = ref('')
const isPopoverOpen = ref(false)

const errorMessage = computed(() => {
  // Add validation logic if needed
  return ''
})

function handleEmojiSelect(emoji: string) {
  emit('update:modelValue', emoji)
  showCustomInput.value = false
  isPopoverOpen.value = false
}

function handleCustomIconChange(value: string | number) {
  const stringValue = String(value)
  if (stringValue.trim()) {
    emit('update:modelValue', stringValue.trim())
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue && !props.emojiOptions.includes(newValue)) {
    customIconValue.value = newValue
  }
})
</script>

<style scoped></style>
