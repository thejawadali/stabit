<template>
  <Card>
    <CardHeader>
      <CardTitle>
        <div class="flex items-center justify-between">
          Custom Fields
          <Button type="button" variant="outline" @click="addCustomField">
            <IconPlus class="w-4 h-4 mr-2" />
            Add Custom Field
          </Button>
        </div>
      </CardTitle>
      <p class="text-sm text-muted-foreground">
        Add custom fields unique to this habit that you can track with each session
      </p>
    </CardHeader>
    <CardContent>
      <div ref="customFieldsRef" class="space-y-4">
        <div v-for="(field, index) in customFields" :key="field.id" class="border rounded-lg p-4 space-y-3 bg-background">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <IconGripVertical class="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing handle" />
              <span class="font-medium">
                {{ field.title || `Field ${index + 1}` }}
              </span>
            </div>
            <Button type="button" variant="ghost" size="icon" @click="deleteCustomField(index)">
              <IconTrash2 class="w-4 h-4" />
            </Button>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <Input name="title" label="Field Title" placeholder="e.g., Duration, Mood, Reps" v-model="field.title" />

            <Select name="type" label="Field Type" v-model="field.type">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="boolean">Checkbox/Switch</SelectItem>
              </SelectContent>
            </Select>

          </div>

          <TagsInput v-if="field.type === 'select'" v-model="field.options">
            <TagsInputItem v-for="item in field.options" :key="item" :value="item">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>

            <TagsInputInput placeholder="Options..." />
          </TagsInput>
          
          <Input v-if="field.type !== 'boolean'" name="placeholder" label="Placeholder (optional)" placeholder="e.g., Enter duration in minutes" v-model="field.placeholder" />
          
          <div class="flex items-center gap-2">
            <Switch v-model="field.required" />
            <Label class="font-normal">Required field</Label>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'
const { toast } = useToast()

const customFieldsRef = useTemplateRef<HTMLElement>('customFieldsRef')

const customFields = defineModel<CustomField[]>('customFields', { default: [] })

useSortable(customFieldsRef, customFields, {
  handle: '.handle',
  animation: 200
})

const addCustomField = () => {
  // Check if there's a previous field that's not properly filled
  const previousField = customFields.value[customFields.value.length - 1]
  if (previousField) {
    // Check if title is empty
    if (!previousField.title.trim()) {
      // Show toast error
      toast({
        title: "Validation Error",
        description: "Please fill the field title before adding a new custom field.",
        variant: "destructive"
      })
      return
    }

    // For select fields, check if options are provided
    if (previousField.type === "select" && (!previousField.options || previousField.options.length === 0)) {
      toast({
        title: "Validation Error",
        description: "Please add at least one option for the select field before adding a new custom field.",
        variant: "destructive"
      })
      return
    }
  }

  const newField: CustomField = {
    id: Date.now().toString(),
    title: "",
    type: "text",
    required: false,
    options: [],
    placeholder: "",
  }
  customFields.value.push(newField)
}


const deleteCustomField = (index: number) => {
  customFields.value.splice(index, 1)
}
</script>

<style scoped></style>