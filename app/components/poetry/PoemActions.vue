<script setup lang="ts">
import { Copy, Share2 } from '@lucide/vue'
import { stanzasToPlainText } from '#shared/utils/text'

const props = defineProps<{
  poemId: string
  title: string
  stanzas?: string[][]
  credit: string
  path: string
}>()
const { public: config } = useRuntimeConfig()
const feedback = ref('')

const url = computed(() => `${config.siteUrl}${props.path}`)

function announce(message: string) {
  feedback.value = message
  setTimeout(() => (feedback.value = ''), 2500)
}

async function copyVerses() {
  if (!props.stanzas) return
  try {
    await navigator.clipboard.writeText(
      `${stanzasToPlainText(props.stanzas)}\n\n— ${props.credit}\n${url.value}`,
    )
    announce('Versos copiados com os créditos.')
  } catch {
    announce('Não foi possível copiar. Selecione o texto manualmente.')
  }
}

async function share() {
  try {
    if (navigator.share) {
      await navigator.share({ title: props.title, url: url.value })
      return
    }
    await navigator.clipboard.writeText(url.value)
    announce('Link copiado.')
  } catch (error) {
    if ((error as DOMException).name !== 'AbortError') announce('Não foi possível compartilhar.')
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-1">
    <FavoriteButton :poem-id="poemId" />
    <button
      v-if="stanzas"
      type="button"
      class="btn-quiet"
      aria-label="Copiar versos"
      @click="copyVerses"
    >
      <Copy class="size-4" aria-hidden="true" /> <span class="hidden sm:inline">Copiar versos</span>
    </button>
    <button type="button" class="btn-quiet" aria-label="Compartilhar" @click="share">
      <Share2 class="size-4" aria-hidden="true" />
      <span class="hidden sm:inline">Compartilhar</span>
    </button>
    <span role="status" aria-live="polite" class="feedback">{{ feedback }}</span>
  </div>
</template>

<style scoped>
/* Aviso flutuante, para não empurrar a barra no celular */
.feedback:not(:empty) {
  position: fixed;
  left: 50%;
  bottom: 1.5rem;
  z-index: 50;
  translate: -50% 0;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  color: var(--color-ivory);
  background: var(--color-cypress);
  box-shadow: 0 12px 30px -12px rgb(0 0 0 / 0.4);
}
</style>
