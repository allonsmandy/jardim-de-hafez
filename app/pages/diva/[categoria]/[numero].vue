<script setup lang="ts">
import type { Poem, PoemNeighbors } from '#shared/schemas/poem'
import type { Source } from '#shared/schemas/source'
import type { GlossaryEntry } from '#shared/schemas/glossary'
import type { PublicationCheck } from '#shared/utils/publication'
import { getCategory, getCategoryBySlug, poemPath } from '#shared/utils/categories'
import { ArrowLeft, ArrowRight } from '@lucide/vue'

interface PoemResponse {
  poem: Poem
  publication: PublicationCheck
  neighbors: PoemNeighbors
  sources: Source[]
  glossary: GlossaryEntry[]
}

const route = useRoute()
const category = getCategoryBySlug(String(route.params.categoria))
const number = Number(route.params.numero)
if (!category || !Number.isInteger(number) || number < 1) {
  throw createError({ statusCode: 404, message: 'Poema não encontrado', fatal: true })
}

const { data, error } = await useFetch<PoemResponse>(`/api/poems/${category.id}/${number}`)
if (error.value || !data.value) {
  throw createError({ statusCode: 404, message: 'Poema não encontrado', fatal: true })
}

const poem = computed(() => data.value!.poem)
const publication = computed(() => data.value!.publication)
const preliminary = computed(
  () => publication.value.level === 'preliminary' || poem.value.translation?.machineAssisted,
)
const { mode, study } = useReadingPreferences()

/* Progresso de leitura: fio dourado na barra fixa. */
const readingEl = ref<HTMLElement>()
const progress = ref(0)
function updateProgress() {
  const el = readingEl.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const total = r.height - window.innerHeight * 0.5
  progress.value = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / Math.max(total, 1)))
}
onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
})
const showPersianInStudy = ref(true)
const { open: openTerm } = useGlossary()
const glossarySeen = new Set<string>()
const available = computed(() =>
  poem.value.translation && poem.value.original
    ? (['paralelo', 'portugues', 'persa'] as const).slice()
    : [],
)
const heading = computed(
  () => poem.value.editorialTitle ?? poem.value.firstLine.pt ?? poem.value.firstLine.fa,
)
const headingIsPersian = computed(() => !poem.value.editorialTitle && !poem.value.firstLine.pt)
const credit = computed(
  () =>
    `Hafez, ${category.label} ${number}` +
    (poem.value.translation
      ? `, trad. ${poem.value.translation.translators.join(', ')}${preliminary.value ? ' (preliminar)' : ''}`
      : ''),
)

useSeoMeta({
  title: `${category.label} ${number} — ${heading.value}`,
  description:
    `${category.label} ${number} de Hafez de Shiraz, em persa e em português, com explicação verso a verso. ${poem.value.firstLine.pt ?? ''}`.trim(),
  ogType: 'article',
  robots: publication.value.publishable ? undefined : 'noindex, nofollow',
})
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: `${category.label} ${number}`,
        author: { '@type': 'Person', name: 'Hafez' },
        inLanguage: ['fa', 'pt-BR'],
        translator: poem.value.translation?.translators.map((name) => ({
          '@type': 'Person',
          name,
        })),
      }),
    },
  ],
})
</script>

