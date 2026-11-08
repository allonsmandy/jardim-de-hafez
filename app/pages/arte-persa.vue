<script setup lang="ts">
import { ArrowLeft, ArrowRight, ExternalLink, Maximize2, ShieldCheck, X } from '@lucide/vue'
import type { Artwork, ArtRoom } from '#shared/schemas/artwork'

useSeoMeta({
  title: 'Arte Persa',
  description:
    'Manuscritos, miniaturas, caligrafia e tapetes persas ligados à poesia de Hafez — cada obra com acervo, data e licença verificados.',
})

const { data: art } = await useFetch<Artwork[]>('/api/art.json', { default: () => [] })
const { open: openTerm, entries: glossaryEntries } = useGlossary()

const ROOMS: { id: ArtRoom; n: string; fa: string; title: string; intro: string }[] = [
  {
    id: 'diva',
    n: '۱',
    fa: 'دیوان',
    title: 'O Divã nas mãos dos leitores',
    intro:
      'Manuscritos com poemas de Hafez, de Herat à Índia: como o Divã foi copiado, decorado e carregado por séculos.',
  },
  {
    id: 'shiraz',
    n: '۲',
    fa: 'شیراز',
    title: 'Shiraz no tempo de Hafez',
    intro:
      'Arte feita na cidade do poeta, quando ele era jovem — encomendada pelo mesmo vizir que ele elogia nos poemas.',
  },
  {
    id: 'imagens',
    n: '۳',
    fa: 'تصویر',
    title: 'O mundo dos poemas',
    intro:
      'Jardins, amantes lendários, dervixes: as imagens que Hafez usa, vistas pelos pintores persas.',
  },
]

const featured = computed(() => art.value.find((a) => a.id === 'dervixes-dancando'))
const byRoom = (room: ArtRoom) => art.value.filter((a) => a.room === room)
const termLabel = (id: string) => glossaryEntries.value.find((g) => g.id === id)?.term ?? id

/* Visor (lightbox) */
const dialogEl = ref<HTMLDialogElement>()
const currentIndex = ref(-1)
const current = computed(() => art.value[currentIndex.value])
function show(id: string) {
  currentIndex.value = art.value.findIndex((a) => a.id === id)
  dialogEl.value?.showModal()
}
function step(delta: number) {
  const n = art.value.length
  currentIndex.value = (currentIndex.value + delta + n) % n
}
function close() {
  dialogEl.value?.close()
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') step(1)
  if (e.key === 'ArrowLeft') step(-1)
}
function onBackdrop(e: MouseEvent) {
  if (e.target === dialogEl.value) close()
}
</script>

