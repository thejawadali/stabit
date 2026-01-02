// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Stabit',
      titleTemplate: '%s - Stabit',
      meta: [
        { name: 'description', content: 'Stabit is a platform for building better habits' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
      ],
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/index.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/test-utils',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@vee-validate/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-lucide-icons',
    'dayjs-nuxt'
  ],
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },
  lucide: {
    namePrefix: 'Icon'
  },
  components: [
    {
      path: '~/components/dashboard',
      pathPrefix: false,
    },
    '~/components',
  ],
  imports: {
    presets: [
      {
        from: '~/components/ui/toast/use-toast',
        imports: ['useToast']
      }
    ]
  },
  runtimeConfig: {
    betterAuthUrl: process.env.BETTER_AUTH_URL,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      githubClientId: process.env.GITHUB_CLIENT_ID,
    }
  },
  nitro: {
    debug: process.env.NODE_ENV === 'development',
    experimental: {
      tasks: true
    },
    scheduledTasks: {
      // '* * * * *': ['habit:check-status'] for dev
      '0 0 * * *': ['habit:check-status'] // run every day at midnight
    }
  }
})