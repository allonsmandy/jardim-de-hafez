import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',

  modules: ['@nuxt/eslint', '@nuxtjs/sitemap'],

  devtools: { enabled: true },

  components: [{ path: '~/components', pathPrefix: false }],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR', dir: 'ltr' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#F7F1E6' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  site: {
    url: siteUrl,
    name: 'Jardim de Hafez',
    defaultLocale: 'pt-BR',
  },

  runtimeConfig: {
    /**
     * Prévia editorial: quando `true` (NUXT_EDITORIAL_PREVIEW=true e
     * NUXT_PUBLIC_EDITORIAL_PREVIEW=true), rascunhos
     * aparecem no site com aviso visível e `noindex`. Nunca habilitar em produção.
     */
    editorialPreview: false,
    public: {
      siteUrl,
      /** Espelha `editorialPreview` para que a interface mostre o aviso de prévia. */
      editorialPreview: false,
    },
  },

  nitro: {
    serverAssets: [
      {
        baseName: 'content',
        dir: fileURLToPath(new URL('./content', import.meta.url)),
      },
    ],
    prerender: {
      crawlLinks: true,
      routes: ['/', '/api/poems.json', '/api/sources.json', '/api/glossary.json', '/api/art.json'],
      failOnError: true,
    },
  },
})