<template>
  <div>
    <!-- Abertura: o museu à noite -->
    <section class="hero">
      <NightAmbient :count="10" />
      <div
        class="container-editorial relative grid items-center gap-14 py-20 lg:grid-cols-[1fr_1fr] lg:py-28"
      >
        <div>
          <p class="eyebrow !text-gold">Galeria</p>
          <h1 class="hero__title">Arte Persa</h1>
          <PersianText as="p" class="hero__fa">هنر ایرانی</PersianText>
          <p class="hero__lead">
            Manuscritos, miniaturas, caligrafia e tapetes ligados à poesia de Hafez. Cada obra vem
            com acervo, data e licença verificados — e com uma explicação de por que ela está aqui.
          </p>
          <ul class="hero__rooms" aria-label="Salas da galeria">
            <li v-for="room in ROOMS" :key="room.id">
              <a :href="`#sala-${room.id}`">
                <span lang="fa">{{ room.n }}</span> {{ room.title }}
              </a>
            </li>
          </ul>
        </div>
        <button
          v-if="featured"
          type="button"
          class="hero__piece"
          :aria-label="`Ampliar: ${featured.title}`"
          @click="show(featured.id)"
        >
          <span class="spotlight" aria-hidden="true" />
          <span class="frame frame--hero">
            <img :src="featured.image.src" :alt="featured.image.alt" width="600" height="900" />
          </span>
          <span class="hero__caption">
            <span class="font-display text-xl text-ivory">{{ featured.title }}</span>
            <span class="text-sm text-ivory/60">{{ featured.date }} · {{ featured.place }}</span>
          </span>
        </button>
      </div>
      <svg class="arcade" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 40V22 Q25 0 50 22 Q75 0 100 22 Q125 0 150 22 Q175 0 200 22 Q225 0 250 22 Q275 0 300 22 Q325 0 350 22 Q375 0 400 22 Q425 0 450 22 Q475 0 500 22 Q525 0 550 22 Q575 0 600 22 Q625 0 650 22 Q675 0 700 22 Q725 0 750 22 Q775 0 800 22 Q825 0 850 22 Q875 0 900 22 Q925 0 950 22 Q975 0 1000 22 Q1025 0 1050 22 Q1075 0 1100 22 Q1125 0 1150 22 Q1175 0 1200 22 V40Z"
          fill="var(--color-ivory)"
        />
      </svg>
    </section>

    <!-- Salas -->
    <section
      v-for="room in ROOMS"
      :id="`sala-${room.id}`"
      :key="room.id"
      class="room"
      :class="`room--${room.id}`"
      :aria-labelledby="`titulo-${room.id}`"
    >
      <GirihPattern v-if="room.id === 'shiraz'" class="room__pattern" :size="88" />
      <div class="container-editorial relative py-20">
        <header v-reveal class="room__head">
          <span class="room__n" aria-hidden="true">
            <span lang="fa">{{ room.n }}</span>
          </span>
          <div>
            <p class="room__label">
              Sala {{ ROOMS.indexOf(room) + 1 }} · <span lang="fa">{{ room.fa }}</span>
            </p>
            <h2 :id="`titulo-${room.id}`" class="room__title">{{ room.title }}</h2>
            <p class="room__intro">{{ room.intro }}</p>
          </div>
        </header>

        <ul class="wall" :class="{ 'wall--pair': byRoom(room.id).length === 2 }">
          <li v-for="(work, i) in byRoom(room.id)" :key="work.id" v-reveal="(i % 3) * 120">
            <button
              type="button"
              class="work"
              :aria-label="`Ampliar: ${work.title}`"
              @click="show(work.id)"
            >
              <span class="frame">
                <img :src="work.image.src" :alt="work.image.alt" loading="lazy" />
                <span class="work__zoom" aria-hidden="true"><Maximize2 class="size-4" /></span>
              </span>
              <span class="work__plate">
                <span class="work__title">{{ work.title }}</span>
                <span class="work__meta">{{ work.date }} · {{ work.place }}</span>
              </span>
            </button>
            <p class="work__why"><GlossaryText :text="work.connection" /></p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Política -->
    <section class="container-editorial py-20">
      <div v-reveal class="policy">
        <ShieldCheck class="size-7 text-cypress" aria-hidden="true" />
        <div>
          <h2 class="font-display text-3xl">Só entra obra com origem verificada</h2>
          <p class="mt-3 text-ink-muted">
            Cada imagem desta galeria vem do programa <em>Open Access</em> do Metropolitan Museum of
            Art, de Nova York, que libera em domínio público (CC0) as fotos de obras sem direitos
            autorais. Título original, data, lugar, técnica e número de inventário são copiados da
            ficha oficial do museu, e cada obra tem link para ela. Os títulos em português e os
            textos são do projeto.
          </p>
          <p class="mt-3 text-ink-muted">
            Não usamos imagens sem autoria, data e licença — por isso a galeria cresce devagar.
            Conhece uma obra em acervo aberto ligada a Hafez? Ela pode entrar aqui.
          </p>
        </div>
      </div>
    </section>

    <!-- Visor -->
    <dialog
      ref="dialogEl"
      class="viewer"
      aria-labelledby="visor-titulo"
      @keydown="onKey"
      @click="onBackdrop"
      @close="currentIndex = -1"
    >
      <div v-if="current" class="viewer__inner">
        <div class="viewer__image">
          <img :key="current.id" :src="current.image.src" :alt="current.image.alt" />
          <div class="viewer__nav">
            <button type="button" aria-label="Obra anterior" @click="step(-1)">
              <ArrowLeft class="size-5" aria-hidden="true" />
            </button>
            <span class="text-sm text-ivory/70"> {{ currentIndex + 1 }} / {{ art.length }} </span>
            <button type="button" aria-label="Próxima obra" @click="step(1)">
              <ArrowRight class="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div class="viewer__text">
          <button type="button" class="viewer__close" aria-label="Fechar" @click="close">
            <X class="size-5" aria-hidden="true" />
          </button>
          <p class="eyebrow">{{ ROOMS.find((r) => r.id === current!.room)?.title }}</p>
          <h2 id="visor-titulo" class="mt-2 font-display text-3xl leading-tight">
            {{ current.title }}
          </h2>
          <p class="mt-1 text-sm text-ink-muted italic">{{ current.originalTitle }}</p>

          <p class="mt-5 leading-relaxed"><GlossaryText :text="current.description" /></p>
          <div class="viewer__why">
            <p class="text-[0.7rem] tracking-[0.18em] text-wine uppercase">Por que está aqui</p>
            <p class="mt-1.5 leading-relaxed"><GlossaryText :text="current.connection" /></p>
          </div>

          <ul v-if="current.glossary.length" class="mt-5 flex flex-wrap gap-2">
            <li v-for="id in current.glossary" :key="id">
              <button type="button" class="chip" @click="openTerm(id)">{{ termLabel(id) }}</button>
            </li>
          </ul>

          <dl class="viewer__meta">
            <dt>Data</dt>
            <dd>{{ current.date }}</dd>
            <dt>Lugar</dt>
            <dd>{{ current.place }}</dd>
            <template v-if="current.maker">
              <dt>Autoria</dt>
              <dd>{{ current.maker }}</dd>
            </template>
            <dt>Técnica</dt>
            <dd>{{ current.medium }}</dd>
            <template v-if="current.size">
              <dt>Dimensões</dt>
              <dd>{{ current.size }}</dd>
            </template>
            <dt>Acervo</dt>
            <dd>
              {{ current.collection.institution }} · inv. {{ current.collection.accession }} ·
              {{ current.collection.creditLine }}
            </dd>
            <dt>Licença</dt>
            <dd>{{ current.license.label }}</dd>
          </dl>

          <div class="mt-6 flex flex-wrap gap-2">
            <a :href="current.collection.url" target="_blank" rel="noopener" class="viewer__btn">
              Ficha no museu <ExternalLink class="size-3.5" aria-hidden="true" />
            </a>
            <a :href="current.image.full" target="_blank" rel="noopener" class="viewer__btn">
              Alta resolução <Maximize2 class="size-3.5" aria-hidden="true" />
            </a>
            <NuxtLink
              v-if="current.link"
              :to="current.link.to"
              class="viewer__btn viewer__btn--wine"
              @click="close"
            >
              {{ current.link.label }} <ArrowRight class="size-3.5" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
