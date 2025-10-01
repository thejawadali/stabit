<template>
  <section
    class="relative min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10 pt-20 pb-12 overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        <!-- Left Column - Text Content -->
        <div class="space-y-8 animate-slide-up">
          <div class="space-y-4">
            <div class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap class="w-4 h-4 mr-2" />
              Start small, grow steadily
            </div>

            <h1 class="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Build habits that
              <span class="bg-gradient-primary bg-clip-text text-transparent"> stick</span>
            </h1>

            <p class="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Transform your life one small step at a time. Stabit helps you build sustainable habits
              without burnout by starting small and growing gradually.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink to="/signup">
              <Button variant="hero" size="lg" class="text-base px-8 py-3">
                Start Your Journey
              </Button>
            </NuxtLink>
          </div>

          <!-- Social Proof -->
          <div class="flex items-center space-x-6 pt-4">
            <div class="flex items-center space-x-2">
              <CheckCircle2 class="w-5 h-5 text-success" />
              <span class="text-sm text-muted-foreground">Free to start</span>
            </div>
            <div class="flex items-center space-x-2">
              <Flame class="w-5 h-5 text-primary" />
              <span class="text-sm text-muted-foreground">Build streaks</span>
            </div>
            <div class="flex items-center space-x-2">
              <Target class="w-5 h-5 text-primary" />
              <span class="text-sm text-muted-foreground">Gradual growth</span>
            </div>
          </div>
        </div>

        <!-- Right Column - Hero Image & Cards -->
        <div class="relative">
          <div class="relative z-10">
            <img 
              src="~/assets/images/hero-image-new.jpg"
              alt="Stabit habit tracking interface showing progress and growth"
              class="rounded-2xl shadow-2xl w-full h-auto">

            <!-- Floating cards -->
            <Card class="absolute -top-4 -left-4 w-48 bg-gradient-card shadow-glow animate-pulse-soft">
              <CardContent class="p-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                    <CheckCircle2 class="w-5 h-5 text-success-foreground" />
                  </div>
                  <div>
                    <div class="text-sm font-medium">Reading</div>
                    <div class="text-xs text-muted-foreground">5 pages today ✓</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card class="absolute -bottom-4 -right-4 w-48 bg-gradient-card shadow-glow animate-pulse-soft">
              <CardContent class="p-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <TrendingUp class="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div class="text-sm font-medium">25 Day Streak</div>
                    <div class="text-xs text-muted-foreground">Keep it up! 🔥</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Background glow -->
          <div class="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-3xl" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TrendingUp, Target, Zap, CheckCircle2, Flame } from "lucide-vue-next";
</script>

<style scoped></style>