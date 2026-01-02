import { createAuthClient } from "better-auth/vue"

export default defineNuxtPlugin(() => {
  const authClient = createAuthClient({
    baseURL: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
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

