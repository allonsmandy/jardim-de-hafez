<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="rounded-sm border border-dashed border-line bg-paper/40 px-6 py-12 text-center">
    <OrnamentDivider class="mb-5" />
    <h2 class="text-2xl">{{ title }}</h2>
    <p v-if="description" class="mx-auto mt-3 max-w-xl text-ink-muted">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6"><slot /></div>
  </div>
</template>
