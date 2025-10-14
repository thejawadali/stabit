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
    <CardContent class="space-y-4">
      <div v-for="(field, index) in customFields" :key="field.id" class="border rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <IconGripVertical class="w-4 h-4 text-muted-foreground" />
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
              <SelectItem value="date">Date</SelectItem>
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
        <div class="flex items-center gap-2">
          <Switch v-model="field.required" />
          <Label class="font-normal">Required field</Label>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">

type CustomField = {
  id: string
  title: string
  type: "text" | "number" | "select" | "boolean"
  options?: string[]
  required: boolean
}

const customFields = defineModel<CustomField[]>('customFields', { default: [] })

const addCustomField = () => {
  // if previous field is not filled, show error
  const previousField = customFields.value[customFields.value.length - 1]
  if (previousField && previousField.title === "") {
    // toast.error("Please fill the previous field first")
    console.error("Please fill the previous field first")

    return
  }
  const newField: CustomField = {
    id: Date.now().toString(),
    title: "",
    type: "text",
    required: false,
    options: [],
  }
  customFields.value.push(newField)
}


const deleteCustomField = (index: number) => {
  customFields.value.splice(index, 1)
}
</script>

<style scoped></style>