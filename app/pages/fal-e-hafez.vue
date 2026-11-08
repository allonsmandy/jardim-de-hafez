<script setup lang="ts">
import type { Poem, PoemSummary } from '#shared/schemas/poem'
import { drawPoem } from '#shared/utils/oracle'

useSeoMeta({
  title: 'Fal-e Hafez',
  description:
    'Fal-e Hafez: a tradição iraniana de abrir o Divã de Hafez com uma pergunta no coração. Consulte um poema ao acaso, em persa e em português.',
})

type State =
  { name: 'intro' } | { name: 'revealing' } | { name: 'result'; poem: Poem } | { name: 'error' }

const { data: index } = await usePoemIndex()
// Por enquanto o Fal usa apenas gazéis, como na tradição.
const pool = computed<PoemSummary[]>(() => index.value.filter((p) => p.category === 'gazal'))
const state = ref<State>({ name: 'intro' })
let lastId: string | undefined
const stageEl = ref<HTMLElement>()

const MIN_REVEAL_MS = 2600

async function openDivan() {
  const chosen = drawPoem(pool.value, { exclude: (p) => p.id === lastId })
  if (!chosen) return
  lastId = chosen.id
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Volta ao palco antes de abrir o livro, para a animação ficar à vista.
  const behavior = reducedMotion ? 'auto' : 'smooth'
  const book = stageEl.value?.querySelector('.intro__book')
  if (book) book.scrollIntoView({ behavior, block: 'center' })
  else stageEl.value?.scrollIntoView({ behavior, block: 'start' })
  state.value = { name: 'revealing' }
  try {
    const [response] = await Promise.all([
      $fetch<{ poem: Poem }>(`/api/poems/${chosen.category}/${chosen.number}`),
      new Promise((r) => setTimeout(r, reducedMotion ? 0 : MIN_REVEAL_MS)),
    ])
    state.value = { name: 'result', poem: response.poem }
    await nextTick()
    stageEl.value?.scrollIntoView({ behavior, block: 'start' })
  } catch {
    state.value = { name: 'error' }
  }
}
</script>

