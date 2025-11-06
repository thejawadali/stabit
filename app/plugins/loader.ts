import { defineNuxtPlugin } from '#app'
import { vLoading } from '~/directives/loadingContainer'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('loading', vLoading)
})
