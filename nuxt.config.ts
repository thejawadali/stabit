// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    '@nuxtjs/color-mode'
  ],
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  }
})