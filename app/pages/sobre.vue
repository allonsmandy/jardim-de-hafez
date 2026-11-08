<script setup lang="ts">
import {
  ArrowRight,
  BookOpenText,
  Eye,
  Feather,
  HandHeart,
  Languages,
  Scale,
  ScrollText,
  Sparkles,
  UserCheck,
} from '@lucide/vue'

useSeoMeta({
  title: 'Sobre',
  description:
    'O que é o Jardim de Hafez, por que um jardim, como os poemas são traduzidos e explicados, e quais são os princípios editoriais do projeto.',
})

const { data: poems } = await usePoemIndex()
const { entries: glossary } = useGlossary()

const stats = computed(() => [
  { value: '1', label: 'poeta', sub: 'Hafez de Shiraz' },
  { value: '495', label: 'gazéis no Divã', sub: 'edição Qazvini-Ghani' },
  { value: String(poems.value.length), label: 'já no jardim', sub: 'com tradução e explicações' },
  { value: String(glossary.value.length), label: 'palavras explicadas', sub: 'no glossário' },
])

/* Os quatro canteiros do chahar bagh = as quatro partes do site */
const beds = [
  {
    to: '/diva',
    fa: 'دیوان',
    title: 'O Divã',
    text: 'Os poemas em persa e em português, explicados verso a verso.',
    icon: BookOpenText,
  },
  {
    to: '/o-poeta',
    fa: 'شاعر',
    title: 'O Poeta',
    text: 'Quem foi Hafez, sua cidade, sua época — separando fato de lenda.',
    icon: Feather,
  },
  {
    to: '/fal-e-hafez',
    fa: 'فال',
    title: 'Fal-e Hafez',
    text: 'A tradição iraniana de abrir o Divã com uma pergunta no coração.',
    icon: Sparkles,
  },
  {
    to: '/glossario',
    fa: 'واژه‌نامه',
    title: 'Glossário',
    text: 'Copeiro, rend, Alcorão, gazel: cada palavra explicada sem jargão.',
    icon: Languages,
  },
]

const process = [
  {
    title: 'O texto original',
    text: 'O persa vem da edição crítica de Qazvini e Ghani (1941), na transcrição aberta do Ganjoor. Nada é digitado de memória.',
    status: 'feito',
  },
  {
    title: 'A tradução',
    text: 'Por enquanto, feita por inteligência artificial (modelos como Claude, da Anthropic, e Codex, da OpenAI) diretamente do persa, verso a verso, sem rima, buscando fidelidade ao sentido e às imagens.',
    status: 'preliminar',
  },
  {
    title: 'As explicações',
    text: 'Cada dístico ganha uma versão "em palavras simples", o contexto cultural e, para quem quiser, a tradução palavra por palavra e as escolhas feitas.',
    status: 'feito',
  },
  {
    title: 'A revisão humana',
    text: 'O próximo passo: especialistas e leitores de persa revisando e corrigindo. Só depois disso uma tradução perde o selo de preliminar.',
    status: 'em aberto',
  },
]

const principles = [
  {
    icon: UserCheck,
    title: 'Hafez é sempre o autor',
    text: 'Cada tradução diz quem a fez e quem a revisou. Nunca inventamos versos, títulos, atribuições ou referências.',
  },
  {
    icon: Eye,
    title: 'Transparência sobre a IA',
    text: 'Toda tradução feita por IA traz um aviso visível onde quer que apareça — no poema, nos cartões, no Fal — e nunca é apresentada como definitiva.',
  },
  {
    icon: Scale,
    title: 'Fato não é lenda',
    text: 'Na biografia e nas notas, cada informação traz um selo: fato documentado, hipótese dos estudiosos ou tradição popular.',
  },
  {
    icon: ScrollText,
    title: 'Fontes à mostra',
    text: 'Edição do texto persa, transcrição e referências aparecem no rodapé de cada poema e na página de créditos.',
  },
  {
    icon: HandHeart,
    title: 'Respeito aos direitos',
    text: 'Não reproduzimos traduções modernas protegidas nem imagens sem licença. Adaptações livres são chamadas de adaptações.',
  },
  {
    icon: Sparkles,
    title: 'Poesia, não previsão',
    text: 'O Fal-e Hafez é apresentado como experiência de leitura e tradição cultural. Nenhuma mensagem é escrita em nome do poeta.',
  },
]
</script>

