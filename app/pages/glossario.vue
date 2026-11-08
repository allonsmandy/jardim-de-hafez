<script setup lang="ts">
import { Check, Link2, Search, X } from '@lucide/vue'
import { GLOSSARY_GROUPS, OTHER_GROUP, groupOf } from '#shared/utils/glossary-groups'
import { normalizeForSearch } from '#shared/utils/text'

useSeoMeta({
  title: 'Glossário',
  description:
    'Glossário da poesia de Hafez explicado de forma simples: gazel, copeiro, rend, velho dos magos, sufismo, a rosa e o rouxinol, a Shiraz do século XIV e muito mais.',
})

const { entries, open: openTerm } = useGlossary()
const { public: config } = useRuntimeConfig()

const initial = (term: string) => term.normalize('NFD')[0]!.toUpperCase()
const sorted = computed(() =>
  [...entries.value].sort((a, b) => a.term.localeCompare(b.term, 'pt-BR')),
)

/* Busca e filtro por tema */
const query = ref('')
const group = ref<string | null>(null)
const results = computed(() => {
  const q = normalizeForSearch(query.value.trim())
  return sorted.value.filter((e) => {
    if (group.value && groupOf(e.id).id !== group.value) return false
    if (!q) return true
    const hay = normalizeForSearch(
      [e.term, e.termFa, e.transliteration, ...e.aliases, e.short].join(' '),
    )
    return hay.includes(q)
  })
})
const groupsInUse = computed(() => {
  const used = new Set(entries.value.map((e) => groupOf(e.id).id))
  return [...GLOSSARY_GROUPS, OTHER_GROUP].filter((g) => used.has(g.id))
})
const countIn = (id: string) => entries.value.filter((e) => groupOf(e.id).id === id).length
function clearFilters() {
  query.value = ''
  group.value = null
}

/* Alfabeto: letras com palavras ficam ativas */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const firstOf = computed(() => {
  const map = new Map<string, string>()
  for (const e of results.value) {
    const l = initial(e.term)
    if (!map.has(l)) map.set(l, e.id)
  }
  return map
})

/* Palavra do dia (o dia da geração vai no payload e é atualizado no navegador) */
const DAY_MS = 86_400_000
const day = useState('glossary-day', () => Math.floor(Date.now() / DAY_MS))
onMounted(() => (day.value = Math.floor(Date.now() / DAY_MS)))
const wordOfDay = computed(() => {
  const list = sorted.value
  return list.length ? list[(day.value * 7) % list.length] : undefined
})

/* Copiar link de um verbete */
const copied = ref<string | null>(null)
async function copyLink(id: string) {
  try {
    await navigator.clipboard.writeText(`${config.siteUrl}/glossario#${id}`)
    copied.value = id
    setTimeout(() => (copied.value = null), 1800)
  } catch {
    /* sem área de transferência: ignora */
  }
}

/* Ao chegar por um link #termo, garante que ele está visível */
onMounted(() => {
  if (location.hash) clearFilters()
})
</script>

