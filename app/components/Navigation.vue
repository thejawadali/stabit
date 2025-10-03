<template>
  <nav class="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <TrendingUp class="w-5 h-5 text-primary-foreground" />
          </div>
          <span class="text-2xl font-bold text-foreground">Stabit</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div v-if="isHomePage" class="hidden md:flex items-center space-x-8">
          <a href="#features" class="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" class="text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
        </div>

        <div class="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <template v-if="isHomePage">
            <NuxtLink to="/login">
              <Button variant="ghost">Login</Button>
            </NuxtLink>
            <NuxtLink to="/signup">
              <Button variant="hero">Get Started</Button>
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <Button variant="ghost" size="icon" @click="isMenuOpen = !isMenuOpen">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div class="md:hidden py-4 border-t border-border">
        <div v-if="isMenuOpen" class="flex flex-col space-y-4">
          <template v-if="isHomePage">
            <a href="#features" class="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" class="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
          </template>
          <div class="flex flex-col space-y-2 pt-4">
            <div class="flex justify-center">
              <ThemeToggle />
            </div>
            <NuxtLink to="/signup">
              <Button class="w-full" variant="hero">Get Started</Button>
            </NuxtLink>
            <NuxtLink to="/login">
              <Button variant="ghost" class="w-full">Login</Button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { TrendingUp } from "lucide-vue-next"
import { ThemeToggle } from "~/components/ui/theme-toggle"

const isMenuOpen = ref(false)
const route = useRoute()

const isHomePage = computed(() => route.path === '/')
</script>

<style scoped></style>