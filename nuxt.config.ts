// https://nuxt.com/docs/api/configuration/nuxt-config
import { config } from 'dotenv';

// Load .env.local file
config({ path: '.env.local' });

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/icon'],
  css: ['~/assets/css/main.css'],
  devServer: {
    port: 3344
  },
  runtimeConfig: {
    // This will be overridden by NUXT_WALKSCORE_API_KEY env var
    walkscoreApiKey: process.env.WALKSCORE_API_KEY || process.env.NUXT_WALKSCORE_API_KEY || ''
  },
  app: {
    head: {
      title: 'Walk Score Dashboard - Lake Nona South',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap' }
      ]
    }
  }
})
