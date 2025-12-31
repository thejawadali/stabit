export default defineNuxtPlugin(async () => {
  const colorMode = useColorMode()
  
  // TODO: Replace with your new auth system's user composable
  // const user = useUser() // Example: replace with your auth composable

  // Function to load theme from API
  const loadThemeFromProfile = async () => {
    try {
      const profile = await $fetch('/api/profile')
      if (profile?.theme) {
        // Set theme from database
        colorMode.preference = profile.theme
      }
    } catch (error) {
      // Silently fail if user is not authenticated
      console.error('Failed to load theme from profile:', error)
    }
  }

  // Load theme on initial load
  await loadThemeFromProfile()

  // TODO: Watch for user login to load theme when you implement new auth system
  // watch(user, async (newUser) => {
  //   if (newUser) {
  //     await loadThemeFromProfile()
  //   }
  // }, { immediate: false })
})