<template>
  <div>
    <!-- Abertura -->
    <section class="hero">
      <NightAmbient :count="14" />
      <div class="hero__mark" aria-hidden="true" lang="fa">باغ</div>
      <div class="container-reading relative py-24 text-center sm:py-32">
        <p class="eyebrow !text-gold">O projeto</p>
        <h1 class="hero__title">Sobre o Jardim de Hafez</h1>
        <p class="hero__lead">
          Um jardim para ler Hafez em português — devagar, com o persa ao lado e alguém explicando
          cada imagem, para quem nunca leu poesia persa.
        </p>
      </div>
      <svg class="hero__arcade" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 40V22 Q25 0 50 22 Q75 0 100 22 Q125 0 150 22 Q175 0 200 22 Q225 0 250 22 Q275 0 300 22 Q325 0 350 22 Q375 0 400 22 Q425 0 450 22 Q475 0 500 22 Q525 0 550 22 Q575 0 600 22 Q625 0 650 22 Q675 0 700 22 Q725 0 750 22 Q775 0 800 22 Q825 0 850 22 Q875 0 900 22 Q925 0 950 22 Q975 0 1000 22 Q1025 0 1050 22 Q1075 0 1100 22 Q1125 0 1150 22 Q1175 0 1200 22 V40Z"
          fill="var(--color-ivory)"
        />
      </svg>
    </section>

    <!-- Números -->
    <section class="container-editorial -mt-2 pt-10" aria-label="O jardim em números">
      <dl class="stats">
        <div v-for="(s, i) in stats" :key="s.label" v-reveal="i * 100" class="stat">
          <dt class="stat__label">{{ s.label }}</dt>
          <dd class="stat__value">{{ s.value }}</dd>
          <dd class="stat__sub">{{ s.sub }}</dd>
        </div>
      </dl>
    </section>

    <!-- Por que um jardim -->
    <section class="container-editorial py-24" aria-labelledby="por-que">
      <div class="garden-grid">
        <div v-reveal>
          <p class="eyebrow">O nome</p>
          <h2 id="por-que" class="mt-2 text-4xl sm:text-5xl">Por que um jardim?</h2>
          <div class="mt-6 space-y-4 text-ink-muted">
            <p>
              <GlossaryText
                text="Na Pérsia, o jardim é quase sagrado. O jardim clássico, o chahar bagh (“quatro jardins”), é um quadrado cercado de muros, cortado por dois canais de água que se cruzam num espelho d’água central. É uma imagem do paraíso — a própria palavra “paraíso” vem do persa antigo, onde queria dizer “jardim murado”."
              />
            </p>
            <p>
              <GlossaryText
                text="Os poemas de Hafez estão cheios de jardins: a rosa e o rouxinol, o cipreste, a brisa da manhã, o vinho bebido à beira do riacho. E o túmulo dele, em Shiraz, é um jardim de laranjeiras onde as pessoas vão ler e fazer o Fal."
              />
            </p>
            <p>
              Este site foi desenhado como um jardim assim: quatro canteiros, cada um com uma forma
              de chegar até Hafez. Escolha por onde entrar.
            </p>
          </div>
        </div>

        <nav v-reveal="150" class="chahar-bagh" aria-label="As quatro partes do jardim">
          <span class="chahar-bagh__wall" aria-hidden="true" />
          <NuxtLink
            v-for="(bed, i) in beds"
            :key="bed.to"
            :to="bed.to"
            class="bed"
            :class="`bed--${i + 1}`"
          >
            <span class="bed__tree" aria-hidden="true" />
            <PersianText as="span" class="bed__fa">{{ bed.fa }}</PersianText>
            <span class="bed__title">{{ bed.title }}</span>
            <span class="bed__text">{{ bed.text }}</span>
            <span class="bed__go" aria-hidden="true"><ArrowRight class="size-4" /></span>
          </NuxtLink>
          <span class="pool" aria-hidden="true"><span lang="fa">باغ</span></span>
        </nav>
      </div>
    </section>

    <!-- Como fazemos -->
    <section class="process-band" aria-labelledby="como">
      <GirihPattern class="process-band__pattern" :size="88" />
      <div class="container-editorial relative py-24">
        <div class="grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <div>
            <p class="eyebrow !text-rose">Do persa ao português</p>
            <h2 id="como" class="mt-2 text-4xl !text-ivory sm:text-5xl">
              Como cada poema chega aqui
            </h2>
          </div>
          <p class="text-ivory/75 lg:pb-2">
            Sem esconder nada: o que já está feito, o que ainda é preliminar e o que depende de
            você.
          </p>
        </div>
        <ol class="process mt-14">
          <li v-for="(step, i) in process" :key="step.title" v-reveal="i * 120" class="step">
            <span class="step__n">{{ i + 1 }}</span>
            <span class="step__status" :class="`step__status--${step.status.replace(' ', '-')}`">
              {{ step.status }}
            </span>
            <h3 class="mt-4 font-display text-2xl !text-ivory">{{ step.title }}</h3>
            <p class="mt-2 text-[0.95rem] text-ivory/75">{{ step.text }}</p>
          </li>
        </ol>
        <p class="mt-10 text-center">
          <NuxtLink to="/como-traduzimos" class="process-band__link">
            Entenda em detalhe como traduzimos <ArrowRight class="size-4" aria-hidden="true" />
          </NuxtLink>
        </p>
      </div>
    </section>

    <!-- Princípios -->
    <section class="container-editorial py-24" aria-labelledby="principios">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow">O que nos guia</p>
        <h2 id="principios" class="mt-2 text-4xl sm:text-5xl">Princípios editoriais</h2>
      </div>
      <ul class="principles mt-14">
        <li v-for="(p, i) in principles" :key="p.title" v-reveal="(i % 3) * 100" class="principle">
          <span class="principle__icon"
            ><component :is="p.icon" class="size-5" aria-hidden="true"
          /></span>
          <h3 class="mt-5 font-display text-2xl">{{ p.title }}</h3>
          <p class="mt-2 text-ink-muted"><GlossaryText :text="p.text" /></p>
        </li>
      </ul>
    </section>

    <!-- Inspiração e contribuição -->
    <section class="container-editorial pb-24">
      <div class="duo">
        <article v-reveal class="duo__card">
          <p class="eyebrow">Inspiração</p>
          <h2 class="mt-2 text-3xl">Um jardim vizinho</h2>
          <p class="mt-4 text-ink-muted">
            O projeto se inspira na proposta cultural do
            <a href="https://www.hafizonlove.com" rel="noopener" target="_blank">Hafiz on Love</a>,
            de Shahriar Shahriari, que há décadas apresenta Hafez em inglês. Não reproduzimos seus
            textos, traduções ou ilustrações: aqui tudo é feito a partir do persa.
          </p>
        </article>
        <article v-reveal="150" class="duo__card duo__card--wine">
          <p class="eyebrow !text-rose">Faça parte</p>
          <h2 class="mt-2 text-3xl !text-ivory">Um jardim se cuida em conjunto</h2>
          <p class="mt-4 text-ivory/85">
            Lê persa? Encontrou um erro numa tradução ou numa explicação? As correções da comunidade
            são o que vai transformar as traduções preliminares em definitivas. O canal oficial para
            enviá-las será divulgado em breve.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink to="/como-traduzimos" class="btn bg-ivory text-wine hover:bg-white">
              Como contribuir
            </NuxtLink>
            <NuxtLink
              to="/creditos"
              class="btn border border-ivory/40 text-ivory hover:bg-ivory/10 hover:text-ivory"
            >
              Créditos e fontes
            </NuxtLink>
          </div>
        </article>
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
    radial-gradient(ellipse at 50% 30%, rgb(36 72 63 / 0.9), transparent 60%),
    radial-gradient(ellipse at 100% 100%, rgb(112 47 61 / 0.5), transparent 50%), #0f1d1a;
}
.hero__mark {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -55%;
  font-family: var(--font-persian);
  font-size: clamp(16rem, 40vw, 30rem);
  line-height: 1;
  color: rgb(181 149 88 / 0.07);
  animation: float 12s ease-in-out infinite;
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

/* ── Números ── */
.stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
@media (min-width: 768px) {
  .stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.stat {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
}
.stat__value {
  order: -1;
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 6vw, 3.6rem);
  line-height: 1;
  color: var(--color-wine);
  font-variant-numeric: lining-nums;
}
.stat__label {
  margin-top: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-ink);
}
.stat__sub {
  font-size: 0.85rem;
  color: var(--color-ink-muted);
}

