<template>
  
  <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
    <DialogContent class="max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Record Progress-isLoading: {{ isLoading }}</DialogTitle>
        <DialogDescription>
          {{ habitName ? `Track your progress for ${habitName}` : "Record your habit completion" }}
        </DialogDescription>
      </DialogHeader>

      <form @submit="handleSubmit" class="space-y-4">
        <!-- Duration -->
        <div class="space-y-2">
          <Label for="duration">Duration in Minutes (optional)</Label>
          <Input id="duration" type="number" v-model="durationMinutes" min="0" placeholder="e.g., 30" />
        </div>

        <!-- Custom Fields -->
        <template v-if="customFieldsConfig && customFieldsConfig.length > 0">
          <div v-for="fieldConfig in customFieldsConfig" :key="fieldConfig.id" class="space-y-2">
            <!-- Text -->
            <Input v-if="fieldConfig.type === 'text'" :id="`custom-${fieldConfig.id}`" type="text"
              v-model="customFieldsValues[fieldConfig.id]" :placeholder="fieldConfig.placeholder"
              :label="fieldConfig.title" :rules="fieldConfig.isRequired ? 'required' : ''"
              :name="fieldConfig.title.toLowerCase().replace(' ', '_')" />

            <!-- Number -->
            <Input v-else-if="fieldConfig.type === 'number'" :id="`custom-${fieldConfig.id}`" type="number"
              v-model="customFieldsValues[fieldConfig.id]" :placeholder="fieldConfig.placeholder"
              :label="fieldConfig.title" :rules="fieldConfig.isRequired ? 'required' : ''"
              :name="fieldConfig.title.toLowerCase().replace(' ', '_')" />

            <!-- Select -->
            <Select v-else-if="fieldConfig.type === 'select'" v-model="customFieldsValues[fieldConfig.id]"
              :rules="fieldConfig.isRequired ? 'required' : ''"
              :name="fieldConfig.title.toLowerCase().replace(' ', '_')" :label="fieldConfig.title">
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
              <Label :for="`custom-${fieldConfig.id}`">
                {{ fieldConfig.title }}
                <span v-if="fieldConfig.isRequired" class="text-destructive">*</span>
              </Label>
              <Switch :id="`custom-${fieldConfig.id}`" v-model="customFieldsValues[fieldConfig.id]" />
            </div>
          </div>
        </template>

        <!-- Notes -->
        <div class="space-y-2">
          <Label for="notes">Notes (optional)</Label>
          <Textarea id="notes" v-model="notes" placeholder="How did it go?" rows="3" />
        </div>
      </form>

      <DialogFooter>
        <Button type="submit" class="flex-1" :loading="isSubmitting || isLoading">
          Save Progress
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  habitId?: string | number
  habitName?: string
}>()

const isDialogOpen = defineModel<boolean>('isDialogOpen', { default: false })

const { toast } = useToast()

// Reactive state
const durationMinutes = ref<string>("")
const notes = ref<string>("")
const customFieldsValues = reactive<Record<string, any>>({})
const customFieldsConfig = ref<any[]>([])
const isSubmitting = ref(false)
const isLoading = ref(false)

// Watch for dialog open/close changes
watch(isDialogOpen, (open) => {
  if (open && props.habitId) {
    fetchCustomFields()
  } else {
    // Reset form when closing
    durationMinutes.value = ""
    notes.value = ""
    Object.keys(customFieldsValues).forEach((key) => (customFieldsValues[key] = ""))
  }
})

async function fetchCustomFields() {
  if (!props.habitId) return
  isLoading.value = true

  try {
    const response = await $fetch<{ success: boolean; data: any[] }>(`/api/habits/${props.habitId}/custom-fields`)

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

async function handleSubmit(e: Event) {
  e.preventDefault()

  if (!props.habitId) {
    toast({
      title: "Error",
      description: "No habit selected",
      variant: "destructive",
    })
    return
  }

  isSubmitting.value = true

  try {
    const response = await $fetch<{ success: boolean; message?: string; data?: any }>('/api/habit-logs', {
      method: 'POST',
      body: {
        habitId: props.habitId,
        durationMinutes: durationMinutes.value ? parseInt(durationMinutes.value) : null,
        notes: notes.value.trim() || null,
        customFields: Object.keys(customFieldsValues).length > 0 ? { ...customFieldsValues } : null,
      },
    })

    if (!response.success) {
      throw new Error(response.message || "Failed to create habit log")
    }

    toast({
      title: "Success",
      description: response.message || "Progress recorded successfully",
    })

    // Reset form
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