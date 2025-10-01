<template>
  <div className="min-h-screen">
    <LandingPageNavigation />
    <LandingPageHero />
    <LandingPageFeatures />
    <LandingPageHowItWorks />
    <LandingPageFooter />

  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
console.log(colorMode.value)
</script>

<style scoped></style>