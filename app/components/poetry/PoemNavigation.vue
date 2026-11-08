<script setup lang="ts">
import type { PoemNeighbors } from '#shared/schemas/poem'
import { getCategory, poemPath } from '#shared/utils/categories'

defineProps<{ neighbors: PoemNeighbors }>()
</script>

<template>
  <nav aria-label="Poemas vizinhos" class="grid gap-4 sm:grid-cols-2">
    <NuxtLink
      v-if="neighbors.previous"
      :to="poemPath(neighbors.previous)"
      rel="prev"
      class="group rounded-sm border border-line p-4 no-underline hover:border-wine/50"
    >
      <span class="text-xs text-ink-muted"
        >← {{ getCategory(neighbors.previous.category).label }}
        {{ neighbors.previous.number }}</span
      >
      <span class="mt-1 block truncate text-ink group-hover:text-wine">{{
        neighbors.previous.firstLine.pt ?? neighbors.previous.firstLine.fa
      }}</span>
    </NuxtLink>
    <span v-else />
    <NuxtLink
      v-if="neighbors.next"
      :to="poemPath(neighbors.next)"
      rel="next"
      class="group rounded-sm border border-line p-4 text-right no-underline hover:border-wine/50"
    >
      <span class="text-xs text-ink-muted"
        >{{ getCategory(neighbors.next.category).label }} {{ neighbors.next.number }} →</span
      >
      <span class="mt-1 block truncate text-ink group-hover:text-wine">{{
        neighbors.next.firstLine.pt ?? neighbors.next.firstLine.fa
      }}</span>
    </NuxtLink>
  </nav>
</template>
