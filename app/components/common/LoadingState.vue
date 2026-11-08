<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Carregando…' })
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    class="flex items-center justify-center gap-3 py-12 text-ink-muted"
  >
    <span class="size-2 animate-pulse rounded-full bg-rose" aria-hidden="true" />
    <span class="text-sm">{{ label }}</span>
  </div>
</template>