<template>
  <article>
    <p v-if="!publication.publishable" class="bg-cypress/10 py-3 text-center text-sm text-cypress">
      Prévia editorial — status da tradução: {{ poem.translationStatus }}. Este poema não está
      publicado.
    </p>

    <PoemHero
      :poem="poem"
      :category="category!"
      :heading="heading"
      :heading-is-persian="headingIsPersian"
      :preliminary="!!preliminary"
    />

    <!-- Antes de ler -->
    <section class="container-editorial pt-14 pb-6">
      <BeginnerGuide class="mb-12" />
      <div class="intro-grid">
        <div v-if="poem.introduction.length" v-reveal aria-labelledby="sobre-poema">
          <p class="eyebrow">Para entrar no poema</p>
          <h2 id="sobre-poema" class="mt-2 text-4xl sm:text-5xl">Antes de ler</h2>
          <div class="intro-text mt-8">
            <GlossaryText
              v-for="(paragraph, i) in poem.introduction"
              :key="i"
              as="p"
              :text="paragraph"
              :seen="glossarySeen"
            />
          </div>
        </div>
        <aside v-reveal="150" class="side">
          <div class="side__card">
            <p class="side__title">Neste poema</p>
            <dl class="side__facts">
              <div>
                <dt>Dísticos</dt>
                <dd>{{ poem.original?.stanzas.length ?? poem.translation?.stanzas.length }}</dd>
              </div>
              <div>
                <dt>Forma</dt>
                <dd>{{ category!.label }}</dd>
              </div>
            </dl>
            <template v-if="data!.glossary.length">
              <p class="side__subtitle">Palavras para conhecer</p>
              <ul class="side__terms">
                <li v-for="entry in data!.glossary" :key="entry.id">
                  <button type="button" class="term-chip" @click="openTerm(entry.id)">
                    {{ entry.term }}
                  </button>
                </li>
              </ul>
            </template>
          </div>
          <PreliminaryNotice
            v-if="preliminary"
            :translators="poem.translation?.translators"
            class="mt-4"
          />
        </aside>
      </div>
    </section>

    <!-- Barra de leitura + poema: a barra só fica fixa enquanto o poema está na tela -->
    <div>
      <div id="ler" class="toolbar">
        <div
          class="container-editorial flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2.5"
        >
          <div class="flex flex-wrap items-center gap-3">
            <fieldset v-if="poem.stanzaNotes.length" class="segmented">
              <legend class="sr-only">Como ler</legend>
              <label>
                <input v-model="study" type="radio" name="estudo" :value="true" class="sr-only" />
                <span>Estudar</span>
              </label>
              <label>
                <input v-model="study" type="radio" name="estudo" :value="false" class="sr-only" />
                <span>Só ler</span>
              </label>
            </fieldset>
            <PoemLanguageToggle v-if="!study" v-model="mode" :available="available" />
            <label v-else class="persian-switch">
              <input v-model="showPersianInStudy" type="checkbox" class="sr-only" />
              <span class="persian-switch__track" aria-hidden="true"><span /></span>
              <span class="sm:hidden">Persa</span>
              <span class="hidden sm:inline">Mostrar o persa</span>
            </label>
          </div>
          <PoemActions
            :poem-id="poem.id"
            :title="`${category!.label} ${number} — Hafez`"
            :stanzas="poem.translation?.stanzas"
            :credit="credit"
            :path="poemPath(poem)"
          />
        </div>
        <div class="toolbar__progress" :style="{ scale: `${progress} 1` }" aria-hidden="true" />
      </div>

      <!-- O poema -->
      <div ref="readingEl" class="reading">
        <div class="container-editorial py-16">
          <Transition name="swap" mode="out-in">
            <div v-if="study && poem.stanzaNotes.length" key="estudo" class="mx-auto max-w-4xl">
              <PoemStudy
                :original="poem.original?.stanzas"
                :translation="poem.translation?.stanzas"
                :notes="poem.stanzaNotes"
                :show-persian="showPersianInStudy"
              />
            </div>
            <div v-else key="leitura" class="manuscript">
              <span class="manuscript__corner manuscript__corner--tl" aria-hidden="true" />
              <span class="manuscript__corner manuscript__corner--tr" aria-hidden="true" />
              <span class="manuscript__corner manuscript__corner--bl" aria-hidden="true" />
              <span class="manuscript__corner manuscript__corner--br" aria-hidden="true" />
              <p class="manuscript__head" aria-hidden="true"><span /><i /><span /></p>
              <PoemReader
                :original="poem.original?.stanzas"
                :translation="poem.translation?.stanzas"
                :mode="mode"
              />
              <OrnamentDivider class="mt-12" />
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Curiosidades -->
    <section v-if="poem.culturalNotes.length" aria-labelledby="notas" class="curiosities">
      <GirihPattern class="curiosities__pattern" :size="88" />
      <div class="container-editorial relative py-20">
        <p class="eyebrow text-center !text-rose">Para ir além</p>
        <h2 id="notas" class="mt-2 text-center text-4xl !text-ivory">Curiosidades</h2>
        <div class="mt-12 grid gap-5 md:grid-cols-2">
          <article
            v-for="(note, i) in poem.culturalNotes"
            :key="i"
            v-reveal="i * 120"
            class="curiosity"
          >
            <span class="curiosity__n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 v-if="note.title" class="mt-3 font-display text-2xl !text-ivory">
              {{ note.title }}
            </h3>
            <GlossaryText as="p" :text="note.body" class="mt-2 leading-relaxed text-ivory/85" />
          </article>
        </div>
      </div>
    </section>

    <!-- Próximos poemas -->
    <nav aria-label="Poemas vizinhos" class="container-editorial grid gap-5 pt-20 md:grid-cols-2">
      <NuxtLink
        v-if="data!.neighbors.previous"
        :to="poemPath(data!.neighbors.previous)"
        rel="prev"
        class="neighbor"
      >
        <span class="neighbor__label">
          <ArrowLeft class="size-4" aria-hidden="true" />
          {{ getCategory(data!.neighbors.previous.category).label }}
          {{ data!.neighbors.previous.number }}
        </span>
        <PersianText as="span" block class="neighbor__fa">{{
          data!.neighbors.previous.firstLine.fa
        }}</PersianText>
        <span class="neighbor__pt">{{ data!.neighbors.previous.firstLine.pt }}</span>
      </NuxtLink>
      <span v-else />
      <NuxtLink
        v-if="data!.neighbors.next"
        :to="poemPath(data!.neighbors.next)"
        rel="next"
        class="neighbor neighbor--next"
      >
        <span class="neighbor__label justify-end">
          {{ getCategory(data!.neighbors.next.category).label }}
          {{ data!.neighbors.next.number }}
          <ArrowRight class="size-4" aria-hidden="true" />
        </span>
        <PersianText as="span" block class="neighbor__fa">{{
          data!.neighbors.next.firstLine.fa
        }}</PersianText>
        <span class="neighbor__pt">{{ data!.neighbors.next.firstLine.pt }}</span>
      </NuxtLink>
    </nav>

    <div class="container-reading py-16">
      <PoemCredits :poem="poem" :sources="data!.sources" />
    </div>
  </article>
