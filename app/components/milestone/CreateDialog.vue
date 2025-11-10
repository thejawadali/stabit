<template>
  <Dialog :open="isAddDialogOpen" @update:open="isAddDialogOpen = $event">
    <DialogContent class="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Create New Milestone</DialogTitle>
        <DialogDescription>
          Set up a new milestone and reward for your habit
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="py-4 grid grid-cols-2 gap-4">
        <!-- milestone name -->
        <div class="col-span-2">
          <Input name="name" v-model="formData.name" label="Milestone Name" placeholder="e.g., First 10 Sessions" rules="required" custom-error-message="Please enter a milestone name" />
        </div>

        <!-- habit -->
        <Select name="habitId" v-model="formData.habitId" label="Habit" rules="required" custom-error-message="Please select a habit">
          <SelectTrigger>
            <SelectValue placeholder="Select habit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="habit in habits" :key="habit.id" :value="habit.id">
              {{ habit.icon }} {{ habit.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        
        <!-- icon -->
        <IconPicker name="rewardIcon" v-model="formData.rewardIcon" label="Icon" />

        <!-- reward -->
        <Input name="rewardName" v-model="formData.rewardName" label="Reward" placeholder="e.g., Weekend Treat" rules="required" custom-error-message="Please enter a reward name" />

        <!-- target value -->
        <Input name="targetValue" v-model.number="formData.targetValue" label="Target Value" type="number" placeholder="10"
          rules="required" custom-error-message="Please enter a target value" />

        <!-- milestone description -->
        <Textarea v-model="formData.description" label="Milestone Description"
          placeholder="Describe your milestone..." />
        
        <!-- reward description -->
        <Textarea v-model="formData.rewardDescription" label="Reward Description" placeholder="Describe your reward..." />

        <DialogFooter class="col-span-2">
          <Button type="button" variant="outline" @click="isAddDialogOpen = false" :disabled="loading">
            Cancel
          </Button>
          <Button type="submit" :is-loading="loading">
            <span>Create Milestone</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
const { toast } = useToast()
const isAddDialogOpen = defineModel<boolean>('isAddDialogOpen', { default: false })

const emit = defineEmits<{
  created: []
}>()

const formData = reactive({
  name: '',
  description: '',
  habitId: '',
  targetValue: 10,
  rewardName: '',
  rewardDescription: '',
  rewardIcon: '🎉'
})

const loading = ref(false)

withDefaults(defineProps<{
  habits?: HabitListItem[]
}>(), {
  habits: () => []
})

const {validate} = useForm()
const handleSubmit = async () => {
  const { valid } = await validate()
  if (!valid) return
  loading.value = true
  try {
    await $fetch('/api/milestones', {
      method: 'POST',
      body: formData
    })

    toast({
      title: 'Success',
      description: 'Milestone created successfully'
    })

    // Reset form
    formData.name = ''
    formData.description = ''
    formData.habitId = ''
    formData.targetValue = 10
    formData.rewardName = ''
    formData.rewardDescription = ''
    formData.rewardIcon = '🎉'

    isAddDialogOpen.value = false
    emit('created')
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.data?.message || 'Failed to create milestone',
      variant: 'destructive'
    })
  } finally {
    loading.value = false
  }
}

// Reset form when dialog closes
watch(isAddDialogOpen, (open) => {
  if (!open) {
    formData.name = ''
    formData.description = ''
    formData.habitId = ''
    formData.targetValue = 10
    formData.rewardName = ''
    formData.rewardDescription = ''
    formData.rewardIcon = '🎉'
  }
})
</script>

<style scoped></style>