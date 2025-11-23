<template>
  <TooltipProvider>
    <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
      <DialogContent class="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{habit?.name || 'Record Progress'}}</DialogTitle>
          <DialogDescription>
            {{ habit ? `Track your progress for ${habit?.name}` : "Record your habit completion" }}
          </DialogDescription>
        </DialogHeader>

        <!-- loading skeleton -->
        <div v-if="isLoading" class="flex flex-col gap-4">
          <Skeleton class="w-full h-9 rounded-sm" />
          <Skeleton class="w-full h-9 rounded-sm" />
          <Skeleton class="w-full h-9 rounded-sm" />
          <Skeleton class="w-full h-[78px] rounded-sm" />
        </div>
        <div v-else class="space-y-4">
          <!-- Goal Metric Value -->
          <div v-if="habit?.goalMetric" class="space-y-2">
            <div class="flex items-center justify-between">
              <Label :for="`goal-metric-${habit?.goalMetric}`" class="flex items-center gap-2">
                {{ capitalizeFirst(habit?.goalMetric) }}
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button type="button" class="text-muted-foreground hover:text-foreground">
                      <IconInfo class="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the value you achieved for this habit.</p>
                    <p class="text-xs mt-1">Example: If your goal metric is "Pages", enter how many pages you read.</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div v-if="habit.currentTargetValue && habit.currentTargetValue > 0" class="text-sm text-muted-foreground">
                Target: {{ habit.currentTargetValue }} {{ habit.goalMetric }}
              </div>
            </div>
            <Input 
              :id="`goal-metric-${habit.goalMetric}`" 
              type="number" 
              v-model="goalMetricValue" 
              min="0" 
              :placeholder="`e.g., ${habit.currentTargetValue || 1}`"
            />
            <p v-if="goalMetricValue && habit.currentTargetValue > Number(goalMetricValue)" class="text-xs text-muted-foreground">
              💡 You should add {{ habit.currentTargetValue }} {{ habit.goalMetric }} to complete today's task
            </p>
          </div>

          <!-- Duration -->
          <div class="space-y-2">
            <Label for="duration" class="flex items-center gap-2">
              Duration in Minutes (optional)
              <Tooltip>
                <TooltipTrigger as-child>
                  <button type="button" class="text-muted-foreground hover:text-foreground">
                    <IconInfo class="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How long you spent on this habit.</p>
                  <p class="text-xs mt-1">Optional: Only fill this if you want to track time spent.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input id="duration" type="number" v-model="durationMinutes" min="0" placeholder="e.g., 30" />
          </div>

        <!-- Custom Fields -->
        <template v-if="customFieldsConfig && customFieldsConfig.length > 0">
          <div v-for="fieldConfig in customFieldsConfig" :key="fieldConfig.id" class="space-y-2">
            <!-- Text -->
            <Input v-if="fieldConfig.type === 'text'" :id="`custom-${fieldConfig.id}`" type="text"
              v-model="customFieldsValues[fieldConfig.id]" :placeholder="fieldConfig.placeholder"
              :rules="fieldConfig.isRequired ? 'required' : ''"
              :name="fieldConfig.title.toLowerCase().replace(' ', '_')" :custom-error-message="`${fieldConfig.title} is required`">
              <template #field-label>
                <Label class="flex items-center gap-2">
                  {{ fieldConfig.title }}
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <button type="button" class="text-muted-foreground hover:text-foreground">
                        <IconInfo class="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ fieldConfig.placeholder || `Enter ${fieldConfig.title.toLowerCase()}` }}</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
              </template>
            </Input>

            <!-- Number -->
            <Input v-else-if="fieldConfig.type === 'number'" :id="`custom-${fieldConfig.id}`" type="number"
              v-model="customFieldsValues[fieldConfig.id]" :placeholder="fieldConfig.placeholder"
              :rules="fieldConfig.isRequired ? 'required' : ''"
              :name="fieldConfig.title.toLowerCase().replace(' ', '_')" :custom-error-message="`${fieldConfig.title} is required`">
              <template #field-label>
                <Label class="flex items-center gap-2">
                  {{ fieldConfig.title }}
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <button type="button" class="text-muted-foreground hover:text-foreground">
                        <IconInfo class="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ fieldConfig.placeholder || `Enter ${fieldConfig.title.toLowerCase()}` }}</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
              </template>
            </Input>

            <!-- Select -->
            <Select v-else-if="fieldConfig.type === 'select'" v-model="customFieldsValues[fieldConfig.id]"
              :rules="fieldConfig.isRequired ? 'required' : ''"
              :name="fieldConfig.title.toLowerCase().replace(' ', '_')" :custom-error-message="`${fieldConfig.title} is required`">
              <template #field-label>
                <Label class="flex items-center gap-2">
                  {{ fieldConfig.title }}
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <button type="button" class="text-muted-foreground hover:text-foreground">
                        <IconInfo class="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select an option for {{ fieldConfig.title.toLowerCase() }}</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
              </template>
              <SelectTrigger>
                <SelectValue :placeholder="fieldConfig.placeholder || 'Select an option'" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in (fieldConfig.options as string[])" :key="option" :value="option">
                  {{ option }}
                </SelectItem>
              </SelectContent>
            </Select>

            <!-- checkbox/switch -->
            <div v-else-if="fieldConfig.type === 'boolean'" class="flex items-center justify-between">
              <Label :for="`custom-${fieldConfig.id}`" class="flex items-center gap-2">
                {{ fieldConfig.title }}
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button type="button" class="text-muted-foreground hover:text-foreground">
                      <IconInfo class="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle {{ fieldConfig.title.toLowerCase() }}</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Switch :id="`custom-${fieldConfig.id}`" v-model="customFieldsValues[fieldConfig.id]" />
            </div>
          </div>
        </template>

          <!-- Notes -->
          <div class="space-y-2">
            <Label for="notes" class="flex items-center gap-2">
              Notes (optional)
              <Tooltip>
                <TooltipTrigger as-child>
                  <button type="button" class="text-muted-foreground hover:text-foreground">
                    <IconInfo class="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add any additional notes about your progress.</p>
                  <p class="text-xs mt-1">Optional: Use this to record how you felt or any observations.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Textarea id="notes" v-model="notes" placeholder="How did it go?" rows="3" />
          </div>
        </div>

        <DialogFooter>
          <Button @click="handleSubmit" class="flex-1" :is-loading="isSubmitting || isLoading">
            Save Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </TooltipProvider>
