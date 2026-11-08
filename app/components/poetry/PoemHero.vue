<script setup lang="ts">
import { ArrowDown, Sparkles } from '@lucide/vue'
import type { Poem } from '#shared/schemas/poem'
import type { PoemCategory } from '#shared/utils/categories'
import { toPersianDigits } from '#shared/utils/text'

const props = defineProps<{
  poem: Poem
  category: PoemCategory
  heading: string
  headingIsPersian: boolean
  preliminary?: boolean
}>()

const stanzaCount = computed(
  () => props.poem.original?.stanzas.length ?? props.poem.translation?.stanzas.length ?? 0,
)
/** Minutos de leitura: poema + explicações, a ~180 palavras por minuto. */
const minutes = computed(() => {
  const text = [
    ...(props.poem.translation?.stanzas.flat() ?? []),
    ...props.poem.introduction,
    ...props.poem.stanzaNotes.flatMap((n) => [n.plain, n.meaning]),
  ].join(' ')
  return Math.max(1, Math.round(text.split(/\s+/).length / 180))
})

const heroEl = ref<HTMLElement>()
function onMove(e: PointerEvent) {
  const el = heroEl.value
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
  el.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
}
</script>

<template>
  <header ref="heroEl" class="hero" @pointermove="onMove">
    <NightAmbient />
    <div class="hero__far" aria-hidden="true">
      <span class="hero__watermark" lang="fa">{{ toPersianDigits(poem.number) }}</span>
    </div>

    <nav aria-label="Trilha" class="hero__crumbs container-editorial">
      <NuxtLink to="/diva">O Divã</NuxtLink>
      <span aria-hidden="true">›</span>
      <NuxtLink :to="{ path: '/diva', query: { categoria: category.id } }">
        {{ category.labelPlural }}
      </NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ category.label }} {{ poem.number }}</span>
    </nav>

    <div class="hero__stage">
      <PersianArch class="hero__arch" />
      <div class="hero__content">
        <div class="medallion" aria-hidden="true">
          <svg viewBox="0 0 100 100" class="medallion__star">
            <rect x="18" y="18" width="64" height="64" />
            <rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)" />
            <circle cx="50" cy="50" r="40" />
          </svg>
          <span lang="fa" class="medallion__number">{{ toPersianDigits(poem.number) }}</span>
        </div>
        <p class="hero__eyebrow">Hafez · {{ category.label }} {{ poem.number }}</p>

        <PersianText
          v-if="!headingIsPersian"
          as="p"
          block
          class="hero__fa"
          :aria-label="poem.firstLine.fa"
          >{{ poem.firstLine.fa }}</PersianText
        >
        <h1 class="hero__title" v-bind="headingIsPersian ? { lang: 'fa', dir: 'rtl' } : {}">
          {{ heading }}
        </h1>
        <p v-if="poem.editorialTitle" class="mt-2 text-xs text-ivory/60">
          Título editorial; o original não tem título.
        </p>

        <ul v-if="poem.themes.length" class="hero__themes" aria-label="Temas">
          <li
            v-for="(theme, i) in poem.themes"
            :key="theme"
            :style="{ animationDelay: `${1.4 + i * 0.12}s` }"
          >
            {{ theme }}
          </li>
        </ul>

        <dl class="hero__meta">
          <div>
            <dt>Dísticos</dt>
            <dd>{{ stanzaCount }}</dd>
          </div>
          <div>
            <dt>Leitura com explicações</dt>
            <dd>~{{ minutes }} min</dd>
          </div>
          <div v-if="preliminary">
            <dt>Tradução</dt>
            <dd class="inline-flex items-center gap-1">
              <Sparkles class="size-3.5" aria-hidden="true" /> preliminar (IA)
            </dd>
          </div>
        </dl>

        <a href="#ler" class="hero__cue">
          Começar a leitura <ArrowDown class="size-4" aria-hidden="true" />
        </a>
      </div>
    </div>

    <!-- Arcada: fileira de arcos persas fazendo a transição para o marfim -->
    <svg class="hero__arcade" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 40V22 Q25 0 50 22 Q75 0 100 22 Q125 0 150 22 Q175 0 200 22 Q225 0 250 22 Q275 0 300 22 Q325 0 350 22 Q375 0 400 22 Q425 0 450 22 Q475 0 500 22 Q525 0 550 22 Q575 0 600 22 Q625 0 650 22 Q675 0 700 22 Q725 0 750 22 Q775 0 800 22 Q825 0 850 22 Q875 0 900 22 Q925 0 950 22 Q975 0 1000 22 Q1025 0 1050 22 Q1075 0 1100 22 Q1125 0 1150 22 Q1175 0 1200 22 V40Z"
        fill="var(--color-ivory)"
      />
    </svg>
  </header>
</template>