<template>
  <div>
    <!-- Abertura -->
    <section class="hero">
      <NightAmbient :count="12" />
      <div class="container-reading relative py-20 text-center sm:py-24">
        <p class="eyebrow !text-gold">Para ler Hafez</p>
        <h1 class="hero__title">Glossário</h1>
        <PersianText as="p" class="hero__fa">واژه‌نامه</PersianText>
        <p class="hero__lead">
          As palavras e os símbolos que voltam sempre nos poemas, explicados para quem chega agora.
          Em qualquer página do site, toque numa palavra sublinhada para ver a explicação.
        </p>
        <label class="search">
          <Search class="size-5 shrink-0 text-gold" aria-hidden="true" />
          <span class="sr-only">Buscar no glossário</span>
          <input
            v-model="query"
            type="search"
            placeholder="Busque: copeiro, vinho, Shiraz, ساقی…"
            autocomplete="off"
          />
          <button
            v-if="query"
            type="button"
            class="search__clear"
            aria-label="Limpar busca"
            @click="query = ''"
          >
            <X class="size-4" aria-hidden="true" />
          </button>
        </label>
        <p class="hero__count" aria-live="polite">
          {{ results.length }} de {{ entries.length }} palavras
        </p>
      </div>
      <svg class="arcade" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 40V22 Q25 0 50 22 Q75 0 100 22 Q125 0 150 22 Q175 0 200 22 Q225 0 250 22 Q275 0 300 22 Q325 0 350 22 Q375 0 400 22 Q425 0 450 22 Q475 0 500 22 Q525 0 550 22 Q575 0 600 22 Q625 0 650 22 Q675 0 700 22 Q725 0 750 22 Q775 0 800 22 Q825 0 850 22 Q875 0 900 22 Q925 0 950 22 Q975 0 1000 22 Q1025 0 1050 22 Q1075 0 1100 22 Q1125 0 1150 22 Q1175 0 1200 22 V40Z"
          fill="var(--color-ivory)"
        />
      </svg>
    </section>

    <!-- Palavra do dia -->
    <section v-if="wordOfDay && !query && !group" class="container-editorial pt-14">
      <button type="button" class="today" @click="openTerm(wordOfDay.id)">
        <span class="today__fa" lang="fa">{{ wordOfDay.termFa }}</span>
        <span class="grid gap-1 text-left">
          <span class="today__label">Palavra do dia</span>
          <span class="font-display text-3xl text-ink">{{ wordOfDay.term }}</span>
          <span class="text-ink-muted">{{ wordOfDay.short }}</span>
        </span>
      </button>
    </section>

    <div class="container-editorial layout pt-12">
      <!-- Temas -->
      <aside class="themes" aria-label="Filtrar por tema">
        <p class="themes__title">Temas</p>
        <ul class="themes__list">
          <li>
            <button
              type="button"
              class="theme"
              :class="{ 'theme--on': !group }"
              :aria-pressed="!group"
              @click="group = null"
            >
              <span class="theme__dot" style="background: var(--color-gold)" />
              Todos <span class="theme__n">{{ entries.length }}</span>
            </button>
          </li>
          <li v-for="g in groupsInUse" :key="g.id">
            <button
              type="button"
              class="theme"
              :class="{ 'theme--on': group === g.id }"
              :aria-pressed="group === g.id"
              @click="group = group === g.id ? null : g.id"
            >
              <span class="theme__dot" :style="{ background: g.color }" />
              {{ g.label }} <span class="theme__n">{{ countIn(g.id) }}</span>
            </button>
          </li>
        </ul>
      </aside>

      <div>
        <!-- Alfabeto -->
        <nav aria-label="Letras" class="alphabet">
          <template v-for="letter in ALPHABET" :key="letter">
            <a v-if="firstOf.get(letter)" :href="`#${firstOf.get(letter)}`" class="alphabet__l">
              {{ letter }}
            </a>
            <span v-else class="alphabet__l alphabet__l--off" aria-hidden="true">{{ letter }}</span>
          </template>
        </nav>

        <!-- Verbetes -->
        <TransitionGroup v-if="results.length" tag="ul" name="entry" class="entries">
          <li
            v-for="entry in results"
            :id="entry.id"
            :key="entry.id"
            class="entry"
            :style="{ '--accent': groupOf(entry.id).color }"
          >
            <header class="entry__head">
              <div>
                <p class="entry__group">{{ groupOf(entry.id).label }}</p>
                <h2 class="entry__term">{{ entry.term }}</h2>
                <p class="entry__say">
                  pronuncia-se <em>{{ entry.transliteration }}</em>
                </p>
              </div>
              <span class="entry__fa" lang="fa">{{ entry.termFa }}</span>
            </header>
            <p class="entry__short">{{ entry.short }}</p>
            <details class="entry__more">
              <summary>Saber mais</summary>
              <p>{{ entry.definition }}</p>
            </details>
            <button
              type="button"
              class="entry__link"
              :aria-label="`Copiar link para ${entry.term}`"
              @click="copyLink(entry.id)"
            >
              <component
                :is="copied === entry.id ? Check : Link2"
                class="size-4"
                aria-hidden="true"
              />
            </button>
          </li>
        </TransitionGroup>
        <div v-else class="empty">
          <p class="font-display text-2xl">Nenhuma palavra encontrada</p>
          <p class="mt-2 text-ink-muted">
            Tente outra grafia, uma palavra em persa ou
            <button type="button" class="underline" @click="clearFilters">limpe os filtros</button>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Abertura ── */
