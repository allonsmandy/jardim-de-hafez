<script setup lang="ts">
import { ArrowRight, RotateCcw } from '@lucide/vue'
import type { Poem } from '#shared/schemas/poem'
import { getCategory, poemPath } from '#shared/utils/categories'
import { toPersianDigits } from '#shared/utils/text'

const props = defineProps<{ poem: Poem }>()
const emit = defineEmits<{ again: [] }>()
const category = computed(() => getCategory(props.poem.category))
const heading = ref<HTMLElement>()
onMounted(() => heading.value?.focus())

const firstFa = computed(() => props.poem.original?.stanzas[0])
const firstPt = computed(() => props.poem.translation?.stanzas[0])
const plain = computed(() => props.poem.stanzaNotes.find((n) => n.stanza === 1)?.plain)
</script>

<template>
  <section class="result" aria-labelledby="fal-resultado">
    <header class="result__head">
      <p class="eyebrow !text-gold">O Divã se abriu em</p>
      <h2 id="fal-resultado" ref="heading" tabindex="-1" class="result__title">
        {{ category.label }} {{ poem.number }}
        <span lang="fa" class="result__title-fa">{{ toPersianDigits(poem.number) }}</span>
      </h2>
    </header>

    <!-- A resposta: pela tradição, o primeiro dístico -->
    <figure class="answer">
      <figcaption class="answer__label">A resposta · o primeiro dístico</figcaption>
      <PersianText v-if="firstFa" as="p" block class="answer__fa">
        <span v-for="(line, i) in firstFa" :key="i" class="block">{{ line }}</span>
      </PersianText>
      <span class="answer__divider" aria-hidden="true"><i /></span>
      <p v-if="firstPt" class="answer__pt">
        <span v-for="(line, i) in firstPt" :key="i" class="block">{{ line }}</span>
      </p>
      <p v-if="plain" class="answer__plain">
        <span>Em palavras simples:</span> <GlossaryText :text="plain" />
      </p>
    </figure>

    <!-- O livro aberto: página persa à direita, portuguesa à esquerda -->
    <div class="spread">
      <div class="spread__page spread__page--pt" lang="pt-BR">
        <p class="spread__label">Em português</p>
        <ol class="spread__list">
          <li v-for="(st, i) in poem.translation?.stanzas" :key="i">
            <span v-for="(line, j) in st" :key="j" class="block">{{ line }}</span>
          </li>
        </ol>
      </div>
      <div class="spread__gutter" aria-hidden="true" />
      <div class="spread__page spread__page--fa" lang="fa" dir="rtl">
        <p class="spread__label">به فارسی</p>
        <ol class="spread__list">
          <li v-for="(st, i) in poem.original?.stanzas" :key="i">
            <span v-for="(line, j) in st" :key="j" class="block">{{ line }}</span>
          </li>
        </ol>
      </div>
    </div>
    <p class="result__credit">
      Hafez · {{ category.label }} {{ poem.number }} (ed. Qazvini-Ghani)
      <span v-if="poem.translation"> · trad. {{ poem.translation.translators.join(', ') }}</span>
      <PreliminaryNotice v-if="poem.translation?.machineAssisted" compact class="ml-2" />
    </p>

    <p class="result__note">
      Pela tradição, o primeiro dístico responde à pergunta e o resto do poema a aprofunda. A
      leitura é sua: o poema não prevê acontecimentos.
    </p>

    <div class="result__actions">
      <NuxtLink :to="poemPath(poem)" class="result__primary">
        Entender o poema, verso a verso <ArrowRight class="size-4" aria-hidden="true" />
      </NuxtLink>
      <button type="button" class="result__again" @click="emit('again')">
        <RotateCcw class="size-4" aria-hidden="true" /> Fazer nova consulta
      </button>
    </div>
    <div class="result__share">
      <PoemActions
        :poem-id="poem.id"
        :title="`Fal-e Hafez — ${category.label} ${poem.number}`"
        :stanzas="poem.translation?.stanzas"
        :credit="`Hafez, ${category.label} ${poem.number}`"
        :path="poemPath(poem)"
      />
    </div>
  </section>
</template>

<style scoped>
.result {
  display: grid;
  gap: 2.5rem;
  animation: appear 1s var(--ease-garden) both;
}
.result__head {
  text-align: center;
}
.result__title {
  margin-top: 0.5rem;
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  color: var(--color-ivory);
  outline: none;
}
.result__title-fa {
  margin-inline-start: 0.4rem;
  font-family: var(--font-persian);
  font-size: 0.7em;
  color: #d9b97a;
}

