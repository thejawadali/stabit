<template>
  <div class="space-y-3">
    <Card v-for="habit in habits" :key="habit.id" class="hover:shadow-card transition-shadow">
      <CardContent class="p-4">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3 flex-1">
            <div class="text-2xl mt-1">{{ habit.icon }}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-2">
                <h4 class="font-semibold">{{ habit.name }}</h4>
                <Badge variant="secondary" class="text-xs">{{ habit.category }}</Badge>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-muted-foreground">Progress</span>
                  <span class="font-medium">{{ habit.progress }}%</span>
                </div>
                <Progress :value="habit.progress" class="h-2" />

                <div class="flex items-center justify-between pt-2">
                  <div class="flex items-center space-x-2">
                    <IconFlame class="w-4 h-4 text-primary" />
                    <span class="text-sm font-medium">{{ habit.streak }} day streak</span>
                  </div>

                  <div class="flex items-center space-x-1">
                    <IconTrendingUp class="w-3 h-3 text-success" />
                    <div class="flex space-x-0.5">
                      <div v-for="(value, i) in habit.trend" :key="i" class="w-1 bg-success rounded-full"
                        :style="{ height: `${value}px` }" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons for Edit, Delete, and View History -->
          <div class="flex space-x-1 ml-4">
            <Button variant="ghost" size="icon" @click="emit('onViewHistory', habit.id)">
              <IconBarChart3 class="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" @click="emit('onEdit', habit.id)">
              <IconEdit class="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" @click="emit('onDelete', habit.id)">
              <IconTrash2 class="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  habits: Habit[]
}>(), {
  habits: () => [],
})

const emit = defineEmits<{
  (e: 'onEdit', id: string): void
  (e: 'onDelete', id: string): void
  (e: 'onViewHistory', id: string): void
}>();

</script>

<style scoped></style>