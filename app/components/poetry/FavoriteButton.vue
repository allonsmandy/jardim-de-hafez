<script setup lang="ts">
import { Heart } from '@lucide/vue'

const props = defineProps<{ poemId: string }>()
const { isFavorite, toggle } = useFavorites()
const active = computed(() => isFavorite(props.poemId))
</script>

<template>
  <button
    type="button"
    class="btn-quiet"
    :aria-pressed="active"
    :aria-label="active ? 'Nos favoritos' : 'Favoritar'"
    @click="toggle(poemId)"
  >
    <Heart class="size-4" :class="active && 'fill-wine text-wine'" aria-hidden="true" />
    <span class="hidden sm:inline">{{ active ? 'Nos favoritos' : 'Favoritar' }}</span>
  </button>
</template>
