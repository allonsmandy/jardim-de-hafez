<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; titleFa?: string; lead?: string }>()
</script>

<template>
  <header class="container-reading pt-14 pb-10 text-center sm:pt-20">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h1 class="mt-3 text-4xl sm:text-5xl">{{ title }}</h1>
    <PersianText v-if="titleFa" as="p" class="mt-1 text-xl text-cypress">{{ titleFa }}</PersianText>
    <p v-if="lead" class="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">
      <GlossaryText :text="lead" />
    </p>
    <OrnamentDivider class="mt-8" />
  </header>
</template>