<template>
  <div>
    <!-- Palco noturno: a consulta acontece aqui -->
    <section ref="stageEl" class="stage" aria-labelledby="fal-titulo">
      <NightAmbient :count="20" />
      <div class="stage__candle" aria-hidden="true" />
      <div class="container-editorial relative py-14 sm:py-20">
        <header class="stage__head">
          <p class="eyebrow !text-gold">Uma tradição iraniana</p>
          <h1 id="fal-titulo" class="stage__title">Fal-e Hafez</h1>
          <PersianText as="p" class="stage__fa">فال حافظ</PersianText>
          <p v-if="state.name === 'intro'" class="stage__lead">
            Há séculos, no Irã, quem está diante de uma dúvida abre o Divã de Hafez ao acaso e lê o
            poema que aparecer como um conselho. Faça o mesmo — como experiência de leitura, não
            como previsão.
          </p>
        </header>

        <div class="mt-12">
          <div v-if="!pool.length" class="stage__empty">
            <p class="font-display text-2xl text-ivory">O Divã ainda não pode ser aberto</p>
            <p class="mt-2 text-ivory/70">
              O Fal sorteia apenas entre poemas publicados. Enquanto isso,
              <NuxtLink to="/o-poeta" class="!text-gold">conheça o poeta</NuxtLink>.
            </p>
          </div>
          <Transition v-else name="scene" mode="out-in">
            <OracleIntro
              v-if="state.name === 'intro' || state.name === 'revealing'"
              key="intro"
              :opening="state.name === 'revealing'"
              @open="openDivan"
            />
            <OracleResult
              v-else-if="state.name === 'result'"
              :key="state.poem.id"
              :poem="state.poem"
              @again="openDivan"
            />
            <div v-else key="error" class="stage__empty">
              <p class="font-display text-2xl text-ivory">Não foi possível abrir o Divã</p>
              <p class="mt-2 text-ivory/70">Verifique sua conexão e tente de novo.</p>
              <button type="button" class="btn mt-6 bg-gold text-ink" @click="openDivan">
                Tentar novamente
              </button>
            </div>
          </Transition>
        </div>
      </div>
      <svg
        class="stage__arcade"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 40V22 Q25 0 50 22 Q75 0 100 22 Q125 0 150 22 Q175 0 200 22 Q225 0 250 22 Q275 0 300 22 Q325 0 350 22 Q375 0 400 22 Q425 0 450 22 Q475 0 500 22 Q525 0 550 22 Q575 0 600 22 Q625 0 650 22 Q675 0 700 22 Q725 0 750 22 Q775 0 800 22 Q825 0 850 22 Q875 0 900 22 Q925 0 950 22 Q975 0 1000 22 Q1025 0 1050 22 Q1075 0 1100 22 Q1125 0 1150 22 Q1175 0 1200 22 V40Z"
          fill="var(--color-ivory)"
        />
      </svg>
    </section>

    <!-- Sobre a tradição -->
    <section class="container-editorial py-24" aria-labelledby="sobre-fal">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow">Como os iranianos fazem</p>
        <h2 id="sobre-fal" class="mt-2 text-4xl sm:text-5xl">Sobre a tradição</h2>
        <p class="mt-5 text-ink-muted">
          <GlossaryText
            text="Fal quer dizer algo como “sorte, presságio”. Abrir o Divã com uma intenção no coração é um costume vivo, feito em família, entre amigos ou sozinho — e o Hafezieh, o túmulo do poeta em Shiraz, tem gente fazendo o Fal o dia inteiro."
          />
        </p>
      </div>

      <div class="ritual mt-14">
        <article v-reveal class="ritual__card ritual__card--night">
          <span class="ritual__icon" aria-hidden="true">☾</span>
          <h3 class="mt-4 font-display text-3xl !text-ivory">Na Noite de Yalda</h3>
          <p class="mt-3 text-ivory/80">
            <GlossaryText
              text="Na noite mais longa do ano, por volta de 20 de dezembro, as famílias ficam acordadas com romãs, melancia e poesia. Cada um faz seu Fal, e o mais velho costuma ler os poemas em voz alta."
            />
          </p>
        </article>
        <article v-reveal="120" class="ritual__card ritual__card--spring">
          <span class="ritual__icon" aria-hidden="true">✿</span>
          <h3 class="mt-4 font-display text-3xl">No Nowruz</h3>
          <p class="mt-3 text-ink-muted">
            <GlossaryText
              text="No Ano Novo persa, no começo da primavera (20 ou 21 de março), muitas famílias põem o Divã de Hafez na mesa de festa, ao lado de outros símbolos de boa sorte."
            />
          </p>
        </article>
        <article v-reveal="240" class="ritual__card ritual__card--oath">
          <span class="ritual__icon" aria-hidden="true">❦</span>
          <h3 class="mt-4 font-display text-3xl">O pedido</h3>
          <p class="mt-3 text-ink-muted">
            Antes de abrir o livro, muita gente fecha os olhos e chama o poeta com uma fórmula
            popular, que varia de família para família:
          </p>
          <blockquote class="oath">
            <PersianText as="p" block class="oath__fa">ای حافظ شیرازی، تو محرم هر رازی</PersianText>
            <p class="oath__pt">“Ó Hafez de Shiraz, tu que guardas todos os segredos…”</p>
          </blockquote>
          <p class="mt-3 text-sm text-ink-muted">
            <GlossaryText
              text="Em seguida, a pessoa pede uma resposta — às vezes “jurando” por Shakh-e Nabat, a amada da lenda."
            />
          </p>
          <ReliabilityBadge kind="tradicao" class="mt-4" />
        </article>
      </div>

      <div class="honest mt-14">
        <p class="font-display text-2xl text-wine">Como funciona aqui</p>
        <p class="mt-2 text-ink-muted">
          O “acaso” é um sorteio justo entre os gazéis já publicados no site, feito no seu
          navegador. Nenhuma mensagem é escrita em nome de Hafez: você lê exatamente o poema que
          saiu, com a tradução e as explicações. O sentido que ele tem para a sua pergunta é você
          quem dá.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  overflow: hidden;
  min-height: calc(100dvh - 5rem);
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 50% 45%, rgb(112 47 61 / 0.5), transparent 55%),
    radial-gradient(ellipse at 15% 100%, rgb(36 72 63 / 0.7), transparent 50%),
    radial-gradient(ellipse at 90% 0%, rgb(36 72 63 / 0.5), transparent 45%), #0d1a17;
}
.stage__candle {
  position: absolute;
  left: 50%;
  top: 42%;
  width: 60rem;
  height: 40rem;
  translate: -50% -50%;
  border-radius: 999px;
  background: radial-gradient(closest-side, rgb(241 200 120 / 0.16), transparent);
  animation: flicker 4s ease-in-out infinite;
  pointer-events: none;
}
.stage__head {
  max-width: 40rem;
  margin-inline: auto;
  text-align: center;
}
.stage__title {
  margin-top: 0.75rem;
  font-size: clamp(3.2rem, 9vw, 6rem);
  line-height: 0.95;
  color: var(--color-ivory);
  animation: rise 1.1s var(--ease-garden) both;
}
.stage__fa {
  margin-top: 0.5rem;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  color: #d9b97a;
  animation: rise 1.1s 0.15s var(--ease-garden) both;
}
.stage__lead {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  color: rgb(247 241 230 / 0.78);
  animation: rise 1.1s 0.3s var(--ease-garden) both;
}
.stage__empty {
  max-width: 32rem;
  margin-inline: auto;
  padding: 2.5rem;
  border-radius: 1.5rem;
  text-align: center;
  background: rgb(247 241 230 / 0.06);
  border: 1px solid rgb(217 185 122 / 0.3);
}
.stage__arcade {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  width: 100%;
  height: 2.25rem;
}
.scene-enter-active,
.scene-leave-active {
  transition:
    opacity 0.5s var(--ease-garden),
    translate 0.5s var(--ease-garden),
    filter 0.5s;
}
.scene-enter-from {
  opacity: 0;
  translate: 0 20px;
  filter: blur(6px);
}
.scene-leave-to {
  opacity: 0;
  filter: blur(6px);
}