/* ── Chahar bagh ── */
.garden-grid {
  display: grid;
  gap: 3.5rem;
  align-items: center;
}
@media (min-width: 1024px) {
  .garden-grid {
    grid-template-columns: 1fr 1.1fr;
  }
}
.chahar-bagh {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem; /* os canais de água */
  padding: 1rem;
  border-radius: 1.5rem;
  background:
    linear-gradient(110deg, transparent 30%, rgb(255 255 255 / 0.35) 50%, transparent 70%) 0 0 /
      300% 100%,
    linear-gradient(135deg, #5f9c95, #2f6b67);
  animation: water 7s linear infinite;
  box-shadow: 0 40px 80px -45px rgb(36 72 63 / 0.8);
}
.chahar-bagh__wall {
  position: absolute;
  inset: -10px;
  border-radius: 1.9rem;
  border: 10px solid #d8c7a6;
  box-shadow:
    inset 0 0 0 1px rgb(120 90 40 / 0.3),
    0 0 0 1px rgb(120 90 40 / 0.3);
  pointer-events: none;
}
.bed {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 14rem;
  padding: 1.5rem 1.4rem;
  border-radius: 0.9rem;
  text-decoration: none;
  color: var(--color-ink);
  background:
    radial-gradient(circle at 85% 15%, rgb(201 148 153 / 0.35), transparent 35%),
    radial-gradient(circle at 15% 90%, rgb(181 149 88 / 0.25), transparent 40%),
    linear-gradient(160deg, #eef0dc, #dfe6c8);
  transition:
    transform 0.4s var(--ease-garden),
    box-shadow 0.4s var(--ease-garden);
}
.bed:hover {
  color: var(--color-ink);
  transform: scale(1.03);
  box-shadow: 0 20px 40px -20px rgb(0 0 0 / 0.4);
  z-index: 1;
}
.bed--2,
.bed--4 {
  text-align: right;
  align-items: flex-end;
}
.bed--2 .bed__fa,
.bed--4 .bed__fa {
  align-self: flex-end;
}
.bed__tree {
  position: absolute;
  bottom: 1.1rem;
  width: 0.9rem;
  height: 2.2rem;
  border-radius: 50% 50% 45% 45% / 70% 70% 30% 30%;
  background: linear-gradient(#3f6b4c, #24483f);
}
.bed--1 .bed__tree,
.bed--3 .bed__tree {
  right: 1.2rem;
}
.bed--2 .bed__tree,
.bed--4 .bed__tree {
  left: 1.2rem;
}
.bed__fa {
  align-self: flex-start;
  font-size: 1.6rem;
  color: var(--color-cypress);
}
.bed__title {
  margin-top: 0.25rem;
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--color-wine);
}
.bed__text {
  margin-top: 0.4rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--color-ink-muted);
}
.bed__go {
  margin-top: auto;
  padding-top: 0.75rem;
  color: var(--color-wine);
  transition: translate 0.3s var(--ease-garden);
}
.bed:hover .bed__go {
  translate: 4px 0;
}
.pool {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  display: grid;
  place-items: center;
  width: 5.5rem;
  height: 5.5rem;
  clip-path: polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%);
  background:
    radial-gradient(circle at 35% 30%, rgb(255 255 255 / 0.5), transparent 40%),
    linear-gradient(135deg, #78b3ab, #2f6b67);
  pointer-events: none;
  box-shadow: inset 0 0 0 4px #d8c7a6;
}
.pool span {
  font-family: var(--font-persian);
  font-size: 1.3rem;
  color: #fffaf0;
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.3);
}
.pool::after {
  content: '';
  position: absolute;
  inset: 0;
  clip-path: inherit;
  border: 4px solid #d8c7a6;
}