<style scoped>
.hero {
  --mx: 0;
  --my: 0;
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 50% 35%, rgb(112 47 61 / 0.55), transparent 60%),
    radial-gradient(ellipse at 0% 100%, rgb(181 149 88 / 0.18), transparent 50%),
    radial-gradient(ellipse at 100% 0%, rgb(36 72 63 / 0.6), transparent 50%), #10201c;
}
.hero__far {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  transform: translate(calc(var(--mx) * -24px), calc(var(--my) * -16px));
  transition: transform 0.6s var(--ease-garden);
}
.hero__watermark {
  font-family: var(--font-persian);
  font-size: clamp(18rem, 48vw, 40rem);
  line-height: 1;
  color: rgb(181 149 88 / 0.06);
  animation: float 12s ease-in-out infinite;
}
.hero__crumbs {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 1.5rem;
  font-size: 0.85rem;
  color: rgb(247 241 230 / 0.55);
}
.hero__crumbs a {
  color: rgb(247 241 230 / 0.75);
  text-decoration: none;
}
.hero__crumbs a:hover {
  color: var(--color-gold);
}
.hero__stage {
  position: relative;
  max-width: 46rem;
  margin-inline: auto;
  padding: 3rem 1.25rem 6rem;
  transform: translate(calc(var(--mx) * 8px), calc(var(--my) * 6px));
  transition: transform 0.6s var(--ease-garden);
}
.hero__arch {
  position: absolute;
  inset: 1rem 0 2rem;
  width: 100%;
  height: calc(100% - 3rem);
  color: rgb(181 149 88 / 0.55);
}
.hero__arch :deep(path) {
  stroke-dasharray: 1;
  animation: draw 2.6s 0.1s var(--ease-garden) both;
}
.hero__content {
  position: relative;
  text-align: center;
  padding-top: 2.5rem;
}

/* Medalhão: estrela de oito pontas girando devagar */
.medallion {
  position: relative;
  display: grid;
  place-items: center;
  width: 5.5rem;
  height: 5.5rem;
  margin-inline: auto;
  animation: pop 0.9s 0.2s var(--ease-garden) both;
}
.medallion__star {
  position: absolute;
  inset: 0;
  fill: rgb(112 47 61 / 0.6);
  stroke: var(--color-gold);
  stroke-width: 1.2;
  animation: spin 40s linear infinite;
}
.medallion__star circle {
  fill: none;
  stroke-width: 0.6;
  stroke-dasharray: 2 3;
}
.medallion__number {
  position: relative;
  font-family: var(--font-persian);
  font-size: 1.9rem;
  color: #f1dca8;
}
.hero__eyebrow {
  margin-top: 1.25rem;
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-gold);
  animation: fade 1s 0.4s both;
}

/* O verso persa "se escreve" da direita para a esquerda, depois cintila */
.hero__fa {
  margin-top: 1.5rem;
  text-align: center !important;
  font-size: clamp(1.8rem, 4.6vw, 3.1rem);
  line-height: 1.9;
  background: linear-gradient(100deg, #d9b97a 40%, #fff3d1 50%, #d9b97a 60%);
  background-size: 300% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation:
    write 2.2s 0.5s cubic-bezier(0.6, 0.1, 0.3, 1) both,
    shimmer 8s 3.5s ease-in-out infinite;
}
.hero__title {
  max-width: 34rem;
  margin: 1rem auto 0;
  font-size: clamp(1.6rem, 3.4vw, 2.4rem);
  font-style: italic;
  line-height: 1.25;
  color: var(--color-ivory);
  animation: rise 1.2s 1.6s var(--ease-garden) both;
}
.hero__themes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}
.hero__themes li {
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--color-ivory);
  background: rgb(247 241 230 / 0.07);
  border: 1px solid rgb(181 149 88 / 0.35);
  backdrop-filter: blur(4px);
  animation: rise 0.8s var(--ease-garden) both;
}
.hero__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 2.25rem;
  margin-top: 2.25rem;
  animation: fade 1s 2s both;
}
.hero__meta dt {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgb(247 241 230 / 0.5);
}
.hero__meta dd {
  margin-top: 0.15rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  color: #f1dca8;
  font-variant-numeric: lining-nums;
}
.hero__cue {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  color: var(--color-ink);
  background: var(--color-gold);
  text-decoration: none;
  animation: fade 1s 2.3s both;
  transition: background 0.2s;
}
.hero__cue:hover {
  color: var(--color-ink);
  background: #f1dca8;
}
.hero__cue svg {
  animation: float 2.4s ease-in-out infinite;
}
.hero__arcade {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  width: 100%;
  height: 2.25rem;
}

@keyframes write {
  from {
    clip-path: inset(0 0 0 100%);
    opacity: 0.2;
  }
  to {
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}
@keyframes shimmer {
  0%,
  60%,
  100% {
    background-position: 100% 0;
  }
  30% {
    background-position: 0 0;
  }
}
@keyframes draw {
  from {
    stroke-dashoffset: 1;
  }
}
@keyframes spin {
  to {
    rotate: 360deg;
  }
}
@keyframes pop {
  from {
    opacity: 0;
    scale: 0.4;
    rotate: -90deg;
  }
}
@keyframes rise {
  from {
    opacity: 0;
    translate: 0 18px;
  }
}
@keyframes fade {
  from {
    opacity: 0;
  }
}
@keyframes float {
  50% {
    translate: 0 -10px;
  }
}
</style>
