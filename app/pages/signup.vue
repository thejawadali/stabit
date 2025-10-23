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
        <CardTitle class="text-2xl">Create your account</CardTitle>
        <p class="text-muted-foreground">Start building better habits today</p>
      </CardHeader>
      <CardContent class="space-y-4">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- full name -->
          <Input v-model="fullName" rules="required" validate-on-blur custom-error-message="Full name is required" name="name" label="Full Name" placeholder="Enter your full name" />
          <!-- email -->
          <Input v-model="email" rules="required|email" validate-on-blur custom-error-message="Enter a valid email" name="email" label="Email" placeholder="Enter your email" />
          <!-- password -->
          <Input v-model="password" rules="required|min:8|max:16" validate-on-blur custom-error-message="Enter a password between 8 and 16 characters" name="password" label="Password" type="password" placeholder="Create a password" />
          <Button class="w-full" variant="hero" type="submit" :is-loading>
            Create Account
          </Button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <Separator class="w-full" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Button variant="outline" class="w-full" @click="handleOAuthSignup('google')" :is-loading>
            <IconGoogle class="mr-2" />
            Google
          </Button>
          <Button variant="outline" class="w-full" @click="handleOAuthSignup('github')" :is-loading>
            <IconGithub class="mr-2" />
            GitHub
          </Button>
        </div>

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Already have an account? </span>

          <NuxtLink to="/login" class="text-primary hover:underline">
            Sign in
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
  title: 'Sign Up'
})

const fullName = ref("")
const email = ref("")
const password = ref("")
const isLoading = ref(false)
const errorMessage = ref("")

const {validate} = useForm()
const { signUp, signInWithProvider } = useAuth()
const router = useRouter()

const handleSubmit = async () => {
  const { valid } = await validate()
  if (!valid) return
  
  isLoading.value = true
  errorMessage.value = ""
  
  try {
    const { data, error } = await signUp(email.value, password.value, fullName.value)
    
    if (error) {
      const errorMsg = (error as any).message
      errorMessage.value = errorMsg || 'An error occurred during signup'
    } else if (data) {
      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        // Show success message for email confirmation
        errorMessage.value = "Please check your email to confirm your account."
      } else {
        // Redirect to dashboard if no email confirmation needed
        await router.push('/dashboard')
      }
    }
  } catch (error) {
    errorMessage.value = "An unexpected error occurred. Please try again."
  } finally {
    isLoading.value = false
  }
}

const handleOAuthSignup = async (provider: 'google' | 'github') => {
  isLoading.value = true
  errorMessage.value = ""
  
  try {
    const { error } = await signInWithProvider(provider)
    if (error) {
      // error.message ||
      errorMessage.value = 'An error occurred during OAuth signup'
    }
  } catch (error) {
    errorMessage.value = "An unexpected error occurred. Please try again."
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>