/* ── Abertura ── */
.hero {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 75% 45%, rgb(181 149 88 / 0.18), transparent 45%),
    radial-gradient(ellipse at 0% 100%, rgb(112 47 61 / 0.45), transparent 50%), #0f1b18;
}
.hero__title {
  margin-top: 0.75rem;
  font-size: clamp(3.4rem, 9vw, 6.5rem);
  line-height: 0.95;
  color: var(--color-ivory);
  animation: rise 1.1s var(--ease-garden) both;
}
.hero__fa {
  margin-top: 0.4rem;
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  color: #d9b97a;
  animation: rise 1.1s 0.1s var(--ease-garden) both;
}
.hero__lead {
  max-width: 32rem;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  color: rgb(247 241 230 / 0.78);
  animation: rise 1.1s 0.2s var(--ease-garden) both;
}
.hero__rooms {
  display: grid;
  gap: 0.5rem;
  margin-top: 2rem;
  animation: rise 1.1s 0.35s var(--ease-garden) both;
}
.hero__rooms a {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: rgb(247 241 230 / 0.85);
  text-decoration: none;
  transition: color 0.2s;
}
.hero__rooms a:hover {
  color: #f1dca8;
}
.hero__rooms [lang='fa'] {
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 999px;
  border: 1px solid rgb(217 185 122 / 0.5);
  color: #d9b97a;
}
.hero__piece {
  position: relative;
  justify-self: center;
  display: grid;
  justify-items: center;
  gap: 1.25rem;
  cursor: zoom-in;
  animation: rise 1.4s 0.3s var(--ease-garden) both;
}
.spotlight {
  position: absolute;
  inset: -20% -30% 10%;
  background: radial-gradient(ellipse at 50% 0%, rgb(255 236 190 / 0.28), transparent 60%);
  pointer-events: none;
}
.hero__caption {
  display: grid;
  text-align: center;
}
.arcade {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  width: 100%;
  height: 2.25rem;
}

