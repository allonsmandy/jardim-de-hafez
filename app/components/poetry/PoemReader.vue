<script setup lang="ts">
import type { ReadingMode } from '~/composables/useReadingPreferences'

/**
 * Leitura do poema como uma edição literária: o poema permanece um bloco
 * contínuo; no modo paralelo, cada dístico persa fica ao lado da tradução.
 */
const props = withDefaults(
  defineProps<{ original?: string[][]; translation?: string[][]; mode: ReadingMode }>(),
  { original: undefined, translation: undefined },
)

const effectiveMode = computed<ReadingMode>(() => {
  if (!props.translation) return 'persa'
  if (!props.original) return 'portugues'
  return props.mode
})

const rows = computed(() => {
  const length = Math.max(props.original?.length ?? 0, props.translation?.length ?? 0)
  return Array.from({ length }, (_, i) => ({
    fa: props.original?.[i],
    pt: props.translation?.[i],
  }))
})
</script>

<template>
  <div
    class="poem"
    :class="{
      'poem--parallel': effectiveMode === 'paralelo',
      'poem--single': effectiveMode !== 'paralelo',
    }"
  >
    <div v-for="(row, i) in rows" :key="i" class="poem__stanza">
      <div class="poem__row">
        <p v-if="row.pt && effectiveMode !== 'persa'" class="poem__pt" lang="pt-BR">
          <template v-for="(line, j) in row.pt" :key="j"
            ><span class="block">{{ line }}</span></template
          >
        </p>
        <p v-if="row.fa && effectiveMode !== 'portugues'" class="poem__fa" lang="fa" dir="rtl">
          <template v-for="(line, j) in row.fa" :key="j"
            ><span class="block">{{ line }}</span></template
          >
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.poem {
  font-size: var(--text-verse);
  line-height: var(--text-verse--line-height);
}
.poem__stanza + .poem__stanza {
  margin-top: 1.4em;
}
.poem--annotated .poem__stanza + .poem__stanza {
  margin-top: 2.25em;
}
.poem__pt {
  position: relative;
}
.poem__number {
  position: absolute;
  inset-inline-start: -1.75rem;
  top: 0.35em;
  font-size: 0.75rem;
  color: var(--color-gold);
  font-variant-numeric: lining-nums;
}
.poem__pt span.block + span.block,
.poem__fa span + span {
  padding-inline-start: 1.5em;
}
.poem__fa {
  font-size: 1.15em;
  line-height: 2;
  color: var(--color-ink);
}
.poem--single {
  max-width: 36rem;
  margin-inline: auto;
}
.poem--parallel .poem__row {
  display: grid;
  gap: 0.5rem;
}
.poem--parallel .poem__fa {
  color: var(--color-cypress);
}
@media (min-width: 768px) {
  .poem--parallel .poem__row {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }
}
@media (max-width: 640px) {
  .poem__number {
    position: static;
    margin-inline-end: 0.5rem;
  }
}
</style>
