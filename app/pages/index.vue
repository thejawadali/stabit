<template>
  <div className="min-h-screen">
    <Navigation />
    <LandingPageHero />
    <LandingPageFeatures />
    <LandingPageHowItWorks />
    <LandingPageFooter />

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})
</script>

<style scoped></style>