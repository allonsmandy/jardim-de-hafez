<script setup lang="ts">
import { splitByGlossary } from '#shared/utils/glossary'

/**
 * Texto com os termos do glossário clicáveis: ao tocar, abre o modal com a
 * explicação simples. Use em qualquer texto corrido do site.
 */
const props = withDefaults(
  defineProps<{ text: string; as?: string; seen?: Set<string>; exclude?: string }>(),
  { as: 'span', seen: undefined, exclude: undefined },
)
const { matcher, open } = useGlossary()
const segments = computed(() =>
  splitByGlossary(props.text, matcher.value, props.seen ?? new Set(), props.exclude),
)
</script>

<template>
  <component :is="as"
    ><template v-for="(s, i) in segments" :key="i"
      ><button
        v-if="s.termId"
        type="button"
        class="glossary-term"
        :aria-label="`${s.text} — ver explicação`"
        @click="open(s.termId)"
      >
        {{ s.text }}</button
      ><template v-else>{{ s.text }}</template></template
    ></component
  >
</template>