/* ── Processo ── */
.process-band {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 100% 0%, rgb(201 148 153 / 0.3), transparent 50%), var(--color-wine);
}
.process-band__pattern {
  position: absolute;
  inset: 0;
  color: rgb(247 241 230 / 0.06);
}
.process {
  position: relative;
  display: grid;
  gap: 1.25rem;
}
@media (min-width: 900px) {
  .process {
    grid-template-columns: repeat(4, 1fr);
  }
  .process::before {
    content: '';
    position: absolute;
    left: 2.5rem;
    right: 2.5rem;
    top: 2.6rem;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgb(241 220 168 / 0.5), transparent);
  }
}
.step {
  position: relative;
  padding: 1.75rem;
  border-radius: 1.25rem;
  background: rgb(18 36 31 / 0.35);
  border: 1px solid rgb(241 220 168 / 0.2);
  backdrop-filter: blur(4px);
}
.step__n {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--color-ink);
  background: #d9b97a;
  font-variant-numeric: lining-nums;
}
.step__status {
  position: absolute;
  top: 1.9rem;
  right: 1.5rem;
  padding: 0.15rem 0.65rem;
  border-radius: 999px;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.step__status--feito {
  color: #cfe7d9;
  background: rgb(36 72 63 / 0.7);
}
.step__status--preliminar {
  color: #f1dca8;
  background: rgb(181 149 88 / 0.25);
}
.step__status--em-aberto {
  color: var(--color-ivory);
  border: 1px dashed rgb(247 241 230 / 0.5);
}
.process-band__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.6rem;
  border-radius: 999px;
  text-decoration: none;
  color: var(--color-wine);
  background: var(--color-ivory);
  transition: transform 0.3s var(--ease-garden);
}
.process-band__link:hover {
  color: var(--color-wine);
  transform: translateY(-2px);
}

