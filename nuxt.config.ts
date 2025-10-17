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
    '@nuxtjs/supabase',
    'dayjs-nuxt',
    '@prisma/nuxt',
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
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/auth/callback',
      exclude: ['/', '/signup', '/auth/callback']
    }
  },
  components: [
    {
      path: '~/components/dashboard',
      pathPrefix: false,
    },
    '~/components',
  ],
})