/* ── Moldura: ouro + passe-partout ── */
.frame {
  position: relative;
  display: block;
  padding: 0.9rem;
  background: #fbf6ea;
  border: 6px solid transparent;
  border-image: linear-gradient(135deg, #e9cf94, #9c7a3c 40%, #f1dca8 60%, #8a6a2c) 1;
  box-shadow:
    0 30px 60px -30px rgb(0 0 0 / 0.55),
    inset 0 0 0 1px rgb(120 90 40 / 0.25);
  transition:
    transform 0.5s var(--ease-garden),
    box-shadow 0.5s var(--ease-garden);
}
.frame img {
  display: block;
  width: 100%;
  height: auto;
  box-shadow: 0 0 0 1px rgb(120 90 40 / 0.2);
}
.frame--hero {
  width: min(22rem, 78vw);
  padding: 1.2rem;
}
.hero__piece:hover .frame,
.work:hover .frame {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 40px 70px -30px rgb(0 0 0 / 0.6);
}

/* ── Salas ── */
.room {
  position: relative;
  overflow: hidden;
}
.room--shiraz {
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 100% 0%, rgb(201 148 153 / 0.3), transparent 50%), var(--color-wine);
}
.room--imagens {
  background: var(--color-paper);
  border-top: 1px solid var(--color-line);
}
.room__pattern {
  position: absolute;
  inset: 0;
  color: rgb(247 241 230 / 0.06);
}
.room__head {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  align-items: start;
  max-width: 48rem;
}
.room__n {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
  background: var(--color-gold);
  font-family: var(--font-persian);
  font-size: 1.3rem;
  color: var(--color-ink);
}
.room__label {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-cypress);
}
.room__label [lang='fa'] {
  letter-spacing: 0;
  font-size: 0.95rem;
}
.room--shiraz .room__label {
  color: var(--color-rose);
}
.room__title {
  margin-top: 0.25rem;
  font-size: clamp(2.2rem, 5vw, 3.2rem);
}
.room--shiraz .room__title {
  color: var(--color-ivory);
}
.room__intro {
  margin-top: 0.75rem;
  color: var(--color-ink-muted);
}
.room--shiraz .room__intro {
  color: rgb(247 241 230 / 0.8);
}

/* Parede: colunas em alvenaria */
.wall {
  margin-top: 3.5rem;
  columns: 1;
  column-gap: 2.5rem;
}
@media (min-width: 640px) {
  .wall {
    columns: 2;
  }
}
@media (min-width: 1024px) {
  .wall {
    columns: 3;
  }
  .wall--pair {
    columns: 2;
    max-width: 56rem;
  }
}
.wall > li {
  break-inside: avoid;
  margin-bottom: 3rem;
}
.work {
  display: block;
  width: 100%;
  text-align: left;
  cursor: zoom-in;
}
.work:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 6px;
}
.work__zoom {
  position: absolute;
  right: 1.4rem;
  bottom: 1.4rem;
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  color: var(--color-ivory);
  background: rgb(15 27 24 / 0.65);
  opacity: 0;
  transition: opacity 0.3s;
}
.work:hover .work__zoom,
.work:focus-visible .work__zoom {
  opacity: 1;
}
/* Plaquinha de museu */
.work__plate {
  display: grid;
  margin-top: 1rem;
  padding-left: 0.85rem;
  border-left: 2px solid var(--color-gold);
}
.work__title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  line-height: 1.2;
  color: var(--color-ink);
}
.work__meta {
  margin-top: 0.15rem;
  font-size: 0.82rem;
  color: var(--color-ink-muted);
}
.work__why {
  margin-top: 0.6rem;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--color-ink-muted);
}
.room--shiraz .work__title {
  color: var(--color-ivory);
}
.room--shiraz .work__meta,
.room--shiraz .work__why {
  color: rgb(247 241 230 / 0.75);
}
.room--shiraz :deep(.glossary-term) {
  text-decoration-color: var(--color-rose);
}
.room--shiraz :deep(.glossary-term:hover) {
  color: var(--color-ivory);
}

