export default defineNuxtPlugin(async () => {
  const colorMode = useColorMode()
  const user = useSupabaseUser()

  // Function to load theme from API
  const loadThemeFromProfile = async () => {
    if (user.value) {
      try {
        const profile = await $fetch('/api/profile')
        if (profile?.theme) {
          // Set theme from database
          colorMode.preference = profile.theme
        }
      } catch (error) {
        console.error('Failed to load theme from profile:', error)
      }
    }
  }

  // Load theme on initial load if user is authenticated
  await loadThemeFromProfile()

  // Watch for user login to load theme
  watch(user, async (newUser) => {
    if (newUser) {
      await loadThemeFromProfile()
    }
  }, { immediate: false })
})


