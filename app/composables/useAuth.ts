export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const router = useRouter()

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      await $fetch('/api/profile', {
        method: 'POST',
        body: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      })

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      await $fetch('/api/timezone', {
        method: 'PUT',
        body: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      })
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  // Sign in with OAuth provider
  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      await router.push('/login')
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!user.value)

  return {
    user: readonly(user),
    isAuthenticated,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
  }
}
