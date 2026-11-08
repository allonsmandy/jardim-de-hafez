<script setup lang="ts">
import type { Poem } from '#shared/schemas/poem'
import type { Source } from '#shared/schemas/source'

const props = defineProps<{ poem: Poem; sources: Source[] }>()
const sourceTitle = (id: string) => props.sources.find((s) => s.id === id)?.title ?? id

const KIND: Record<string, string> = {
  translation: 'Tradução do persa',
  'relay-translation': 'Tradução indireta',
  adaptation: 'Adaptação livre (não é tradução literal)',
}
</script>

<template>
  <section
    aria-labelledby="creditos-poema"
    class="border-t border-line pt-8 text-sm text-ink-muted"
  >
    <h2 id="creditos-poema" class="eyebrow mb-4">Autoria, tradução e fontes</h2>
    <dl class="grid gap-x-8 gap-y-3 sm:grid-cols-[10rem_1fr]">
      <dt class="font-semibold text-ink">Poeta</dt>
      <dd>Hafez de Shiraz (Khajeh Shamseddin Mohammad Hafez-e Shirazi, séc. XIV)</dd>

      <template v-if="poem.translation">
        <dt class="font-semibold text-ink">{{ KIND[poem.translation.kind] }}</dt>
        <dd>
          {{ poem.translation.translators.join(', ') }}
          <span v-if="poem.translation.basedOn">
            — a partir de {{ sourceTitle(poem.translation.basedOn.source) }}</span
          >
        </dd>
        <template v-if="poem.translation.reviewers.length">
          <dt class="font-semibold text-ink">Revisão</dt>
          <dd>{{ poem.translation.reviewers.join(', ') }}</dd>
        </template>
      </template>

      <template v-if="poem.original">
        <dt class="font-semibold text-ink">Texto persa</dt>
        <dd>
          Edição {{ sourceTitle(poem.original.edition) }}; transcrição:
          <a
            v-if="poem.original.transcription.url"
            :href="poem.original.transcription.url"
            rel="noopener"
            target="_blank"
          >
            {{ sourceTitle(poem.original.transcription.source) }}
          </a>
          <span v-else>{{ sourceTitle(poem.original.transcription.source) }}</span>
        </dd>
      </template>

      <dt class="font-semibold text-ink">Referências</dt>
      <dd>
        <ul>
          <li v-for="(ref, i) in poem.references" :key="i">
            {{ sourceTitle(ref.source) }}<span v-if="ref.locator">, {{ ref.locator }}</span>
          </li>
        </ul>
      </dd>
    </dl>
    <p v-if="poem.translation?.notes.length" class="mt-6">
      <span class="font-semibold text-ink">Notas de tradução.</span>
      {{ poem.translation.notes.join(' ') }}
    </p>
  </section>
</template>
