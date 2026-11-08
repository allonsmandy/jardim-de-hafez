<script setup lang="ts">
import { ExternalLink } from '@lucide/vue'
import type { Source } from '#shared/schemas/source'

const props = defineProps<{ source: Source; muted?: boolean }>()

const TYPE_LABEL: Record<Source['type'], string> = {
  'critical-edition': 'Edição crítica',
  'digital-transcription': 'Transcrição digital',
  translation: 'Tradução',
  reference: 'Obra de referência',
  website: 'Site',
}
const { label: sealLabel, tone } = useRightsStatus(() => props.source.rights.status)

const verified = computed(() => {
  const iso = props.source.rights.verifiedAt
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
})
</script>

<template>
  <article class="card" :class="{ 'card--muted': muted }">
    <div class="flex flex-wrap items-center gap-2">
      <span class="card__type">{{ TYPE_LABEL[source.type] }}</span>
      <span class="seal" :class="`seal--${tone}`">{{ sealLabel }}</span>
    </div>
    <h3 class="card__title">
      <a v-if="source.url" :href="source.url" target="_blank" rel="noopener">
        {{ source.title }} <ExternalLink class="inline size-4 align-baseline" aria-hidden="true" />
        <span class="sr-only">(abre em nova aba)</span>
      </a>
      <template v-else>{{ source.title }}</template>
    </h3>
    <p v-if="source.authors.length || source.year || source.publisher" class="card__meta">
      {{ [source.authors.join(', '), source.publisher, source.year].filter(Boolean).join(' · ') }}
    </p>
    <p class="card__note"><GlossaryText :text="source.rights.note" /></p>
    <p v-if="verified" class="card__verified">Direitos verificados em {{ verified }}</p>
  </article>
</template>

<style scoped>
.card {
  height: 100%;
  padding: 1.5rem 1.6rem;
  border-radius: 1.25rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
  border-top: 3px solid var(--color-cypress);
  transition:
    transform 0.4s var(--ease-garden),
    box-shadow 0.4s var(--ease-garden);
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 40px -30px rgb(36 72 63 / 0.45);
}
.card--muted {
  border-top-color: var(--color-wine);
}
.card__type {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
.card__title {
  margin-top: 0.75rem;
  font-family: var(--font-display);
  font-size: 1.45rem;
  line-height: 1.25;
}
.card__title a {
  color: var(--color-ink);
  text-decoration: none;
}
.card__title a:hover {
  color: var(--color-wine);
}
.card__meta {
  margin-top: 0.35rem;
  font-size: 0.9rem;
  color: var(--color-ink-muted);
}
.card__note {
  margin-top: 0.9rem;
  font-size: 0.93rem;
  line-height: 1.65;
  color: var(--color-ink-muted);
}
.card__verified {
  margin-top: 0.9rem;
  font-size: 0.8rem;
  color: var(--color-cypress);
}
</style>
