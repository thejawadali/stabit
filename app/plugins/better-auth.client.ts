import { createAuthClient } from "better-auth/vue"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authClient = createAuthClient({
    baseURL: config.public.siteUrl,
    basePath: "/api/auth",
  })

  return {
    provide: {
      auth: authClient,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $auth: ReturnType<typeof createAuthClient>
  }
}

