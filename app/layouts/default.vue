<script setup lang="ts">
const { public: config } = useRuntimeConfig()
const route = useRoute()

useHead({
  link: [
    { rel: 'canonical', href: () => `${config.siteUrl}${route.path === '/' ? '' : route.path}` },
  ],
  meta: config.editorialPreview ? [{ name: 'robots', content: 'noindex, nofollow' }] : [],
})
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <a
      href="#conteudo"
      class="sr-only z-50 rounded bg-cypress px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Pular para o conteúdo
    </a>
    <EditorialPreviewBanner v-if="config.editorialPreview" />
    <AppHeader />
    <main id="conteudo" class="flex-1" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
    <GlossaryDialog />
  </div>
</template>