</template>

<style scoped>
/* ── Antes de ler ── */
.intro-grid {
  display: grid;
  gap: 2.5rem;
}
@media (min-width: 1024px) {
  .intro-grid {
    grid-template-columns: 1.6fr 1fr;
    gap: 4rem;
    align-items: start;
  }
  .side {
    position: sticky;
    top: 6rem;
  }
}
.intro-text {
  display: grid;
  gap: 1.25rem;
  font-size: 1.08rem;
  line-height: 1.8;
  color: var(--color-ink-muted);
}
.intro-text > p:first-child {
  color: var(--color-ink);
}
.intro-text > p:first-child::first-letter {
  float: left;
  margin: 0.3rem 0.65rem 0 0;
  font-family: var(--font-display);
  font-size: 4.4rem;
  line-height: 0.8;
  color: var(--color-wine);
}
.side__card {
  padding: 1.75rem;
  border-radius: 1.5rem;
  background: radial-gradient(circle at 100% 0%, rgb(181 149 88 / 0.18), transparent 50%), #fffdf8;
  border: 1px solid var(--color-line);
  box-shadow: 0 30px 60px -45px rgb(40 37 34 / 0.45);
}
.side__title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--color-wine);
}
.side__facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px dashed var(--color-line);
}
.side__facts dt {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
.side__facts dd {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--color-ink);
  font-variant-numeric: lining-nums;
}
.side__subtitle {
  margin-top: 1.25rem;
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-cypress);
}
.side__terms {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.85rem;
}
.term-chip {
  border-radius: 999px;
  border: 1px solid rgb(181 149 88 / 0.55);
  padding: 0.35rem 0.9rem;
  font-size: 0.9rem;
  color: var(--color-wine-deep);
  background: rgb(181 149 88 / 0.08);
  transition:
    background 0.2s,
    transform 0.2s var(--ease-garden);
}
.term-chip:hover {
  background: rgb(181 149 88 / 0.22);
  transform: translateY(-2px);
}

/* ── Barra de leitura ── */
.toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  margin-top: 2rem;
  scroll-margin-top: 0;
  border-block: 1px solid var(--color-line);
  background: rgb(247 241 230 / 0.88);
  backdrop-filter: blur(10px) saturate(1.2);
}
.toolbar__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  transform-origin: left;
  background: linear-gradient(90deg, var(--color-gold), var(--color-wine));
  transition: scale 0.15s linear;
}
.segmented {
  display: inline-flex;
  padding: 0.25rem;
  border-radius: 999px;
  background: var(--color-paper);
  border: 1px solid var(--color-line);
}
.segmented label span {
  display: block;
  padding: 0.45rem 1.1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    background 0.3s var(--ease-garden),
    color 0.3s;
}
.segmented label:has(:checked) span {
  background: var(--color-wine);
  color: var(--color-ivory);
  box-shadow: 0 6px 14px -8px rgb(112 47 61 / 0.7);
}
.segmented label:has(:focus-visible) span {
  outline: 2px solid var(--color-cypress);
  outline-offset: 2px;
}
.persian-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-ink-muted);
}
.persian-switch__track {
  position: relative;
  width: 2.4rem;
  height: 1.35rem;
  border-radius: 999px;
  background: var(--color-line);
  transition: background 0.3s;
}
.persian-switch__track span {
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  width: 1.05rem;
  height: 1.05rem;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
  transition: translate 0.3s var(--ease-garden);
}
.persian-switch:has(:checked) .persian-switch__track {
  background: var(--color-cypress);
}
.persian-switch:has(:checked) .persian-switch__track span {
  translate: 1.05rem 0;
}
.persian-switch:has(:focus-visible) .persian-switch__track {
  outline: 2px solid var(--color-cypress);
  outline-offset: 2px;
}

