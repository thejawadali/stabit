<template>
  <Card class="bg-gradient-card shadow-card">
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">{{ title }}</p>
              <p class="text-3xl font-bold text-foreground">{{ value }}{{ suffix }}</p>
              <p class="text-xs text-muted-foreground">{{subtitle}}</p>
            </div>
            <!-- <component :is="n.icon" :class="n.iconClass" class="w-4 h-4" /> -->
             <component :is="icon" :class="['h-10 w-10', iconColor]" />
          </div>
        </CardContent>
      </Card>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  icon: Component
  suffix?: string
  iconColor: string
  subtitle: string
  value: number
}>()
</script>

<style scoped>

</style>