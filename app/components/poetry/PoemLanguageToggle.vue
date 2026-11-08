<script setup lang="ts">
import type { ReadingMode } from '~/composables/useReadingPreferences'

const props = defineProps<{ available: ReadingMode[] }>()
const mode = defineModel<ReadingMode>({ required: true })

const LABELS: Record<ReadingMode, string> = {
  paralelo: 'Lado a lado',
  portugues: 'Português',
  persa: 'فارسی',
}
const options = computed(() => props.available.map((value) => ({ value, label: LABELS[value] })))
</script>

<template>
  <fieldset
    v-if="options.length > 1"
    class="inline-flex rounded-full border border-line bg-ivory p-1"
  >
    <legend class="sr-only">Forma de leitura</legend>
    <label
      v-for="option in options"
      :key="option.value"
      class="cursor-pointer rounded-full px-3.5 py-1.5 text-sm transition-colors has-[:checked]:bg-wine has-[:checked]:text-ivory has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cypress"
    >
      <input
        v-model="mode"
        type="radio"
        name="modo-leitura"
        :value="option.value"
        class="sr-only"
      />
      <span
        :lang="option.value === 'persa' ? 'fa' : undefined"
        :class="option.value === 'persa' && 'leading-none'"
        >{{ option.label }}</span
      >
    </label>
  </fieldset>
</template>
