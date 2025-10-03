<template>
  <section id="features" class="py-20 bg-gradient-to-b from-background to-accent/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Everything you need to build lasting habits
        </h2>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          Stabit combines proven habit-building techniques with modern design to create
          an experience that actually helps you succeed.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card
v-for="(feature, index) in features" :key="index"
          class="bg-gradient-card hover:shadow-card transition-all duration-300 transform hover:scale-105">
          <CardHeader>
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
              <component :is="feature.icon" class="w-6 h-6" />
            </div>
            <CardTitle class="text-xl font-semibold">{{ feature.title }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground leading-relaxed">
              {{ feature.description }}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconTarget, IconTrendingUp, IconCalendar, IconBarChart3, IconBell, IconZap } from "#components"

const features = ref([
  {
    icon: IconTarget,
    title: "Start Small, Grow Gradually",
    description: "Begin with tiny habits like reading 1 page, then gradually increase as you build consistency."
  },
  {
    icon: IconTrendingUp,
    title: "Smart Growth Rules",
    description: "Automatic habit scaling based on your performance. No overwhelming jumps, just steady progress."
  },
  {
    icon: IconCalendar,
    title: "Visual Progress Tracking",
    description: "Beautiful calendar views and streak counters to visualize your journey and celebrate wins."
  },
  {
    icon: IconBarChart3,
    title: "Insightful Analytics",
    description: "Understand your patterns with detailed charts and progress insights to optimize your habits."
  },
  {
    icon: IconBell,
    title: "Smart Reminders",
    description: "Gentle, encouraging notifications that adapt to your schedule and help maintain momentum."
  },
  {
    icon: IconZap,
    title: "Burnout Prevention",
    description: "Built-in safeguards and flexible scheduling to prevent overwhelm and maintain long-term success."
  }
])
</script>