/* ── Princípios ── */
.principles {
  display: grid;
  gap: 1.25rem;
}
@media (min-width: 768px) {
  .principles {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .principles {
    grid-template-columns: repeat(3, 1fr);
  }
}
.principle {
  padding: 2rem;
  border-radius: 1.5rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
  transition:
    opacity 0.9s var(--ease-garden),
    translate 0.9s var(--ease-garden),
    transform 0.35s var(--ease-garden),
    border-color 0.35s;
  transition-delay: var(--reveal-delay, 0ms), var(--reveal-delay, 0ms), 0s, 0s;
}
.principle:hover {
  transform: translateY(-4px);
  border-color: rgb(181 149 88 / 0.6);
}
.principle__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  color: var(--color-wine);
  background: rgb(181 149 88 / 0.18);
}

/* ── Inspiração e contribuição ── */
.duo {
  display: grid;
  gap: 1.25rem;
}
@media (min-width: 900px) {
  .duo {
    grid-template-columns: 1fr 1fr;
  }
}
.duo__card {
  padding: 2.25rem;
  border-radius: 1.5rem;
  background: var(--color-paper);
  border: 1px solid var(--color-line);
}
.duo__card--wine {
  color: var(--color-ivory);
  border-color: transparent;
  background:
    radial-gradient(circle at 100% 0%, rgb(201 148 153 / 0.35), transparent 50%),
    var(--color-cypress);
}

@keyframes water {
  to {
    background-position:
      -300% 0,
      0 0;
  }
}
@keyframes rise {
  from {
    opacity: 0;
    translate: 0 18px;
  }
}
@keyframes float {
  50% {
    translate: -50% calc(-55% - 12px);
  }
}
</style>
