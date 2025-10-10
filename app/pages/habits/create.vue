<template>
  <main class="container mx-auto p-6 w-full max-w-5xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">
          {{ editMode ? "Edit Habit" : "Create New Habit" }}
        </h1>
        <p class="text-muted-foreground mt-1">
          {{ editMode ? "Update your habit details" : "Set up a new habit to track" }}
        </p>
      </div>
      <Button variant="ghost" @click="navigateTo('/habits')">
        <IconX class="w-4 h-4 mr-2" />
        Cancel
      </Button>
    </div>

    <Tabs defaultValue="general" class="space-y-6 w-full">
      <TabsList class="grid w-full grid-cols-5">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="growth">Growth</TabsTrigger>
        <TabsTrigger value="custom">Custom Fields</TabsTrigger>
        <TabsTrigger value="rewards">Rewards</TabsTrigger>
      </TabsList>

      <!-- General Information -->
      <TabsContent value="general" class="space-y-4">
        <HabitGeneralInfo v-model:icon="formData.icon" v-model:name="formData.name" v-model:category="formData.category" v-model:description="formData.description" :categories="cateogries" />
      </TabsContent>


      <!-- Schedule & Recurrence  -->
      <TabsContent value="schedule" class="space-y-4">
        <HabitSchedule v-model:recurrenceType="formData.recurrenceType" v-model:timeOfDay="formData.timeOfDay" v-model:startDate="formData.startDate" v-model:endDate="formData.endDate" v-model:notificationsEnabled="formData.notificationsEnabled" v-model:reminderTimes="formData.reminderTimes" v-model:missedYesterday="formData.smartReminders.missedYesterday" v-model:streakContinuation="formData.smartReminders.streakContinuation" />
      </TabsContent>

      <!-- Difficulty & Growth -->
      <TabsContent value="growth" class="space-y-4">
        <HabitGrowth v-model:initialValue="formData.initialValue" v-model:difficultyRate="formData.difficultyRate" v-model:goalValue="formData.goalValue" v-model:goalMetric="formData.goalMetric" v-model:estimatedDate="formData.estimatedDate" />
      </TabsContent>


      <!-- Custom Fields -->
      <TabsContent value="custom" class="space-y-4">
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
                <Input name="title" label="Field Title" placeholder="e.g., Duration, Mood, Reps"
                  v-model="field.title" />

                <Select name="type" label="Field Type" v-model="field.type">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
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
                <Switch />
                <Label class="font-normal">Required field</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>


      <!-- Rewards & Milestones -->
      <TabsContent value="rewards" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <IconGift class="w-5 h-5" />
                  Rewards & Milestones
                </span>
                <Button type="button" variant="outline" @click="addReward">
                  <IconPlus class="w-4 h-4 mr-2" />
                  Add Reward
                </Button>
              </div>
            </CardTitle>
            <p class="text-sm text-muted-foreground">
              Define rewards for reaching milestones to stay motivated
            </p>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-for="(reward, index) in rewards" :key="reward.id" class="border rounded-lg p-4 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">{{ reward.icon }}</span>
                  <!-- <span class="font-medium">Reward {{ index + 1 }}</span> -->
                  <span class="font-medium">
                    {{ reward.name || `Reward ${index + 1}` }}
                  </span>
                </div>
                <Button type="button" variant="ghost" size="icon" @click="deleteReward(index)">
                  <IconTrash2 class="w-4 h-4" />
                </Button>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="col-span-2">
                  <Input name="reward_name" label="Reward Name" placeholder="e.g., Cheat Meal, Movie Night"
                  v-model="reward.name"/>
                </div>
                <div class="space-y-2">
                  <Input type="number" label="Milestone Value" placeholder="e.g., 10" v-model="reward.milestoneValue" />
                  <p class="text-xs text-muted-foreground">After how many {{ formData.goalMetric }}?</p>
                </div>
                <Select name="icon" label="Icon" v-model="reward.icon">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="icon in icons" :key="icon" :value="icon">
                      {{ icon }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">

                <Textarea placeholder="Describe your reward..." v-model="reward.description" label="Description" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>


    <!-- Action Buttons -->
    <div class="flex items-center justify-between mt-6 pt-6 border-t">
      <Button variant="outline" @click="navigateTo('/habits')">
        Cancel
      </Button>
      <div class="flex items-center gap-3">
        <Button variant="outline">
          Preview Summary
        </Button>
        <Button v-if="!editMode" variant="secondary">
          Save & Add Another
        </Button>
        <Button>
          <IconSave class="w-4 h-4 mr-2" />
          {{ editMode ? "Update Habit" : "Save Habit" }}
        </Button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
type CustomField = {
  id: string
  title: string
  type: "text" | "number" | "select" | "boolean"
  options?: string[]
  required: boolean
}

type Reward = {
  id: string
  milestoneValue: number
  name: string
  description: string
  icon: string
}

type FormData = {
  name: string
  category: string
  description: string
  icon: string
  recurrenceType: "daily" | "weekly" | "monthly"
  customRecurrence: string
  timeOfDay: string
  startDate: string
  endDate: string
  initialValue: number
  difficultyRate: number
  autoGrowth: boolean
  goalValue: number
  goalMetric: string
  estimatedDate: string
  notificationsEnabled: boolean
  reminderTimes: string[]
  smartReminders: {
    missedYesterday: boolean
    streakContinuation: boolean
  }
}

const icons = ["🎁", "🎉", "🏆", "⭐", "🎊", "💎", "🎈", "🍕", "🍰", "🎮"]
const cateogries = ["Health", "Learning", "Productivity", "Fitness"]

const router = useRouter()
const route = useRoute()
const editMode = computed(() => route.query.edit === "true")



const formData = reactive<FormData>({
  name: "Daily Walk",
  category: "",
  description: "",
  icon: "🏃",
  recurrenceType: "daily",
  customRecurrence: "",
  timeOfDay: "09:00",
  startDate: new Date().toISOString().split("T")[0] || "",
  endDate: "",
  initialValue: 12,
  difficultyRate: 1,
  autoGrowth: false,
  goalValue: 30,
  goalMetric: "sessions",
  estimatedDate: "",
  notificationsEnabled: true,
  reminderTimes: ["09:00"],
  smartReminders: {
    missedYesterday: true,
    streakContinuation: false,
  },
})

const customFields = ref<CustomField[]>([])
const rewards = ref<Reward[]>([])
const showPreview = ref(false)

function updateFormData<K extends keyof FormData>(key: K, value: FormData[K]) {
  formData[key] = value
}

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


const addReward = () => {
  const newReward: Reward = {
    id: Date.now().toString(),
    milestoneValue: 10,
    name: "",
    description: "",
    icon: "🎁",
  }
  rewards.value.push(newReward)
}

const deleteReward = (index: number) => {
  rewards.value.splice(index, 1)
}



function handleSave(andAddAnother = false) {
  if (!formData.name) {
    // toast.error("Please enter a habit name");
    return
  }
  if (!formData.category) {
    // toast.error("Please select a category");
    return
  }
  // toast.success(editMode.value ? "Habit updated successfully!" : "Habit created successfully!");

  if (andAddAnother) {
    Object.assign(formData, {
      name: "",
      category: "",
      description: "",
      icon: "🎯",
    })
    customFields.value = []
    rewards.value = []
  } else {
    router.push("/habits")
  }
}
</script>

<style scoped></style>