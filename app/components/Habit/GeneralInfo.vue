<template>
  <Card>
    <CardHeader>
      <CardTitle>General Information</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <Label for="icon">Habit Icon</Label>
        <div class="flex items-center gap-4">
          <Button type="button" variant="outline" class="text-4xl h-16 w-16"
            @click="showEmojiPicker = !showEmojiPicker">
            {{ icon }}
          </Button>
          <div v-if="showEmojiPicker" class="flex flex-wrap gap-2 p-4 border rounded-lg bg-background">
            <Button v-for="emoji in EMOJI_OPTIONS" :key="emoji" type="button" variant="ghost"
              @click="icon = emoji; showEmojiPicker = false" class="text-2xl h-12 w-12">
              {{ emoji }}
            </Button>
          </div>
        </div>
      </div>

      <Input label="Habit Name" rules="required" name="name" placeholder="e.g., Daily Reading" validateOnBlur
        v-model="name" />

      <Select label="Category" v-model="category" rules="required" name="category"
        placeholder="Select a category" validateOnBlur>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Textarea name="description" label="Description / Motivation" placeholder="Why is this habit important to you?"
        v-model="description" />

    </CardContent>
  </Card>

</template>

<script setup lang="ts">
const icon = defineModel<string>('icon')
const name = defineModel<string>('name')
const category = defineModel<string>('category')
const description = defineModel<string>('description')


const showEmojiPicker = ref(false)

defineProps<{
  categories: string[]
}>()


const EMOJI_OPTIONS = ["📚", "🏃", "💪", "🎯", "🧘", "💧", "🎨", "🎵", "✍️", "🍎", "🌱", "🔥", "⭐", "🎮", "📱", "💼"]
</script>

<style scoped></style>