/* Tradição */
.ritual {
  display: grid;
  gap: 1.25rem;
}
@media (min-width: 1024px) {
  .ritual {
    grid-template-columns: 1fr 1fr 1.25fr;
    align-items: stretch;
  }
}
.ritual__card {
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid var(--color-line);
  background: #fffdf8;
}
.ritual__card--night {
  color: var(--color-ivory);
  border-color: transparent;
  background:
    radial-gradient(circle at 80% 15%, rgb(241 220 168 / 0.25), transparent 35%),
    linear-gradient(160deg, #1b2f2a, #0d1a17);
}
.ritual__card--spring {
  background: radial-gradient(circle at 85% 10%, rgb(201 148 153 / 0.3), transparent 45%), #fffdf8;
}
.ritual__card--oath {
  background:
    radial-gradient(circle at 10% 0%, rgb(181 149 88 / 0.2), transparent 45%), var(--color-paper);
}
.ritual__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  font-size: 1.4rem;
  color: var(--color-wine);
  background: rgb(181 149 88 / 0.2);
}
.ritual__card--night .ritual__icon {
  color: #f1dca8;
  background: rgb(241 220 168 / 0.12);
}
.ritual__card--night :deep(.glossary-term) {
  text-decoration-color: var(--color-rose);
}
.ritual__card--night :deep(.glossary-term:hover) {
  color: var(--color-ivory);
}
.oath {
  margin-top: 1.25rem;
  padding: 1.25rem;
  border-radius: 1rem;
  text-align: center;
  background: #fffdf8;
  border: 1px solid rgb(181 149 88 / 0.4);
}
.oath__fa {
  text-align: center !important;
  font-size: 1.45rem;
  color: var(--color-cypress);
}
.oath__pt {
  margin-top: 0.4rem;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.2rem;
  color: var(--color-wine);
}
.honest {
  max-width: 44rem;
  margin-inline: auto;
  padding: 1.75rem 2rem;
  border-radius: 1.25rem;
  border-left: 4px solid var(--color-gold);
  background: #fffdf8;
}

@keyframes flicker {
  0%,
  100% {
    opacity: 0.85;
    scale: 1;
  }
  30% {
    opacity: 1;
    scale: 1.03;
  }
  60% {
    opacity: 0.75;
    scale: 0.98;
  }
}
@keyframes rise {
  from {
    opacity: 0;
    translate: 0 18px;
  }
}
</style>
