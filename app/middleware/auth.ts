export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()

  // If user is not immediately available, wait a bit for state to initialize
  if (!user.value) {
    // Wait for user state to initialize (common issue with OAuth)
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // If still no user, redirect to login
    if (!user.value) {
      return navigateTo('/login')
    }
  }
})
