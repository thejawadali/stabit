<template>
  <div
    class="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10 flex items-center justify-center p-4">
    <Card class="w-full max-w-md bg-gradient-card shadow-glow">
      <CardHeader class="text-center">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <div class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <TrendingUp class="w-5 h-5 text-primary-foreground" />
          </div>
          <span class="text-2xl font-bold text-foreground">Stabit</span>
        </div>
        <CardTitle class="text-2xl">Welcome back</CardTitle>
        <p class="text-muted-foreground">Sign in to continue your habit journey</p>
      </CardHeader>
      <CardContent class="space-y-4">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- email -->
          <Input v-model="email" rules="required|email" validate-on-blur custom-error-message="Enter a valid email" name="email" label="Email" placeholder="Enter your email" />
            <!-- password -->
          <Input v-model="password" rules="required|min:8|max:16" validate-on-blur custom-error-message="Enter a password" name="password" label="Password" type="password" placeholder="Create a password" />
          <Button variant="hero" class="w-full" type="submit">
            Sign In
          </Button>
        </form>
        <!-- will do in future -->
        <!-- <div class="text-center">
          <NuxtLink to="/forgot-password" class="text-sm text-primary hover:underline">
          Forgot your password?
          </NuxtLink>
        </div> -->

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <Separator class="w-full" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Button variant="outline" class="w-full">
            <IconGoogle class="mr-2" />
            Google
          </Button>
          <Button variant="outline" class="w-full">
            <IconGithub class="mr-2" />
            GitHub
          </Button>
        </div>

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Don't have an account? </span>
          <NuxtLink to="/signup" class="text-primary hover:underline">
          Sign up
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp } from "lucide-vue-next"


const email = ref("")
const password = ref("")

// eslint-disable-next-line no-undef
const {validate} = useForm()

const handleSubmit = async () => {
  const { valid } = await validate()
  if (!valid) return
  console.log(email.value, password.value)
}
</script>

<style scoped></style>