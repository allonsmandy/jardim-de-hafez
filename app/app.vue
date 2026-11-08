<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? `${title} · Jardim de Hafez` : 'Jardim de Hafez'),
})
useSeoMeta({ ogSiteName: 'Jardim de Hafez', ogLocale: 'pt_BR', twitterCard: 'summary' })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