.hero {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 50% 30%, rgb(31 61 90 / 0.8), transparent 60%),
    radial-gradient(ellipse at 100% 100%, rgb(112 47 61 / 0.45), transparent 50%), #0d1820;
}
.hero__title {
  margin-top: 0.75rem;
  font-size: clamp(3.2rem, 9vw, 5.5rem);
  line-height: 1;
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
  max-width: 34rem;
  margin: 1.25rem auto 0;
  color: rgb(247 241 230 / 0.78);
  animation: rise 1.1s 0.2s var(--ease-garden) both;
}
.search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 34rem;
  margin: 2.25rem auto 0;
  padding: 0.9rem 1.25rem;
  border-radius: 999px;
  background: rgb(247 241 230 / 0.08);
  border: 1px solid rgb(217 185 122 / 0.45);
  backdrop-filter: blur(6px);
  transition:
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;
  animation: rise 1.1s 0.3s var(--ease-garden) both;
}
.search:focus-within {
  background: rgb(247 241 230 / 0.14);
  border-color: #f1dca8;
  box-shadow: 0 0 0 6px rgb(217 185 122 / 0.15);
}
.search input {
  flex: 1;
  min-width: 0;
  font-size: 1.05rem;
  color: var(--color-ivory);
  background: transparent;
  outline: none;
}
.search input::placeholder {
  color: rgb(247 241 230 / 0.45);
}
.search input::-webkit-search-cancel-button {
  display: none;
}
.search__clear {
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  color: var(--color-ivory);
  background: rgb(247 241 230 / 0.12);
}
.hero__count {
  margin-top: 0.85rem;
  font-size: 0.82rem;
  color: rgb(247 241 230 / 0.55);
}
.arcade {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  width: 100%;
  height: 2.25rem;
}

/* ── Palavra do dia ── */
.today {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.75rem;
  align-items: center;
  width: 100%;
  padding: 1.75rem 2rem;
  border-radius: 1.5rem;
  text-align: left;
  background: radial-gradient(circle at 0% 50%, rgb(181 149 88 / 0.22), transparent 40%), #fffdf8;
  border: 1px solid var(--color-line);
  transition:
    transform 0.35s var(--ease-garden),
    box-shadow 0.35s;
}
.today:hover {
  transform: translateY(-3px);
  box-shadow: 0 30px 60px -40px rgb(112 47 61 / 0.5);
}
.today__fa {
  display: grid;
  place-items: center;
  min-width: 7rem;
  padding: 0 0.5rem;
  font-family: var(--font-persian);
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  background: linear-gradient(135deg, var(--color-wine), var(--color-gold));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.today__label {
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-wine);
}
@media (max-width: 639px) {
  .today {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .today > span:last-child {
    text-align: center;
  }
}

/* ── Layout ── */
.layout {
  display: grid;
  gap: 2rem;
}
.layout > * {
  min-width: 0;
}
@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 15rem 1fr;
    gap: 3rem;
    align-items: start;
  }
}

/* Temas */
.themes__title {
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-cypress);
}
.themes__list {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.85rem;
  overflow-x: auto;
  padding-bottom: 0.4rem;
  scrollbar-width: none;
}
.themes__list::-webkit-scrollbar {
  display: none;
}
.themes__list .theme {
  white-space: nowrap;
}
@media (min-width: 1024px) {
  .themes {
    position: sticky;
    top: 1.5rem;
  }
  .themes__list {
    flex-direction: column;
    overflow: visible;
  }
  .themes__list .theme {
    white-space: normal;
  }
}
.theme {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  font-size: 0.92rem;
  text-align: left;
  color: var(--color-ink-muted);
  border: 1px solid var(--color-line);
  background: #fffdf8;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
}
@media (min-width: 1024px) {
  .theme {
    border-color: transparent;
    background: transparent;
    border-radius: 0.75rem;
  }
}
.theme:hover {
  color: var(--color-ink);
  background: var(--color-paper);
}
.theme--on {
  color: var(--color-ink);
  background: var(--color-paper);
  border-color: var(--color-line);
}
.theme__dot {
  width: 0.6rem;
  height: 0.6rem;
  flex: none;
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
  scale: 1.6;
}
.theme__n {
  margin-left: auto;
  font-size: 0.78rem;
  color: var(--color-ink-muted);
  font-variant-numeric: lining-nums;
}

