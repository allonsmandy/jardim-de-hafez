<script setup lang="ts">
import { BookOpen, X } from '@lucide/vue'

const { current, close } = useGlossary()
const dialog = ref<HTMLDialogElement>()
const showFull = ref(false)

watch(current, (entry) => {
  showFull.value = false
  if (!dialog.value) return
  if (entry && !dialog.value.open) dialog.value.showModal()
  if (!entry && dialog.value.open) dialog.value.close()
})

function onBackdrop(event: MouseEvent) {
  if (event.target === dialog.value) close()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="glossary-dialog"
    aria-labelledby="glossario-titulo"
    @close="close"
    @click="onBackdrop"
  >
    <div v-if="current" class="relative">
      <div class="glossary-dialog__band" aria-hidden="true">
        <span lang="fa" dir="rtl">{{ current.termFa }}</span>
      </div>
      <button type="button" class="glossary-dialog__close" aria-label="Fechar" @click="close">
        <X class="size-5" aria-hidden="true" />
      </button>
      <div class="px-6 pt-5 pb-6 sm:px-8">
        <p class="eyebrow flex items-center gap-2">
          <BookOpen class="size-3.5" aria-hidden="true" /> Glossário
        </p>
        <h2 id="glossario-titulo" class="mt-2 text-3xl">{{ current.term }}</h2>
        <p class="mt-1 text-sm text-ink-muted">
          <PersianText class="text-base text-cypress">{{ current.termFa }}</PersianText>
          · pronuncia-se <em>{{ current.transliteration }}</em>
        </p>
        <p class="mt-5 text-lg leading-relaxed text-ink">{{ current.short }}</p>
        <div v-if="showFull" class="mt-4 border-t border-line pt-4 text-ink-muted">
          {{ current.definition }}
        </div>
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <button v-if="!showFull" type="button" class="btn-secondary" @click="showFull = true">
            Saber mais
          </button>
          <NuxtLink :to="`/glossario#${current.id}`" class="text-sm" @click="close">
            Ver todas as palavras
          </NuxtLink>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.glossary-dialog {
  width: min(32rem, calc(100vw - 2rem));
  max-height: calc(100dvh - 2rem);
  margin: auto;
  padding: 0;
  border: 0;
  border-radius: 1rem;
  background: var(--color-ivory);
  color: var(--color-ink);
  box-shadow: 0 30px 60px -20px rgb(40 37 34 / 0.45);
  overflow: auto;
}
.glossary-dialog::backdrop {
  background: rgb(36 72 63 / 0.45);
  backdrop-filter: blur(2px);
}
.glossary-dialog[open] {
  animation: rise 0.25s var(--ease-garden);
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
}
.glossary-dialog__band {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 5.5rem;
  padding-inline: 2rem;
  background:
    radial-gradient(circle at 20% 120%, rgb(201 148 153 / 0.35), transparent 60%),
    var(--color-cypress);
  color: rgb(247 241 230 / 0.9);
  font-size: 2.5rem;
}
.glossary-dialog__close {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  color: var(--color-ivory);
  background: rgb(0 0 0 / 0.15);
}
.glossary-dialog__close:hover {
  background: rgb(0 0 0 / 0.3);
}
</style>