/* A resposta */
.answer {
  position: relative;
  max-width: 46rem;
  margin-inline: auto;
  padding: 2.5rem 1.5rem 2.25rem;
  border-radius: 1.75rem;
  text-align: center;
  background:
    radial-gradient(ellipse at 50% 0%, rgb(217 185 122 / 0.22), transparent 60%),
    rgb(247 241 230 / 0.06);
  border: 1px solid rgb(217 185 122 / 0.4);
  box-shadow: 0 0 80px -20px rgb(217 185 122 / 0.35);
  animation: appear 1.2s 0.2s var(--ease-garden) both;
}
@media (min-width: 640px) {
  .answer {
    padding: 3rem 3rem 2.5rem;
  }
}
.answer__label {
  font-size: 0.7rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-rose);
}
.answer__fa {
  margin-top: 1.25rem;
  text-align: center !important;
  font-size: clamp(1.4rem, 3.4vw, 2.1rem);
  line-height: 2;
  color: #f1dca8;
}
.answer__divider {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  margin: 1rem 0;
}
.answer__divider::before,
.answer__divider::after {
  content: '';
  width: 3.5rem;
  height: 1px;
  background: rgb(217 185 122 / 0.5);
}
.answer__divider i {
  width: 0.65rem;
  height: 0.65rem;
  background: #d9b97a;
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
}
.answer__pt {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(1.35rem, 2.8vw, 1.75rem);
  line-height: 1.4;
  color: var(--color-ivory);
}
.answer__plain {
  max-width: 34rem;
  margin: 1.75rem auto 0;
  padding-top: 1.25rem;
  border-top: 1px dashed rgb(217 185 122 / 0.3);
  font-size: 0.95rem;
  color: rgb(247 241 230 / 0.75);
}
.answer__plain > span:first-child {
  color: var(--color-rose);
}
.answer :deep(.glossary-term) {
  text-decoration-color: var(--color-rose);
}
.answer :deep(.glossary-term:hover) {
  color: var(--color-ivory);
}

/* Livro aberto */
.spread {
  display: grid;
  max-width: 64rem;
  width: 100%;
  margin-inline: auto;
  border-radius: 0.5rem;
  background: #fffaf0;
  box-shadow:
    0 0 0 1px rgb(217 185 122 / 0.6),
    0 0 0 8px rgb(74 28 38 / 0.9),
    0 0 0 9px rgb(217 185 122 / 0.5),
    0 50px 90px -30px rgb(0 0 0 / 0.7);
  animation: appear 1.2s 0.5s var(--ease-garden) both;
}
@media (min-width: 768px) {
  .spread {
    grid-template-columns: 1fr 2.5rem 1fr;
  }
}
.spread__page {
  padding: 2.25rem 1.5rem;
}
@media (min-width: 768px) {
  .spread__page {
    padding: 3rem 2.5rem;
  }
  .spread__page--pt {
    background: linear-gradient(270deg, rgb(181 149 88 / 0.18), transparent 18%);
  }
  .spread__page--fa {
    background: linear-gradient(90deg, rgb(181 149 88 / 0.18), transparent 18%);
  }
}
.spread__gutter {
  display: none;
}
@media (min-width: 768px) {
  .spread__gutter {
    display: block;
    background: linear-gradient(
      90deg,
      rgb(120 90 40 / 0.12),
      rgb(120 90 40 / 0.35) 50%,
      rgb(120 90 40 / 0.12)
    );
  }
}
@media (max-width: 767px) {
  .spread__page--fa {
    order: -1;
    border-bottom: 1px dashed var(--color-line);
  }
}
.spread__label {
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold);
}
.spread__page--fa .spread__label {
  letter-spacing: 0;
  font-size: 0.95rem;
}
.spread__list {
  display: grid;
  gap: 1.35rem;
}
.spread__page--pt .spread__list {
  font-family: var(--font-display);
  font-size: 1.2rem;
  line-height: 1.45;
  color: var(--color-ink);
}
.spread__page--pt .spread__list span + span {
  padding-left: 1.25em;
}
.spread__page--fa .spread__list {
  font-size: 1.2rem;
  line-height: 2;
  color: var(--color-cypress);
}
.spread__page--fa .spread__list span + span {
  padding-right: 1.25em;
}
.spread__list li:first-child {
  color: var(--color-wine);
}
.result__credit {
  margin-top: -1rem;
  text-align: center;
  font-size: 0.85rem;
  color: rgb(247 241 230 / 0.6);
}
.result__note {
  max-width: 36rem;
  margin-inline: auto;
  text-align: center;
  font-size: 0.95rem;
  color: rgb(247 241 230 / 0.7);
}
.result__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}
.result__primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  border-radius: 999px;
  text-decoration: none;
  color: var(--color-ink);
  background: linear-gradient(135deg, #f1dca8, #c9a35f);
  transition: transform 0.3s var(--ease-garden);
}
.result__primary:hover {
  color: var(--color-ink);
  transform: translateY(-2px);
}
.result__again {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  border-radius: 999px;
  color: var(--color-ivory);
  border: 1px solid rgb(247 241 230 / 0.35);
  transition: background 0.2s;
}
.result__again:hover {
  background: rgb(247 241 230 / 0.08);
}
.result__again:hover svg {
  rotate: -180deg;
  transition: rotate 0.5s var(--ease-garden);
}
.result__share {
  display: flex;
  justify-content: center;
  margin-top: -1.5rem;
}
.result__share :deep(.btn-quiet) {
  color: rgb(247 241 230 / 0.7);
}
.result__share :deep(.btn-quiet:hover) {
  color: var(--color-ivory);
  background: rgb(247 241 230 / 0.08);
}

@keyframes appear {
  from {
    opacity: 0;
    translate: 0 24px;
    filter: blur(6px);
  }
}
</style>
