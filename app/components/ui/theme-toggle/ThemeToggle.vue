<template>
  <div class="relative">
    <Button
      variant="ghost"
      size="icon"
      @click="toggleTheme"
      class="h-9 w-9"
      :title="`Switch to ${nextTheme} theme`"
    >
      <IconMonitor v-if="colorMode.preference === 'system'" class="h-4 w-4" />
      <IconSun v-else-if="colorMode.preference === 'light'" class="h-4 w-4" />
      <IconMoon v-else class="h-4 w-4" />
      <span class="sr-only">Toggle theme</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button"

const colorMode = useColorMode()

const themes = ['light', 'dark', 'system'] as const
type Theme = typeof themes[number]

const nextTheme = computed(() => {
  const currentIndex = themes.indexOf(colorMode.preference as Theme)
  return themes[(currentIndex + 1) % themes.length]
})

const toggleTheme = () => {
  colorMode.preference = nextTheme.value as string
}
</script>
