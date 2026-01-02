export const useAuth = () => {
  const router = useRouter()
  const { $auth } = useNuxtApp()
  
  // Use Better Auth's session hook
  // const session = $auth.useSession()
  // const user = computed(() => session.value?.data?.user || null)
  // const isAuthenticated = computed(() => !!user.value)

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await $auth.signUp.email({
        email,
        password,
        name: fullName,
      })

      if (error) {
        return { data: null, error }
      }

      // Create user config/profile after successful signup
      // try {
      //   await $fetch('/api/profile', {
      //     method: 'POST',
      //     body: {
      //       timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      //     },
      //   })
      // } catch (profileError) {
      //   console.error('Failed to create profile:', profileError)
      //   // Don't fail signup if profile creation fails
      // }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await $auth.signIn.email({
        email,
        password,
      })

      if (error) {
        return { data: null, error }
      }

      // Update timezone after successful signin
      // try {
      //   await $fetch('/api/timezone', {
      //     method: 'PUT',
      //     body: {
      //       timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      //     },
      //   })
      // } catch (timezoneError) {
      //   console.error('Failed to update timezone:', timezoneError)
      //   // Don't fail signin if timezone update fails
      // }

      return { data, error: null }
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
      await $auth.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/login')
          },
        },
      })
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return {
    // user: readonly(user),
    // isAuthenticated,
    // session,
    user: null,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
  }
}