</template>

<script setup lang="ts">
const { validate } = useForm()
// Props
const props = defineProps<{
  habit: { id: string, name: string, goalMetric: string; currentTargetValue: number } | null
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const isDialogOpen = defineModel<boolean>('isDialogOpen', { default: false })

const { toast } = useToast()

// Reactive state
const goalMetricValue = ref<string>("")
const durationMinutes = ref<string>("")
const notes = ref<string>("")
const customFieldsValues = reactive<Record<string, any>>({})
const customFieldsConfig = ref<any[]>([])
const isSubmitting = ref(false)
const isLoading = ref(false)

// Helper function to capitalize first letter of each word
function capitalizeFirst(str: string) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Watch for dialog open/close changes
watch(isDialogOpen, (open) => {
  if (open && props.habit?.id) {
    fetchCustomFields()
  } else {
    // Reset form when closing
    goalMetricValue.value = ""
    durationMinutes.value = ""
    notes.value = ""
    Object.keys(customFieldsValues).forEach((key) => (customFieldsValues[key] = ""))
  }
})

async function fetchCustomFields() {
  if (!props.habit) return
  isLoading.value = true

  try {
    const response = await $fetch<{ success: boolean; data: any[] }>(`/api/habits/${props.habit.id}/custom-fields`)

    if (!response.success || !response.data) {
      throw new Error("Failed to fetch custom fields")
    }

    customFieldsConfig.value = response.data

    // Initialize custom fields values
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((field: any) => {
        customFieldsValues[field.id] = ""
      })
    }

  } catch (err) {
    console.error("Error fetching custom fields:", err)
    toast({
      title: "Error",
      description: "Failed to load custom fields. Please try again.",
      variant: "destructive",
    })
  } finally {
    isLoading.value = false
  }
}

async function handleSubmit() {
  const { valid } = await validate()
  if (!valid) return

  isSubmitting.value = true

  try {
    const response = await $fetch<{ success: boolean; message?: string; data?: any }>('/api/habit-logs', {
      method: 'POST',
      body: {
        habitId: props.habit?.id,
        value: goalMetricValue.value ? parseInt(goalMetricValue.value) : 0,
        durationMinutes: durationMinutes.value ? parseInt(durationMinutes.value) : null,
        notes: notes.value.trim() || null,
        customFields: Object.keys(customFieldsValues).length > 0 ? { ...customFieldsValues } : null,
      },
    })

    if (!response.success) {
      throw new Error(response.message || "Failed to create habit log")
    }
    emit('refresh')
    toast({
      title: "Success",
      description: response.message || "Progress recorded successfully",
    })

    // Reset form
    goalMetricValue.value = ""
    durationMinutes.value = ""
    notes.value = ""
    Object.keys(customFieldsValues).forEach((key) => (customFieldsValues[key] = ""))

    
    isDialogOpen.value = false
  } catch (err: any) {
    console.error("Error logging habit:", err)
    const errorMessage = err?.data?.message || err?.message || "Failed to record progress. Please try again."
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>