/* ── Área de leitura ── */
.reading {
  background:
    radial-gradient(ellipse at 50% 0%, rgb(181 149 88 / 0.08), transparent 40%), var(--color-ivory);
}
.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.35s var(--ease-garden),
    translate 0.35s var(--ease-garden);
}
.swap-enter-from {
  opacity: 0;
  translate: 0 16px;
}
.swap-leave-to {
  opacity: 0;
  translate: 0 -8px;
}

/* Página de manuscrito: moldura dupla dourada com cantos ornamentados */
.manuscript {
  position: relative;
  max-width: 64rem;
  margin-inline: auto;
  padding: 3.5rem 1.5rem;
  border-radius: 0.5rem;
  background:
    radial-gradient(ellipse at 50% 0%, rgb(181 149 88 / 0.12), transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgb(201 148 153 / 0.1), transparent 50%), #fffcf4;
  border: 1px solid rgb(181 149 88 / 0.55);
  box-shadow:
    inset 0 0 0 6px #fffcf4,
    inset 0 0 0 7px rgb(181 149 88 / 0.45),
    0 40px 80px -50px rgb(40 37 34 / 0.5);
}
@media (min-width: 640px) {
  .manuscript {
    padding: 4.5rem 4rem;
  }
}
.manuscript__corner {
  position: absolute;
  width: 2.2rem;
  height: 2.2rem;
  background: var(--color-gold);
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
  opacity: 0.85;
}
.manuscript__corner--tl {
  top: -1.1rem;
  left: -1.1rem;
}
.manuscript__corner--tr {
  top: -1.1rem;
  right: -1.1rem;
}
.manuscript__corner--bl {
  bottom: -1.1rem;
  left: -1.1rem;
}
.manuscript__corner--br {
  bottom: -1.1rem;
  right: -1.1rem;
}
.manuscript__head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  margin-bottom: 2.75rem;
}
.manuscript__head span {
  width: 5rem;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold));
}
.manuscript__head span:last-child {
  background: linear-gradient(270deg, transparent, var(--color-gold));
}
.manuscript__head i {
  width: 1.1rem;
  height: 1.1rem;
  background: var(--color-wine);
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
}
.manuscript :deep(.poem__pt) {
  font-family: var(--font-display);
  font-size: 1.3em;
  line-height: 1.5;
}

/* ── Curiosidades ── */
.curiosities {
  position: relative;
  overflow: hidden;
  margin-top: 2rem;
  color: var(--color-ivory);
  background:
    radial-gradient(circle at 0% 100%, rgb(201 148 153 / 0.22), transparent 45%),
    radial-gradient(circle at 100% 0%, rgb(181 149 88 / 0.18), transparent 45%),
    var(--color-cypress);
}
.curiosities__pattern {
  position: absolute;
  inset: 0;
  color: rgb(247 241 230 / 0.05);
}
.curiosity {
  padding: 2rem;
  border-radius: 1.25rem;
  background: rgb(247 241 230 / 0.06);
  border: 1px solid rgb(247 241 230 / 0.14);
  backdrop-filter: blur(4px);
  transition:
    opacity 0.9s var(--ease-garden),
    translate 0.9s var(--ease-garden),
    background 0.3s;
  transition-delay: var(--reveal-delay, 0ms), var(--reveal-delay, 0ms), 0s;
}
.curiosity:hover {
  background: rgb(247 241 230 / 0.1);
}
.curiosity__n {
  font-family: var(--font-display);
  font-size: 2.5rem;
  line-height: 1;
  color: var(--color-gold);
  font-variant-numeric: lining-nums;
}
.curiosities :deep(.glossary-term) {
  text-decoration-color: var(--color-rose);
}
.curiosities :deep(.glossary-term:hover) {
  color: var(--color-ivory);
}

/* ── Vizinhos ── */
.neighbor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.75rem 2rem;
  border-radius: 1.5rem;
  text-decoration: none;
  color: var(--color-ink);
  background: #fffdf8;
  border: 1px solid var(--color-line);
  transition:
    transform 0.35s var(--ease-garden),
    box-shadow 0.35s var(--ease-garden),
    border-color 0.35s;
}
.neighbor:hover {
  color: var(--color-ink);
  transform: translateY(-4px);
  border-color: rgb(181 149 88 / 0.6);
  box-shadow: 0 30px 60px -40px rgb(112 47 61 / 0.45);
}
.neighbor--next {
  text-align: right;
  color: var(--color-ivory);
  background:
    radial-gradient(circle at 100% 0%, rgb(201 148 153 / 0.3), transparent 50%), var(--color-wine);
  border-color: transparent;
}
.neighbor--next:hover {
  color: var(--color-ivory);
}
.neighbor__label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-cypress);
}
.neighbor--next .neighbor__label {
  color: var(--color-rose);
}
.neighbor__fa {
  font-size: 1.5rem;
  color: var(--color-cypress);
}
.neighbor--next .neighbor__fa {
  color: #f1dca8;
}
.neighbor__pt {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-style: italic;
}
</style>
