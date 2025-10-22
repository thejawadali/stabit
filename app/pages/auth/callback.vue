<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10 flex items-center justify-center p-4">
    <Card class="w-full max-w-md bg-gradient-card shadow-glow">
      <CardContent class="flex flex-col items-center justify-center p-8 space-y-4">
        <div v-if="isLoading" class="text-center">
          <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 class="text-xl font-semibold mb-2">Completing sign in...</h2>
          <p class="text-muted-foreground">Please wait while we set up your account.</p>
        </div>
        
        <div v-else-if="error" class="text-center">
          <div class="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconX class="w-6 h-6 text-destructive" />
          </div>
          <h2 class="text-xl font-semibold mb-2">Sign in failed</h2>
          <p class="text-muted-foreground mb-4">{{ error }}</p>
          <Button @click="retrySignIn" variant="outline">
            Try again
          </Button>
        </div>
        
        <div v-else class="text-center">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconCheck class="w-6 h-6 text-green-600" />
          </div>
          <h2 class="text-xl font-semibold mb-2">Sign in successful!</h2>
          <p class="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: []
})

useHead({
  title: 'Signing in...'
})

const supabase = useSupabaseClient()
const router = useRouter()
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    // Check if this is a direct access (no URL parameters from OAuth)
    const urlHash = window.location.hash
    const urlSearch = window.location.search
    
    if (!urlHash && !urlSearch) {
      // Direct access detected, redirect to login
      await router.push('/login')
      return
    }

    // Handle the OAuth callback
    const { data, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      error.value = 'Failed to complete sign in. Please try again.'
      isLoading.value = false
      return
    }

    if (data.session) {
      // User is authenticated, update profile and redirect to dashboard
      try {
        await $fetch('/api/profile', {
          method: 'POST',
          body: {
            avatarUrl: data.session.user?.user_metadata?.avatar_url,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        })
      } catch (profileError) {
        console.error('Failed to update profile:', profileError)
      }
      await router.push('/dashboard')
    } else {
      // OAuth flow but no session yet - keep checking until session is available
      await waitForSession()
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
    isLoading.value = false
  }
})

const waitForSession = async () => {
  const maxAttempts = 40 // Maximum 30 attempts (30 seconds)
  const interval = 500 // Check every 0.5 second
  let attempts = 0

  const checkSession = async (): Promise<boolean> => {
    attempts++
    
    const { data } = await supabase.auth.getSession()
    
    if (data.session) {
      await router.push('/dashboard')
      return true
    }
    
    if (attempts >= maxAttempts) {
      error.value = 'Authentication timed out. Please try signing in again.'
      isLoading.value = false
      return true
    }
    
    return false
  }

  // Check immediately first
  if (await checkSession()) return

  // Then check at intervals
  const intervalId = setInterval(async () => {
    if (await checkSession()) {
      clearInterval(intervalId)
    }
  }, interval)
}

const retrySignIn = () => {
  router.push('/login')
}
</script>
