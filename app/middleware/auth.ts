export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  // If user is not immediately available, wait a bit for state to initialize
  if (!user.value) {
    // Wait for user state to initialize (common issue with OAuth)
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // If still no user, try to get the session
    if (!user.value) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          return navigateTo('/login')
        }
      } catch (error) {
        console.error('Error checking session:', error)
        return navigateTo('/login')
      }
    }
  }
})
