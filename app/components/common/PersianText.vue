<script setup lang="ts">
/** Envolve texto persa com idioma, direção e tipografia corretos (inclusive dentro de texto em português). */
withDefaults(defineProps<{ as?: string; block?: boolean }>(), { as: 'span', block: false })
</script>

<template>
  <component
    :is="as"
    lang="fa"
    dir="rtl"
    :class="block ? 'block text-right' : 'inline-block'"
    style="unicode-bidi: isolate"
  >
    <slot />
  </component>
</template>
