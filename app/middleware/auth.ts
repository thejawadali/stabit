export default defineNuxtRouteMiddleware(async (to, from) => {
  // TODO: Replace with your new auth system's user check
  try {
    // Check if user is authenticated via API
    const user = await $fetch('/api/auth/me').catch(() => null)
    
    if (!user) {
      return navigateTo('/login')
    }
  } catch (error) {
    console.error('Error checking authentication:', error)
    return navigateTo('/login')
  }
})
