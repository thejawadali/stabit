<template>
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
                  <p class="text-xs text-muted-foreground">After how many {{ goalMetric }}?</p>
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
</template>

<script setup lang="ts">

type Reward = {
  id: string
  milestoneValue: number
  name: string
  description: string
  icon: string
}

const rewards = defineModel<Reward[]>('rewards', { default: [] })

defineProps<{
  goalMetric: string
}>()

const icons = ["🎁", "🎉", "🏆", "⭐", "🎊", "💎", "🎈", "🍕", "🍰", "🎮"]
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


</script>

<style scoped>

</style>