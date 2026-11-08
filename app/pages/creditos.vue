<script setup lang="ts">
import {
  ArrowRight,
  Bot,
  CircleCheck,
  CircleSlash,
  Code,
  Feather,
  Image,
  ScrollText,
  Type,
} from '@lucide/vue'
import type { Source } from '#shared/schemas/source'
import { RIGHTS_STATUS, type RightsStatus } from '~/composables/useRightsStatus'

useSeoMeta({
  title: 'Créditos e fontes',
  description:
    'Quem escreveu, quem traduziu e de onde vem cada texto do Jardim de Hafez — com a situação de direitos de cada fonte explicada em palavras simples.',
})

const { data: sources } = await useFetch<Source[]>('/api/sources.json', { default: () => [] })

/* Só explica os selos que de fato aparecem na lista */
const legend = computed(() =>
  (Object.keys(RIGHTS_STATUS) as RightsStatus[]).filter((s) =>
    sources.value.some((x) => x.rights.status === s),
  ),
)
const used = computed(() => sources.value.filter((s) => s.usableForPublication))
const consulted = computed(() => sources.value.filter((s) => !s.usableForPublication))

/* As três perguntas que todo leitor faz primeiro */
const who = [
  {
    icon: Feather,
    q: 'Quem escreveu?',
    a: 'Hafez de Shiraz',
    text: 'Todos os poemas são dele (c. 1315–1390). Nenhum verso é inventado nem atribuído a ele sem base no Divã.',
  },
  {
    icon: ScrollText,
    q: 'De onde vem o persa?',
    a: 'Edição Qazvini-Ghani',
    text: 'O texto original segue a edição crítica de 1941, a mais usada no Irã, copiado da transcrição aberta do site Ganjoor.',
  },
  {
    icon: Bot,
    q: 'Quem traduziu?',
    a: 'Inteligência artificial',
    text: 'Por enquanto, traduções e explicações são feitas por IA (Claude e Codex) e são preliminares: esperam a revisão de quem lê persa. Cada poema diz qual delas traduziu.',
  },
]
</script>