/* Alfabeto */
.alphabet {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-line);
}
.alphabet__l {
  display: grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  text-decoration: none;
  color: var(--color-wine);
  transition:
    background 0.2s,
    color 0.2s;
}
a.alphabet__l:hover {
  color: var(--color-ivory);
  background: var(--color-wine);
}
.alphabet__l--off {
  color: rgb(92 83 74 / 0.3);
}

/* Verbetes */
.entries {
  display: grid;
  gap: 1rem;
  margin-top: 1.75rem;
}
@media (min-width: 768px) {
  .entries {
    grid-template-columns: 1fr 1fr;
  }
}
.entry {
  position: relative;
  scroll-margin-top: 6rem;
  padding: 1.6rem 1.75rem 1.4rem;
  border-radius: 1.25rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
  box-shadow: inset 4px 0 0 var(--accent);
  transition:
    box-shadow 0.3s,
    transform 0.3s var(--ease-garden);
}
.entry:hover {
  box-shadow:
    inset 4px 0 0 var(--accent),
    0 24px 50px -38px rgb(40 37 34 / 0.55);
}
.entry:target {
  box-shadow:
    inset 4px 0 0 var(--accent),
    0 0 0 3px rgb(201 148 153 / 0.6);
  animation: flash 1.6s var(--ease-garden);
}
.entry__head {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: start;
  padding-right: 1.75rem;
}
.entry__group {
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
}
.entry__term {
  margin-top: 0.2rem;
  font-size: 1.85rem;
  line-height: 1.1;
}
.entry__say {
  margin-top: 0.3rem;
  font-size: 0.82rem;
  color: var(--color-ink-muted);
}
.entry__fa {
  max-width: 9rem;
  font-family: var(--font-persian);
  font-size: 1.7rem;
  line-height: 1.5;
  text-align: right;
  color: var(--color-cypress);
}
.entry__short {
  margin-top: 1rem;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--color-ink);
}
.entry__more {
  margin-top: 1rem;
  border-top: 1px dashed var(--color-line);
  padding-top: 0.75rem;
}
.entry__more summary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  list-style: none;
  font-size: 0.9rem;
  color: var(--color-cypress);
}
.entry__more summary::-webkit-details-marker {
  display: none;
}
.entry__more summary::after {
  content: '+';
  font-family: var(--font-display);
  font-size: 1.2rem;
  line-height: 1;
  transition: rotate 0.3s var(--ease-garden);
}
.entry__more[open] summary::after {
  rotate: 45deg;
}
.entry__more p {
  margin-top: 0.6rem;
  line-height: 1.7;
  color: var(--color-ink-muted);
  animation: open-more 0.4s var(--ease-garden);
}
.entry__link {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  color: var(--color-ink-muted);
  opacity: 0;
  transition:
    opacity 0.2s,
    background 0.2s;
}
.entry:hover .entry__link,
.entry__link:focus-visible {
  opacity: 1;
}
@media (hover: none) {
  .entry__link {
    opacity: 1;
  }
}
.entry__link:hover {
  background: var(--color-paper);
}
.entry-enter-active,
.entry-leave-active {
  transition:
    opacity 0.3s,
    translate 0.3s var(--ease-garden);
}
.entry-enter-from,
.entry-leave-to {
  opacity: 0;
  translate: 0 8px;
}
.entry-leave-active {
  position: absolute;
  visibility: hidden;
}
.empty {
  margin-top: 2rem;
  padding: 3rem 2rem;
  border-radius: 1.5rem;
  text-align: center;
  background: #fffdf8;
  border: 1px dashed var(--color-line);
}

@keyframes rise {
  from {
    opacity: 0;
    translate: 0 18px;
  }
}
@keyframes flash {
  0% {
    background: rgb(201 148 153 / 0.25);
  }
}
@keyframes open-more {
  from {
    opacity: 0;
    translate: 0 -6px;
  }
}
</style>
