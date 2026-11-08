<script setup lang="ts">
import { Sparkles } from '@lucide/vue'

const props = withDefaults(defineProps<{ compact?: boolean; translators?: string[] }>(), {
  compact: false,
  translators: () => [],
})

/** "Codex (IA, OpenAI)" → "Codex, da OpenAI" */
const who = computed(() =>
  props.translators.map((t) => t.replace(/^(.+?)\s*\(IA,\s*(.+)\)$/, '$1, da $2')).join(' e '),
)
</script>

<template>
  <span
    v-if="compact"
    class="inline-flex items-center gap-1 rounded-full bg-rose/20 px-2 py-0.5 text-[0.7rem] text-wine-deep"
  >
    <Sparkles class="size-3" aria-hidden="true" /> Tradução preliminar (IA)
  </span>
  <aside
    v-else
    class="rounded-2xl border border-rose/50 bg-rose/10 px-5 py-4 text-sm leading-relaxed text-ink"
    aria-label="Sobre esta tradução"
  >
    <p class="flex items-start gap-2">
      <Sparkles class="mt-0.5 size-4 shrink-0 text-wine" aria-hidden="true" />
      <span>
        <strong class="font-semibold">Tradução preliminar feita por inteligência artificial</strong>
        <template v-if="who">({{ who }})</template>, a partir do texto persa, ainda
        <strong>não revisada</strong> por especialistas. Pode conter erros de interpretação.
        Correções são bem-vindas.
        <NuxtLink to="/como-traduzimos">Como esta tradução foi feita</NuxtLink>
      </span>
    </p>
  </aside>
</template>
