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
        <Input v-model="formData.name" label="Milestone Name" placeholder="e.g., First 10 Sessions" rules="required" />

        <!-- icon -->
        <Input v-model="formData.rewardIcon" label="Icon" placeholder="🎉" maxlength="2" />
        
        <!-- habit -->
        <Select v-model="formData.habitId" label="Habit" rules="required">
          <SelectTrigger>
            <SelectValue placeholder="Select habit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="habit in habits" :key="habit.id" :value="habit.id">
              {{ habit.icon }} {{ habit.name }}
            </SelectItem>
          </SelectContent>
        </Select>

        <!-- reward -->
        <Input v-model="formData.rewardName" label="Reward" placeholder="e.g., Weekend Treat" rules="required" />

        <!-- target metric -->
        <Select v-model="formData.targetMetric" label="Target Metric">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sessions">Sessions</SelectItem>
            <SelectItem value="days">Days</SelectItem>
            <SelectItem value="streak">Streak</SelectItem>
            <SelectItem value="minutes">Minutes</SelectItem>
            <SelectItem value="hours">Hours</SelectItem>
          </SelectContent>
        </Select>

        <!-- target value -->
        <Input v-model.number="formData.targetValue" label="Target Value" type="number" placeholder="10"
          rules="required" />

        <!-- milestone description -->
        <Textarea v-model="formData.description" label="Milestone Description"
          placeholder="Describe your milestone..." />
        
        <!-- reward description -->
        <Textarea v-model="formData.rewardDescription" label="Reward Description" placeholder="Describe your reward..." />

        <DialogFooter class="col-span-2">
          <Button type="button" variant="outline" @click="isAddDialogOpen = false" :disabled="loading">
            Cancel
          </Button>
          <Button type="submit" :disabled="loading">
            <span v-if="loading">Creating...</span>
            <span v-else>Create Milestone</span>
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
  targetMetric: 'sessions',
  rewardName: '',
  rewardDescription: '',
  rewardIcon: '🎉'
})

const loading = ref(false)

// Accept habits as prop
interface Habit {
  id: string
  name: string
  icon: string
}

const props = withDefaults(defineProps<{
  habits?: Habit[]
}>(), {
  habits: () => []
})


const handleSubmit = async () => {
  if (!formData.name || !formData.habitId || !formData.targetValue || !formData.rewardName) {
    toast({
      title: 'Validation Error',
      description: 'Please fill in all required fields',
      variant: 'destructive'
    })
    return
  }

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
    formData.targetMetric = 'sessions'
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
    formData.targetMetric = 'sessions'
    formData.rewardName = ''
    formData.rewardDescription = ''
    formData.rewardIcon = '🎉'
  }
})
</script>

<style scoped></style>