<template>
  <div>
    <!-- Abertura -->
    <section class="hero">
      <NightAmbient :count="10" />
      <div class="hero__mark" aria-hidden="true" lang="fa">منابع</div>
      <div class="container-reading relative py-24 text-center sm:py-28">
        <p class="eyebrow !text-gold">Transparência editorial</p>
        <h1 class="hero__title">Créditos e fontes</h1>
        <p class="hero__lead">
          Quem escreveu, quem traduziu e de onde vem cada texto deste jardim — e o que podemos, ou
          não, usar de cada livro e site.
        </p>
      </div>
      <svg class="hero__arcade" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 40V22 Q25 0 50 22 Q75 0 100 22 Q125 0 150 22 Q175 0 200 22 Q225 0 250 22 Q275 0 300 22 Q325 0 350 22 Q375 0 400 22 Q425 0 450 22 Q475 0 500 22 Q525 0 550 22 Q575 0 600 22 Q625 0 650 22 Q675 0 700 22 Q725 0 750 22 Q775 0 800 22 Q825 0 850 22 Q875 0 900 22 Q925 0 950 22 Q975 0 1000 22 Q1025 0 1050 22 Q1075 0 1100 22 Q1125 0 1150 22 Q1175 0 1200 22 V40Z"
          fill="var(--color-ivory)"
        />
      </svg>
    </section>

    <!-- Em palavras simples -->
    <section class="container-editorial py-20" aria-labelledby="resumo">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow">Em palavras simples</p>
        <h2 id="resumo" class="mt-2 text-4xl sm:text-5xl">O essencial, em três respostas</h2>
      </div>
      <ul class="who mt-12">
        <li v-for="(w, i) in who" :key="w.q" v-reveal="i * 120" class="who__card">
          <span class="who__icon"
            ><component :is="w.icon" class="size-5" aria-hidden="true"
          /></span>
          <p class="who__q">{{ w.q }}</p>
          <p class="who__a">{{ w.a }}</p>
          <p class="mt-3 text-ink-muted"><GlossaryText :text="w.text" /></p>
        </li>
      </ul>
      <p class="mt-10 text-center">
        <NuxtLink to="/como-traduzimos" class="inline-flex items-center gap-1.5">
          Como a tradução é feita e revisada <ArrowRight class="size-4" aria-hidden="true" />
        </NuxtLink>
      </p>
    </section>

    <!-- Legenda dos selos -->
    <section class="legend-band" aria-labelledby="selos">
      <GirihPattern class="legend-band__pattern" :size="88" />
      <div class="container-editorial relative py-20">
        <div class="grid gap-4 lg:grid-cols-[1fr_1.3fr] lg:items-end">
          <div>
            <p class="eyebrow !text-rose">Antes da lista</p>
            <h2 id="selos" class="mt-2 text-4xl !text-ivory sm:text-5xl">
              O que quer dizer cada selo
            </h2>
          </div>
          <p class="text-ivory/75 lg:pb-2">
            Todo livro, site ou tradução tem um dono — ou não tem mais. Antes de usar qualquer
            texto, verificamos isso e registramos o resultado em cada fonte abaixo.
          </p>
        </div>
        <dl class="legend mt-12">
          <div v-for="(s, i) in legend" :key="s" v-reveal="i * 100" class="legend__item">
            <dt>
              <span class="seal" :class="`seal--${RIGHTS_STATUS[s].tone}`">
                {{ RIGHTS_STATUS[s].label }}
              </span>
            </dt>
            <dd class="mt-3 text-[0.95rem] text-ivory/80">{{ RIGHTS_STATUS[s].plain }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Fontes usadas -->
    <section class="container-editorial py-20" aria-labelledby="usadas">
      <header class="section-head">
        <span class="section-head__icon section-head__icon--used">
          <CircleCheck class="size-6" aria-hidden="true" />
        </span>
        <div>
          <p class="eyebrow">{{ used.length }} fontes</p>
          <h2 id="usadas" class="mt-1 text-4xl">O que usamos para fazer o site</h2>
          <p class="mt-3 text-ink-muted">
            Textos livres ou autorizados, que podem servir de base para o que aparece aqui.
          </p>
        </div>
      </header>
      <ul class="sources mt-10">
        <li v-for="(s, i) in used" :key="s.id" v-reveal="(i % 2) * 100">
          <SourceCard :source="s" />
        </li>
      </ul>
    </section>

    <!-- Fontes só consultadas -->
    <section class="consulted-band" aria-labelledby="consultadas">
      <div class="container-editorial py-20">
        <header class="section-head">
          <span class="section-head__icon section-head__icon--closed">
            <CircleSlash class="size-6" aria-hidden="true" />
          </span>
          <div>
            <p class="eyebrow">{{ consulted.length }} fontes</p>
            <h2 id="consultadas" class="mt-1 text-4xl">O que só consultamos — e por quê</h2>
            <p class="mt-3 text-ink-muted">
              Obras importantes, mas protegidas por direitos autorais. Servem para conferir datas,
              numeração e leituras; nenhuma frase delas é copiada ou traduzida aqui.
            </p>
          </div>
        </header>
        <ul class="sources mt-10">
          <li v-for="(s, i) in consulted" :key="s.id" v-reveal="(i % 2) * 100">
            <SourceCard :source="s" muted />
          </li>
        </ul>
      </div>
    </section>

    <!-- Imagens, letras e ferramentas -->
    <section class="container-editorial py-20" aria-labelledby="mais">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow">Além dos textos</p>
        <h2 id="mais" class="mt-2 text-4xl">Imagens, letras e ferramentas</h2>
      </div>
      <ul class="extras mt-12">
        <li v-reveal class="extra">
          <Image class="size-6 text-cypress" aria-hidden="true" />
          <h3 class="mt-4 font-display text-2xl">Imagens</h3>
          <p class="mt-2 text-ink-muted">
            As obras da galeria vêm do programa <em>Open Access</em> do Metropolitan Museum of Art,
            de Nova York, em domínio público (CC0). Cada uma tem link para a ficha oficial do museu.
          </p>
          <NuxtLink to="/arte-persa" class="extra__link">
            Ver a galeria <ArrowRight class="size-4" aria-hidden="true" />
          </NuxtLink>
        </li>
        <li v-reveal="120" class="extra">
          <Type class="size-6 text-cypress" aria-hidden="true" />
          <h3 class="mt-4 font-display text-2xl">Letras</h3>
          <p class="mt-2 text-ink-muted">
            Cormorant Garamond nos títulos, Literata no texto e Noto Naskh Arabic no persa — fontes
            tipográficas gratuitas, sob a
            <a href="https://openfontlicense.org" target="_blank" rel="noopener"
              >SIL Open Font License</a
            >.
          </p>
        </li>
        <li v-reveal="240" class="extra">
          <Code class="size-6 text-cypress" aria-hidden="true" />
          <h3 class="mt-4 font-display text-2xl">Ferramentas</h3>
          <p class="mt-2 text-ink-muted">
            Feito com <a href="https://nuxt.com" target="_blank" rel="noopener">Nuxt</a> e
            <a href="https://vuejs.org" target="_blank" rel="noopener">Vue</a> (licença MIT), com
            ícones do <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a>
            (licença ISC).
          </p>
        </li>
      </ul>
    </section>

    <!-- Correções -->
    <section class="container-editorial pb-24">
      <div v-reveal class="cta">
        <div>
          <p class="eyebrow !text-rose">Viu algo errado?</p>
          <h2 class="mt-2 text-3xl !text-ivory">Um crédito faltando, uma fonte mal descrita?</h2>
          <p class="mt-3 text-ivory/80">
            Se você é autor(a) de uma obra citada aqui ou encontrou uma informação incorreta,
            queremos corrigir. O canal oficial para correções será divulgado em breve.
          </p>
        </div>
        <NuxtLink to="/sobre" class="btn shrink-0 bg-ivory text-wine hover:bg-white">
          Sobre o projeto
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Abertura ── */
.hero {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 50% 30%, rgb(36 72 63 / 0.85), transparent 60%),
    radial-gradient(ellipse at 0% 100%, rgb(112 47 61 / 0.45), transparent 50%), #0f1d1a;
}
.hero__mark {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -55%;
  font-family: var(--font-persian);
  font-size: clamp(9rem, 26vw, 20rem);
  line-height: 1;
  color: rgb(181 149 88 / 0.07);
  pointer-events: none;
}
.hero__title {
  margin-top: 0.75rem;
  font-size: clamp(2.8rem, 7vw, 5rem);
  line-height: 1;
  color: var(--color-ivory);
  animation: rise 1.1s var(--ease-garden) both;
}
.hero__lead {
  max-width: 34rem;
  margin: 1.5rem auto 0;
  font-size: 1.15rem;
  color: rgb(247 241 230 / 0.8);
  animation: rise 1.1s 0.2s var(--ease-garden) both;
}
.hero__arcade {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  width: 100%;
  height: 2.25rem;
}

