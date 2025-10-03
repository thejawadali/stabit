<template>
  <section
    class="relative min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10 pt-20 pb-12 overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-destructive/10 rounded-full blur-2xl" />
    </div>

    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[80vh]">
      <div class="text-center space-y-8 animate-slide-up">
        <!-- statusCode Number with gradient -->
        <div class="space-y-4">
          <h1 class="text-8xl md:text-9xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-none">
            {{ error?.statusCode }}
          </h1>

          <!-- Error message with icon -->
          <div class="flex items-center justify-center space-x-3 mb-6">
            <span class="text-3xl">⚠️</span>
            <h2 class="text-2xl md:text-3xl font-semibold text-foreground">
              {{ error?.message }}
            </h2>
          </div>

          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Oops! The page you're looking for seems to have wandered off.
            Don't worry, even the best habits need a break sometimes.
          </p>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink to="/">
            <Button variant="hero" size="lg" class="text-base px-8 py-3">
              <IconHome class="w-5 h-5 mr-2" />
              Return Home
            </Button>
          </NuxtLink>

          <Button variant="outline" size="lg" class="text-base px-8 py-3" @click="goBack">
            <IconArrowLeft class="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        <!-- Helpful links -->
        <div class="pt-8 border-t border-border/50">
          <p class="text-sm text-muted-foreground mb-4">Or try one of these popular pages:</p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/signup" class="text-primary hover:text-primary/80 transition-colors">
              <Button variant="ghost" size="sm">
                <IconUserPlus class="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </NuxtLink>
            <NuxtLink to="/login" class="text-primary hover:text-primary/80 transition-colors">
              <Button variant="ghost" size="sm">
                <IconLogIn class="w-4 h-4 mr-2" />
                Login
              </Button>
            </NuxtLink>
          </div>
        </div>

        <!-- Fun fact card -->
        <Card class="max-w-md mx-auto bg-gradient-card shadow-glow animate-pulse-soft">
          <CardContent class="p-6 text-center">
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconLightbulb class="w-6 h-6 text-primary" />
            </div>
            <h3 class="font-semibold text-card-foreground mb-2">Did you know?</h3>
            <p class="text-sm text-muted-foreground">
              The average person takes 66 days to form a new habit.
              That's why we're here to help you build habits that stick! 🌱
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const error = useError()

// Function to go back in browser history
const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}
</script>

<style scoped></style>