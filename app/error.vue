<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
useSeoMeta({ title: notFound.value ? 'Página não encontrada' : 'Erro', robots: 'noindex' })
</script>

<template>
  <NuxtLayout>
    <div class="container-reading py-24 text-center">
      <PersianText as="p" class="text-2xl text-cypress">{{
        notFound ? 'گم شده' : 'خطا'
      }}</PersianText>
      <h1 class="mt-2 text-4xl">
        {{ notFound ? 'Este caminho não existe no jardim' : 'Algo deu errado' }}
      </h1>
      <p class="mt-4 text-ink-muted">
        {{
          notFound
            ? 'A página procurada não existe ou o poema ainda não foi publicado.'
            : 'Tente novamente em instantes.'
        }}
      </p>
      <div class="mt-8 flex justify-center gap-3">
        <button type="button" class="btn-primary" @click="clearError({ redirect: '/' })">
          Voltar ao início
        </button>
        <NuxtLink to="/diva" class="btn-secondary">Ver o Divã</NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
