// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  nitro: {
    preset: 'cloudflare-pages',
    compatibility: {
      date: process.env.COMPATIBILITY_DATE || '2025-02-23',
      cloudflare: {
        compatibilityDate: process.env.COMPATIBILITY_DATE || '2025-02-23'
      }
    },
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Origin': '*'
        }
      }
    },
    devProxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  },

  runtimeConfig: {
    cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN,
    public: {
      cloudflareAccountId: 'b24e2ba64a61f064e0c2e4e02f757593'
    }
  },

  telemetry: false,
  devtools: { enabled: false },

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'MIRA - Mega Intelligent Reasoning AI',
      meta: [
        { name: 'description', content: 'MIRA - Advanced AI assistant powered by Cloudflare Workers AI' },
        { name: 'theme-color', content: '#1a1a1a' }
      ],
      link: [
        { 
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg'
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png'
        }
      ],
      baseURL: '/'
    },
    buildAssetsDir: '/_assets',
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  vite: {
    server: {
      hmr: false
    },
    optimizeDeps: {
      include: ['highlight.js/lib/core']
    },
    ssr: {
      noExternal: ['highlight.js']
    }
  },

  build: {
    transpile: [
      'marked'
    ]
  }
})