/* ── Três respostas ── */
.who {
  display: grid;
  gap: 1.25rem;
}
@media (min-width: 768px) {
  .who {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.who__card {
  padding: 1.75rem;
  border-radius: 1.25rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
}
.who__icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  color: var(--color-ivory);
  background: var(--color-cypress);
}
.who__q {
  margin-top: 1.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
.who__a {
  margin-top: 0.25rem;
  font-family: var(--font-display);
  font-size: 1.75rem;
  line-height: 1.15;
  color: var(--color-wine);
}

/* ── Legenda ── */
.legend-band {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 100% 0%, rgb(201 148 153 / 0.3), transparent 50%), var(--color-wine);
}
.legend-band__pattern {
  position: absolute;
  inset: 0;
  color: rgb(247 241 230 / 0.06);
}
.legend {
  display: grid;
  gap: 1rem;
}
@media (min-width: 640px) {
  .legend {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .legend {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.legend__item {
  padding: 1.4rem;
  border-radius: 1rem;
  background: rgb(0 0 0 / 0.14);
  border: 1px solid rgb(247 241 230 / 0.15);
}

/* ── Listas de fontes ── */
.section-head {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  align-items: start;
  max-width: 48rem;
}
.section-head__icon {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 999px;
}
.section-head__icon--used {
  color: #1d4a3f;
  background: #dcebe2;
}
.section-head__icon--closed {
  color: var(--color-wine-deep);
  background: #f3dfe0;
}
.sources {
  display: grid;
  gap: 1.25rem;
}
@media (min-width: 768px) {
  .sources {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.consulted-band {
  background: var(--color-paper);
  border-block: 1px solid var(--color-line);
}

/* ── Extras ── */
.extras {
  display: grid;
  gap: 1.25rem;
}
@media (min-width: 768px) {
  .extras {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.extra {
  padding: 1.75rem;
  border-radius: 1.25rem;
  border: 1px dashed var(--color-line);
}
.extra__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 1rem;
}

/* ── Chamada final ── */
.cta {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.25rem;
  border-radius: 1.5rem;
  background:
    radial-gradient(ellipse at 100% 0%, rgb(201 148 153 / 0.3), transparent 55%), var(--color-wine);
}
@media (min-width: 768px) {
  .cta {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    translate: 0 18px;
  }
}
</style>
