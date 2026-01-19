<template>
  <SpeedInsights />
  <slot />
</template>

<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue'
</script>

<script>
export default {
  components: {
    SpeedInsights
  }
}
</script>
