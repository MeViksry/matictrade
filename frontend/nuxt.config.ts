export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  build: {
    transpile: ['vue3-apexcharts']
  },

  css: ['~/assets/css/main.css'],

  ui: {
    // Icons are auto-imported by @nuxt/ui
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'color-mode',
    dataValue: 'theme'
  },

  fonts: {
    // Disable remote font fetching in development to avoid network timeout errors
    providers: {
      google: false
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || 'ws://localhost:3001',

      binanceWsUrl: 'wss://fstream.binance.com/ws',
      okxWsUrl: 'wss://ws.okx.com:8443/ws/v5/public',
      bitgetWsUrl: 'wss://ws.bitget.com/mix/v1/stream'
    }
  },

  app: {
    head: {
      htmlAttrs: {
        class: 'dark'
      },
      title: 'MaticTrade - Copy Trading',
      script: [
        {
          innerHTML: `document.documentElement.classList.add('dark');`,
          type: 'text/javascript'
        }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'MaticTrade is an automated copy trading platform that uses algorithmic strategies to trade for you in real time—no manual trading or copying human traders required.'
        },
        { name: 'apple-mobile-web-app-title', content: 'Matic Trade' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' }
      ]
    }
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  pinia: {
    storesDirs: ['./stores/**']
  },

  typescript: {
    strict: true
  },

  nitro: {
    preset: 'node-server'
  },

  components: [
    {
      path: '~/components',
      pathPrefix: true
    }
  ],

  compatibilityDate: '2025-01-01'
})