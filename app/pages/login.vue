<template>
  <div
    class="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10 flex items-center justify-center p-4">
    <Card class="w-full max-w-md bg-gradient-card shadow-glow">
      <CardHeader class="text-center">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <div class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <IconTrendingUp class="w-5 h-5 text-primary-foreground" />
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
          <Input v-model="password" rules="required|min:8|max:16" validate-on-blur custom-error-message="Enter a password" name="password" label="Password" type="password" placeholder="Enter your password" />
          <Button variant="hero" class="w-full" type="submit" :is-loading>
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
          <Button variant="outline" class="w-full" @click="handleOAuthSignin('google')" :is-loading>
            <IconGoogle class="mr-2" />
            Google
          </Button>
          <Button variant="outline" class="w-full" @click="handleOAuthSignin('github')" :is-loading>
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

definePageMeta({
  layout: false
})

useHead({
  title: 'Log In'
})

const email = ref("")
const password = ref("")
const isLoading = ref(false)

const {validate} = useForm()
const { signIn, signInWithProvider } = useAuth()
const router = useRouter()

const handleSubmit = async () => {
  const { valid } = await validate()
  if (!valid) return
  
  isLoading.value = true
  
  try {
    const { error } = await signIn(email.value, password.value)
    if (error) {
      const errorMsg = (error as any).message
      console.log(errorMsg || 'An error occurred during signin')
    } else {
      // Redirect to dashboard on successful login
      await router.push('/dashboard')
    }
  } catch (error) {
    console.log("An unexpected error occurred. Please try again.")
  } finally {
    isLoading.value = false
  }
}

const handleOAuthSignin = async (provider: 'google' | 'github') => {
  isLoading.value = true
  try {
    const { error } = await signInWithProvider(provider)
    if (error) {
      const errorMsg = (error as any).message
      console.log(errorMsg || 'An error occurred during signin')
    }
  } catch (error) {
    console.log("An unexpected error occurred. Please try again.")
  } finally {
    isLoading.value = false
  }
}
</script>