/* ── Política ── */
.policy {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  max-width: 52rem;
  margin-inline: auto;
  padding: 2rem;
  border-radius: 1.5rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
}

/* ── Visor ── */
.viewer {
  width: min(72rem, 100vw - 2rem);
  max-height: calc(100dvh - 2rem);
  margin: auto;
  padding: 0;
  border: 0;
  border-radius: 1.25rem;
  overflow: hidden;
  background: #fffdf8;
  color: var(--color-ink);
  box-shadow: 0 40px 100px -20px rgb(0 0 0 / 0.6);
}
.viewer[open] {
  animation: viewer-in 0.4s var(--ease-garden);
}
.viewer::backdrop {
  background: rgb(10 18 16 / 0.85);
  backdrop-filter: blur(4px);
}
.viewer__inner {
  display: grid;
  max-height: calc(100dvh - 2rem);
}
@media (min-width: 900px) {
  .viewer__inner {
    grid-template-columns: 1.3fr 1fr;
  }
}
.viewer__image {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 16rem;
  padding: 2rem 1.5rem 4.5rem;
  background: radial-gradient(ellipse at 50% 30%, rgb(181 149 88 / 0.18), transparent 60%), #0f1b18;
}
.viewer__image img {
  max-width: 100%;
  max-height: calc(100dvh - 9rem);
  object-fit: contain;
  box-shadow: 0 20px 50px -20px rgb(0 0 0 / 0.7);
  animation: img-in 0.5s var(--ease-garden);
}
.viewer__nav {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  translate: -50% 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.viewer__nav button {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  color: var(--color-ivory);
  border: 1px solid rgb(247 241 230 / 0.3);
  transition: background 0.2s;
}
.viewer__nav button:hover {
  background: rgb(247 241 230 / 0.12);
}
.viewer__text {
  position: relative;
  overflow-y: auto;
  padding: 2.25rem 2rem 2rem;
}
.viewer__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  color: var(--color-ink-muted);
  transition: background 0.2s;
}
.viewer__close:hover {
  background: var(--color-paper);
}
.viewer__why {
  margin-top: 1.25rem;
  padding: 1rem 1.15rem;
  border-radius: 0.9rem;
  background: rgb(201 148 153 / 0.14);
}
.chip {
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--color-wine-deep);
  border: 1px solid rgb(181 149 88 / 0.55);
  background: rgb(181 149 88 / 0.08);
}
.chip:hover {
  background: rgb(181 149 88 / 0.2);
}
.viewer__meta {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: 0.4rem 1rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px dashed var(--color-line);
  font-size: 0.85rem;
}
.viewer__meta dt {
  color: var(--color-ink-muted);
}
.viewer__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  text-decoration: none;
  color: var(--color-ink);
  border: 1px solid var(--color-line);
}
.viewer__btn:hover {
  color: var(--color-wine);
  border-color: var(--color-wine);
}
.viewer__btn--wine {
  color: var(--color-ivory);
  background: var(--color-wine);
  border-color: transparent;
}
.viewer__btn--wine:hover {
  color: var(--color-ivory);
  background: var(--color-wine-deep);
}

@media (max-width: 899px) {
  .viewer__inner {
    overflow-y: auto;
  }
  .viewer__image img {
    max-height: 55dvh;
  }
  .viewer__text {
    overflow: visible;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    translate: 0 18px;
  }
}
@keyframes viewer-in {
  from {
    opacity: 0;
    scale: 0.96;
  }
}
@keyframes img-in {
  from {
    opacity: 0;
    filter: blur(6px);
  }
}
</style>
