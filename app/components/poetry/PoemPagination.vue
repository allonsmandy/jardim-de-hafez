<script setup lang="ts">
const props = defineProps<{ page: number; totalPages: number }>()
const emit = defineEmits<{ change: [page: number] }>()
const pages = computed(() => Array.from({ length: props.totalPages }, (_, i) => i + 1))
</script>

<template>
  <nav
    v-if="totalPages > 1"
    aria-label="Paginação"
    class="flex flex-wrap items-center justify-center gap-1"
  >
    <button type="button" class="btn-quiet" :disabled="page <= 1" @click="emit('change', page - 1)">
      ← Anterior
    </button>
    <button
      v-for="p in pages"
      :key="p"
      type="button"
      class="size-10 rounded-full text-sm"
      :class="p === page ? 'bg-wine text-ivory' : 'hover:bg-paper'"
      :aria-current="p === page ? 'page' : undefined"
      @click="emit('change', p)"
    >
      {{ p }}
    </button>
    <button
      type="button"
      class="btn-quiet"
      :disabled="page >= totalPages"
      @click="emit('change', page + 1)"
    >
      Próxima →
    </button>
  </nav>
</template>
