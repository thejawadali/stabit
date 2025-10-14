export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()

  // Initialize auth state on app start
  await supabase.auth.getSession()
})
