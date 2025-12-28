<template>
  <main class="container mx-auto p-6 w-full max-w-5xl">
    <div class="flex items-start gap-x-4 mb-6">
      <Button v-if="isEditMode" variant="ghost" size="icon" @click="router.push('/habits')">
        <IconArrowLeft class="h-5 w-5" />
      </Button>
      <div>
        <h1 class="text-3xl font-bold">
          {{ isEditMode ? "Edit Habit" : "Create New Habit" }}
        </h1>
        <p class="text-muted-foreground mt-1">
          {{ isEditMode ? "Update your habit details" : "Set up a new habit to track" }}
        </p>
      </div>
    </div>

    <Tabs defaultValue="general" class="space-y-6 w-full">
      <TabsList class="grid w-full grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="growth">Growth</TabsTrigger>
        <TabsTrigger value="custom">Custom Fields</TabsTrigger>
      </TabsList>

      <!-- General Information -->
      <TabsContent value="general" class="space-y-4">
        <HabitGeneralInfo v-model:icon="formData.icon" v-model:name="formData.name"
          v-model:categoryId="formData.categoryId" v-model:description="formData.description"
          :categories="categories" />
      </TabsContent>

      <!-- Schedule & Frequency  -->
      <TabsContent value="schedule" class="space-y-4">
        <HabitSchedule v-model:frequency="formData.frequency" v-model:timeOfDay="formData.timeOfDay"
          v-model:notificationsEnabled="formData.enableNotifications" v-model:reminderTimes="formData.reminderTimes" />
      </TabsContent>

      <!-- Difficulty & Growth -->
      <TabsContent value="growth" class="space-y-4">
        <HabitGrowth v-model:initialValue="formData.initialValue" v-model:difficultyRate="formData.difficultyRate"
          v-model:goalValue="formData.goalValue" v-model:goalMetric="formData.goalMetric"
          v-model:customGoalMetric="formData.customGoalMetric"
          v-model:estimatedDate="formData.estimatedCompletionDate" />
      </TabsContent>

      <!-- Custom Fields -->
      <TabsContent value="custom" class="space-y-4">
        <HabitCustomFields v-model:customFields="customFields" />
      </TabsContent>
    </Tabs>

    <!-- Action Buttons -->
    <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-3 mt-4 lg:mt-6">
      <Button variant="outline" @click="navigateTo('/habits')" class="w-full md:w-auto">
        Cancel
      </Button>
      <div class="flex flex-col-reverse md:flex-row items-center gap-3 w-full md:w-auto">
        <Button variant="outline" @click="showPreview = true" :is-loading="loading" class="w-full md:w-auto">
          Preview Summary
        </Button>
        <Button :is-loading="loading" @click="handleSave" class="w-full md:w-auto">
          <IconSave class="w-4 h-4 mr-2" />
          {{ isEditMode ? "Update Habit" : "Save Habit" }}
        </Button>
      </div>
    </div>
  </main>

  <HabitPreviewDialog v-model="showPreview" :formData="formData" :categories="categories" :customFields="customFields"
    @save="handleSave" />
</template>

<script setup lang="ts">

const router = useRouter()

const { validate } = useForm()
const INITIAL_FORM_DATA: HabitFormData = {
  name: "",
  categoryId: "", // categoryId
  description: "",
  icon: "🎯",

  frequency: "daily" as Frequency,
  timeOfDay: "19:00",
  reminderTimes: ["09:00"],
  enableNotifications: true,

  goalMetric: "sessions",
  customGoalMetric: "",
  goalValue: 0,
  estimatedCompletionDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
  initialValue: 0,
  difficultyRate: 1,
}

// Props
interface Props {
  categories: { id: string, name: string, icon: string }[]
  isEditMode?: boolean
  loading?: boolean
  habit?: Habit | null
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  loading: false,
  habit: null
})

// Emits
const emit = defineEmits<{
  save: [HabitFormData]
  update: [HabitFormData]
}>()

const showPreview = ref(false)



// Initialize form data to initial state
const formData = reactive<HabitFormData>(INITIAL_FORM_DATA)

const customFields = ref<CustomField[]>([])


onMounted(() => {
  if (props.isEditMode && props.habit) {
    Object.assign(formData, props.habit)
    
    // Handle custom goal metric using composable
    const parsed = parseGoalMetricFromApi(formData.goalMetric)
    formData.goalMetric = parsed.goalMetric
    formData.customGoalMetric = parsed.customGoalMetric
    
    // Map custom fields from API format to component format
    const apiCustomFields = (props.habit as any).customFields || []
    customFields.value = apiCustomFields.map((field: any) => ({
      id: field.id,
      title: field.title,
      type: field.type,
      options: field.options || [],
      placeholder: field.placeholder || "",
      required: field.isRequired || false,
    }))
  } else if (!props.isEditMode) {
    // For create mode, use default values
    resetToDefaults()
  }
})


function resetToDefaults() {
  Object.assign(formData, INITIAL_FORM_DATA)
  customFields.value = []
}

async function handleSave() {
  const { valid } = await validate()
  if (!valid) return

  const cleanFields = customFields.value
    .filter(({ title = "" }) => title.trim() !== "")
    .map(({ title, type, options, placeholder, required }, index) => ({
      sortingOrder: index + 1,
      title: title.trim(),
      type: type as FieldType,
      options: options || [],
      placeholder: placeholder?.trim() || null,
      isRequired: !!required,
    }))

  // Prepare goal metric for API using composable
  const finalGoalMetric = prepareGoalMetricForApi(formData.goalMetric || '', formData.customGoalMetric || '')

  const payload = {
    ...formData,
    goalMetric: finalGoalMetric,
    customFields: cleanFields,
  }

  // Remove customGoalMetric from payload as API doesn't need it
  delete (payload as any).customGoalMetric

  if (props.isEditMode) {
    emit('update', payload)
  } else {
    emit('save', payload)
  }
}


</script>