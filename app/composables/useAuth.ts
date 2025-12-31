export const useAuth = () => {
  const router = useRouter()
  
  // TODO: Replace with your new auth system's user state
  const user = ref(null) // Replace with your auth system's user state
  const isAuthenticated = computed(() => !!user.value)

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // TODO: Replace with your new auth system's sign up API
      const response = await $fetch<{ data?: any; error?: any; user?: any }>('/api/auth/signup', {
        method: 'POST',
        body: {
          email,
          password,
          fullName,
        },
      }) as any

      if (response.error) throw response.error

      // Update user state
      user.value = response.data?.user || null

      await $fetch('/api/profile', {
        method: 'POST',
        body: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      })

      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      // TODO: Replace with your new auth system's sign in API
      const response = await $fetch<{ data?: any; error?: any; user?: any }>('/api/auth/signin', {
        method: 'POST',
        body: {
          email,
          password,
        },
      }) as any

      if (response.error) throw response.error
      
      // Update user state
      user.value = response.data?.user || null

      await $fetch('/api/timezone', {
        method: 'PUT',
        body: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      })
      return { data: response.data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  // Sign in with OAuth provider
  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      // TODO: Replace with your new auth system's OAuth API
      // Update redirectTo to match your new auth system's callback route
      const response = await $fetch<{ data?: any; error?: any; url?: string }>('/api/auth/oauth', {
        method: 'POST',
        body: {
          provider,
          redirectTo: `${window.location.origin}/dashboard`, // Update this to your callback route
        },
      }) as any

      if (response.error) throw response.error

      // Redirect to OAuth provider
      if (response.data?.url || response.url) {
        window.location.href = response.data?.url || response.url
      }

      return { data: response.data || response, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      // TODO: Replace with your new auth system's sign out API
      const response = await $fetch<{ error?: any }>('/api/auth/signout', {
        method: 'POST',
      }) as any
      
      if (response.error) throw response.error
      
      // Clear user state
      user.value = null
      
      await router.push('/login')
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
  }
}
