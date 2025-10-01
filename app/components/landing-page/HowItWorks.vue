<template>
  <section id="how-it-works" class="py-20 bg-gradient-to-b from-accent/10 to-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          How Stabit works
        </h2>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          Our proven 3-step approach helps you build lasting habits without overwhelm
        </p>
      </div>

      <!-- Steps -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex flex-col items-center relative"
        >
          <Card class="bg-gradient-card hover:shadow-card transition-all duration-300 w-full">
            <CardHeader class="text-center">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <component :is="step.icon" class="w-8 h-8" />
              </div>
              <CardTitle class="text-xl font-semibold">{{ step.title }}</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground text-center leading-relaxed">
                {{ step.description }}
              </p>
            </CardContent>
          </Card>

          <!-- Arrow between cards (only for md+ screens and not last item) -->
          <div
            v-if="index < steps.length - 1"
            class="hidden md:block absolute -right-7 top-1/2 transform -translate-y-1/2 z-10"
          >
            <ArrowRight class="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Target, TrendingUp, Calendar, ArrowRight } from "lucide-vue-next"

const steps = ref([
  {
    icon: Target,
    title: "Start Small",
    description: "Begin with tiny habits that take just 1-2 minutes. Read one page, do 5 pushups, meditate for 2 minutes."
  },
  {
    icon: TrendingUp,
    title: "Gradual Growth",
    description: "As you build consistency, Stabit automatically suggests small increases based on your performance."
  },
  {
    icon: Calendar,
    title: "Track Progress",
    description: "Visualize your journey with beautiful calendars, streak counters, and progress charts."
  }
])
</script>

