<template>
  <Dialog :open="showPreview" @update:open="showPreview = $event">
    <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Habit Summary</DialogTitle>
        <DialogDescription>
          Review your habit details before saving
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- General -->
        <div>
          <h3 class="font-semibold mb-3 flex items-center gap-2">
            <span class="text-2xl">{{ formData.icon }}</span>
            {{ formData.name || "Untitled Habit" }}
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Category:</span>
              <Badge>{{ categories.find(c => c.id === formData.categoryId)?.name || "Not set" }}</Badge>
            </div>
            <div v-if="formData.description">
              <span class="text-muted-foreground">Description:</span>
              <p class="mt-1">{{ formData.description }}</p>
            </div>
          </div>
        </div>

        <!-- Schedule -->
        <div class="border-t pt-4">
          <h4 class="font-semibold mb-2">Schedule</h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Recurrence:</span>
              <span class="capitalize">{{ formData.recurrenceType }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Time:</span>
              <span>{{ formData.timeOfDay }}</span>
            </div>
          </div>
        </div>

        <!-- Growth & Goal -->
        <div class="border-t pt-4">
          <h4 class="font-semibold mb-2">Growth & Goal</h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Starting Value:</span>
              <span>{{ formData.initialValue }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Increase Rate:</span>
              <span>+{{ formData.difficultyRate }} per week</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Goal:</span>
              <span>{{ formData.goalValue }} {{ formData.goalMetric }}</span>
            </div>
          </div>
        </div>

        <!-- Custom Fields -->
        <div v-if="customFields.length > 0" class="border-t pt-4">
          <h4 class="font-semibold mb-2">
            Custom Fields ({{ customFields.length }})
          </h4>
          <div class="space-y-1 text-sm">
            <div v-for="field in customFields" :key="field.id" class="flex justify-between">
              <span class="text-muted-foreground">{{ field.title }}:</span>
              <Badge variant="secondary">{{ field.type }}</Badge>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="border-t pt-4">
          <h4 class="font-semibold mb-2">Notifications</h4>
          <div class="text-sm">
            <template v-if="formData.enableNotifications">
              <div class="space-y-1">
                <p>Enabled at: {{ formData.reminderTimes?.join(", ") || "Not set" }}</p>
              </div>
            </template>
            <p v-else class="text-muted-foreground">Disabled</p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="showPreview = false">
          Back to Edit
        </Button>
        <Button @click="
          () => {
            showPreview = false
            emit('save')
          }
        ">
          Confirm & Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import type { HabitFormData } from "~~/types"

type CustomField = {
  id: string
  title: string
  type: "text" | "number" | "select" | "boolean"
  options?: string[]
  required: boolean
}

defineProps<{
  formData: HabitFormData
  categories: { id: string, name: string, icon: string }[]
  customFields: CustomField[]
}>()

const emit = defineEmits<{
  save: []
}>()
const showPreview = defineModel<boolean>( { default: false })
</script>

<style scoped>

</style>