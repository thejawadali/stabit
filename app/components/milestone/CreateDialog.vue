<template>
  <Dialog :open="isAddDialogOpen" @update:open="isAddDialogOpen = $event">
    <DialogContent class="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Create New Milestone</DialogTitle>
        <DialogDescription>
          Set up a new milestone and reward for your habit
        </DialogDescription>
      </DialogHeader>
      <div class="py-4 grid grid-cols-2 gap-4">
        <!-- milestone name -->
        <div class="col-span-2">
          <Input label="Milestone Name" placeholder="e.g., First 10 Sessions" rules="required" />
        </div>
        <!-- habit -->
        <Select label="Habit" rules="required">
          <SelectTrigger>
            <SelectValue placeholder="Select habit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="workout">Morning Workout</SelectItem>
            <SelectItem value="reading">Daily Reading</SelectItem>
            <SelectItem value="meditation">Meditation</SelectItem>
          </SelectContent>
        </Select>


        <!-- reward -->
        <Input label="Reward" placeholder="e.g., Weekend Treat" rules="required" />
        <!-- target -->
        <Input label="Target (sessions or days)" type="number" placeholder="10" rules="required" />
        <!-- emoji / icon -->
        <Input label="Emoji / Icon" placeholder="🎉" maxLength={2} />

        <!-- reward description -->
        <div class="col-span-2">
          <Textarea label="Reward Description" placeholder="Describe your reward..." class="col-span-2" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="isAddDialogOpen = false">
          Cancel
        </Button>
        <Button @click="isAddDialogOpen = false">
          Create Milestone
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">

const isAddDialogOpen = defineModel<boolean>('isAddDialogOpen', { default: false })
</script>

<style scoped></style>