<script setup lang="ts">
import {
  AlertTriangle,
  ArrowRight,
  BookOpenText,
  Bot,
  CheckCircle2,
  Eye,
  FileText,
  Hourglass,
  Languages,
  Lightbulb,
  Landmark,
  Microscope,
  Music2,
  ScrollText,
  Users,
} from '@lucide/vue'
import type { Poem } from '#shared/schemas/poem'

useSeoMeta({
  title: 'Como traduzimos',
  description:
    'Como as traduções do Jardim de Hafez são feitas: texto persa de origem, tradução preliminar por inteligência artificial, explicações verso a verso e revisão aberta a correções.',
})

/* Exemplo real: o primeiro dístico do gazel 1 */
const { data } = await useFetch<{ poem: Poem }>('/api/poems/gazal/1')
const example = computed(() => {
  const p = data.value?.poem
  if (!p?.original || !p.translation) return undefined
  const note = p.stanzaNotes.find((n) => n.stanza === 1)
  return {
    fa: p.original.stanzas[0],
    pt: p.translation.stanzas[0],
    note,
    source: p.original.transcription.url,
  }
})

const summary = [
  {
    icon: ScrollText,
    title: 'O texto persa',
    text: 'Edição de Qazvini e Ghani (1941), a mais usada no Irã, na transcrição digital aberta do Ganjoor.',
    tone: 'ok',
  },
  {
    icon: Bot,
    title: 'Quem traduziu',
    text: 'Inteligência artificial (Claude, da Anthropic, e Codex, da OpenAI), diretamente do persa, a pedido da responsável pelo projeto. Cada poema diz qual delas traduziu.',
    tone: 'info',
  },
  {
    icon: AlertTriangle,
    title: 'Ainda não revisado',
    text: 'Nenhum especialista em persa conferiu as traduções ainda. Pode haver erros de leitura ou nuances perdidas.',
    tone: 'warn',
  },
  {
    icon: Hourglass,
    title: 'O que vem depois',
    text: 'Quando uma tradução for revisada e aprovada por pessoas qualificadas, o aviso sai e os revisores entram nos créditos.',
    tone: 'next',
  },
]

const criteria = [
  {
    icon: Music2,
    title: 'Sem rima',
    text: 'O gazel tem uma rima só do começo ao fim. Rimar em português obrigaria a inventar palavras e trocar imagens; preferimos ser fiéis. Quando todos os versos terminam com a mesma palavra (o radif), tentamos mantê-la.',
    example: { from: 'rima persa', to: 'fidelidade às imagens' },
  },
  {
    icon: Eye,
    title: 'Ambiguidade preservada',
    text: 'Hafez fala ao mesmo tempo de vinho e de êxtase místico, de um amado humano e de Deus. A tradução não decide por você: as notas mostram as leituras possíveis.',
    example: { from: 'vinho', to: 'vinho e êxtase' },
  },
  {
    icon: Users,
    title: 'Gênero em aberto',
    text: 'O persa não tem gênero gramatical: “ele” e “ela” são a mesma palavra. Evitamos fixar o gênero do amado quando o original não fixa.',
    example: { from: 'او', to: 'ele? ela?' },
  },
  {
    icon: Languages,
    title: 'Palavras-chave constantes',
    text: 'Termos sem equivalente exato, como rend e saqi, são mantidos ou traduzidos sempre do mesmo jeito, e explicados no glossário.',
    example: { from: 'ساقی', to: 'copeiro (saqi)' },
  },
  {
    icon: Landmark,
    title: 'Fato separado de lenda',
    text: 'Quando uma nota menciona uma anedota tradicional — como o encontro de Hafez com Tamerlão — ela é apresentada como lenda.',
    example: { from: 'história', to: 'fato · hipótese · lenda' },
  },
  {
    icon: CheckCircle2,
    title: 'Nada inventado',
    text: 'Nenhum verso, título, citação ou referência é criado. O ponto de partida é sempre o persa — nunca uma tradução inglesa protegida por direitos.',
    example: { from: 'persa', to: 'português' },
  },
]
</script>

<template>
  <div>
    <!-- Abertura -->
    <section class="hero">
      <NightAmbient :count="12" />
      <div class="container-reading relative py-20 text-center sm:py-24">
        <p class="eyebrow !text-gold">Transparência</p>
        <h1 class="hero__title">Como traduzimos</h1>
        <PersianText as="p" class="hero__fa">از فارسی به پرتغالی</PersianText>
        <p class="hero__lead">
          O que você está lendo, quem traduziu, com que critérios — e o que ainda falta.
        </p>
        <ul class="ribbon">
          <li><Bot class="size-4" aria-hidden="true" /> tradução por IA</li>
          <li><AlertTriangle class="size-4" aria-hidden="true" /> ainda não revisada</li>
          <li><Users class="size-4" aria-hidden="true" /> aberta a correções</li>
        </ul>
      </div>
      <svg class="arcade" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 40V22 Q25 0 50 22 Q75 0 100 22 Q125 0 150 22 Q175 0 200 22 Q225 0 250 22 Q275 0 300 22 Q325 0 350 22 Q375 0 400 22 Q425 0 450 22 Q475 0 500 22 Q525 0 550 22 Q575 0 600 22 Q625 0 650 22 Q675 0 700 22 Q725 0 750 22 Q775 0 800 22 Q825 0 850 22 Q875 0 900 22 Q925 0 950 22 Q975 0 1000 22 Q1025 0 1050 22 Q1075 0 1100 22 Q1125 0 1150 22 Q1175 0 1200 22 V40Z"
          fill="var(--color-ivory)"
        />
      </svg>
    </section>

    <!-- Em resumo -->
    <section class="container-editorial py-20" aria-labelledby="resumo">
      <p class="eyebrow text-center">Em resumo</p>
      <h2 id="resumo" class="mt-2 text-center text-4xl sm:text-5xl">O que você precisa saber</h2>
      <ul class="summary mt-12">
        <li
          v-for="(s, i) in summary"
          :key="s.title"
          v-reveal="i * 100"
          class="summary__card"
          :class="`summary__card--${s.tone}`"
        >
          <span class="summary__icon"
            ><component :is="s.icon" class="size-5" aria-hidden="true"
          /></span>
          <h3 class="mt-4 font-display text-2xl">{{ s.title }}</h3>
          <p class="mt-2 text-[0.95rem] text-ink-muted">{{ s.text }}</p>
        </li>
      </ul>
    </section>

    <!-- Anatomia de uma tradução -->
    <section v-if="example" class="anatomy" aria-labelledby="anatomia">
      <GirihPattern class="anatomy__pattern" :size="88" />
      <div class="container-editorial relative py-24">
        <div class="mx-auto max-w-2xl text-center">
          <p class="eyebrow !text-rose">Passo a passo, com um exemplo real</p>
          <h2 id="anatomia" class="mt-2 text-4xl !text-ivory sm:text-5xl">
            Anatomia de uma tradução
          </h2>
          <p class="mt-4 text-ivory/75">
            O primeiro dístico do primeiro gazel do Divã, do persa até a explicação. Todo poema do
            site passa por estas etapas.
          </p>
        </div>

        <ol class="flow mt-16">
          <li v-reveal class="stage">
            <span class="stage__node" aria-hidden="true">1</span>
            <div class="stage__card">
              <p class="stage__label">
                <ScrollText class="size-4" aria-hidden="true" /> O original
              </p>
              <p lang="fa" dir="rtl" class="stage__fa">
                <span v-for="(l, i) in example.fa" :key="i" class="block">{{ l }}</span>
              </p>
              <p class="stage__note">
                Texto persa da edição Qazvini-Ghani, importado do
                <a :href="example.source" target="_blank" rel="noopener">Ganjoor</a>. O primeiro
                verso, curiosamente, está em árabe.
              </p>
            </div>
          </li>

          <li v-if="example.note?.literal" v-reveal class="stage">
            <span class="stage__node" aria-hidden="true">2</span>
            <div class="stage__card">
              <p class="stage__label">
                <Microscope class="size-4" aria-hidden="true" /> Palavra por palavra
              </p>
              <p class="stage__literal">{{ example.note.literal }}</p>
              <p class="stage__note">
                Uma versão literal, que mostra a ordem e as imagens do original. Fica em “Para se
                aprofundar”, embaixo de cada dístico.
              </p>
            </div>
          </li>

          <li v-reveal class="stage stage--main">
            <span class="stage__node" aria-hidden="true">3</span>
            <div class="stage__card">
              <p class="stage__label">
                <BookOpenText class="size-4" aria-hidden="true" /> A tradução
              </p>
              <p class="stage__pt">
                <span v-for="(l, i) in example.pt" :key="i" class="block">{{ l }}</span>
              </p>
              <p class="stage__note">
                Uma versão legível, que prioriza: o sentido, as imagens concretas (taça, cabelos,
                caravana, rosa), as ambiguidades que o próprio Hafez deixou abertas e o ritmo.
              </p>
            </div>
          </li>

          <li v-if="example.note" v-reveal class="stage">
            <span class="stage__node" aria-hidden="true">4</span>
            <div class="stage__card">
              <p class="stage__label">
                <Lightbulb class="size-4" aria-hidden="true" /> Em palavras simples
              </p>
              <p class="stage__plain">{{ example.note.plain }}</p>
              <p class="stage__note">Como alguém diria isso hoje, sem nenhum jargão.</p>
            </div>
          </li>

          <li v-if="example.note" v-reveal class="stage">
            <span class="stage__node" aria-hidden="true">5</span>
            <div class="stage__card">
              <p class="stage__label">
                <Landmark class="size-4" aria-hidden="true" /> Por trás das palavras
              </p>
              <p class="stage__text"><GlossaryText :text="example.note.meaning" /></p>
              <p class="stage__note">
                Os costumes, crenças, lendas e personagens que o verso evoca — para quem nunca leu
                poesia persa.
              </p>
            </div>
          </li>

          <li v-if="example.note?.choices" v-reveal class="stage">
            <span class="stage__node" aria-hidden="true">6</span>
            <div class="stage__card">
              <p class="stage__label">
                <FileText class="size-4" aria-hidden="true" /> Por que traduzimos assim
              </p>
              <p class="stage__text"><GlossaryText :text="example.note.choices" /></p>
              <p class="stage__note">
                Quando uma palavra não tem equivalente, ou algo se perde, explicamos a escolha.
              </p>
            </div>
          </li>
        </ol>

        <p class="mt-12 text-center">
          <NuxtLink to="/diva/gazeis/1" class="cta">
            Ver o gazel 1 completo <ArrowRight class="size-4" aria-hidden="true" />
          </NuxtLink>
        </p>
      </div>
    </section>

    <!-- Critérios -->
    <section class="container-editorial py-24" aria-labelledby="criterios">
      <div class="grid gap-4 lg:grid-cols-[1fr_1.3fr] lg:items-end">
        <div>
          <p class="eyebrow">As regras do jogo</p>
          <h2 id="criterios" class="mt-2 text-4xl sm:text-5xl">Critérios de tradução</h2>
        </div>
        <p class="text-ink-muted lg:pb-2">
          Traduzir Hafez é escolher o que perder. Estas são as escolhas que fazemos em todos os
          poemas.
        </p>
      </div>
      <ul class="criteria mt-12">
        <li v-for="(c, i) in criteria" :key="c.title" v-reveal="(i % 3) * 100" class="criterion">
          <span class="criterion__icon"
            ><component :is="c.icon" class="size-5" aria-hidden="true"
          /></span>
          <h3 class="mt-4 font-display text-2xl">{{ c.title }}</h3>
          <p class="mt-2 text-ink-muted"><GlossaryText :text="c.text" /></p>
          <p class="criterion__ex" aria-hidden="true">
            <span :lang="/[؀-ۿ]/.test(c.example.from) ? 'fa' : undefined">{{
              c.example.from
            }}</span>
            <ArrowRight class="size-3.5 shrink-0" />
            <span>{{ c.example.to }}</span>
          </p>
        </li>
      </ul>
    </section>

    <!-- A IA -->
    <section class="container-editorial pb-24" aria-labelledby="ia">
      <div class="ai">
        <div class="ai__intro">
          <p class="eyebrow">Sem esconder nada</p>
          <h2 id="ia" class="mt-2 text-4xl">De onde vem o conhecimento da IA — e seus limites</h2>
          <p class="mt-4 text-ink-muted">
            As traduções são feitas por modelos de IA (Claude e Codex) com base no seu conhecimento
            do persa clássico, da tradição de comentário de Hafez e da história cultural do Irã, a
            partir do texto persa do Ganjoor. Nenhum comentário publicado foi copiado: as
            explicações são redação própria. Obras como o <em>Hafez-nameh</em>, de Bahaoddin
            Khorramshahi, e a <em>Encyclopaedia Iranica</em> aparecem nos créditos como referências
            para conferência.
          </p>
        </div>
        <div class="ai__cols">
          <div class="ai__col ai__col--good">
            <p class="ai__title"><CheckCircle2 class="size-4" aria-hidden="true" /> No que ajuda</p>
            <ul>
              <li>Ler o persa e o árabe do original, verso a verso</li>
              <li>Explicar imagens, lendas e costumes para iniciantes</li>
              <li>Registrar alternativas e ambiguidades em cada dístico</li>
              <li>Tornar os poemas legíveis já, sem esperar anos</li>
            </ul>
          </div>
          <div class="ai__col ai__col--risk">
            <p class="ai__title">
              <AlertTriangle class="size-4" aria-hidden="true" /> Onde pode errar
            </p>
            <ul>
              <li>Ler mal uma palavra rara ou uma variante do manuscrito</li>
              <li>Preferir uma interpretação minoritária sem perceber</li>
              <li>Atribuir a um costume um sentido impreciso</li>
              <li>Errar com aparência de segurança</li>
            </ul>
          </div>
        </div>
        <p class="ai__foot">
          É por isso que toda tradução feita por IA carrega o selo de “preliminar” até passar por
          revisão humana.
        </p>
      </div>
    </section>

    <!-- Contribuir -->
    <section class="container-editorial pb-8" aria-labelledby="contribuir">
      <div class="contribute">
        <div>
          <p class="eyebrow !text-rose">Faça parte</p>
          <h2 id="contribuir" class="mt-2 text-4xl !text-ivory">Como contribuir com correções</h2>
          <p class="mt-4 text-ivory/80">
            Lê persa ou estuda Hafez e encontrou um erro, uma nuance perdida ou uma leitura melhor?
            Sua contribuição é o que vai transformar as traduções preliminares em definitivas.
          </p>
          <p class="mt-4 text-sm text-ivory/60">
            O canal oficial para envio de correções será divulgado em breve nesta página.
          </p>
        </div>
        <div class="ticket" aria-label="O que incluir numa correção">
          <p class="ticket__head">O que incluir numa correção</p>
          <dl>
            <div>
              <dt>Poema</dt>
              <dd>Gazel 1</dd>
            </div>
            <div>
              <dt>Dístico</dt>
              <dd>2</dd>
            </div>
            <div>
              <dt>Problema</dt>
              <dd>uma palavra, um sentido, uma nuance</dd>
            </div>
            <div>
              <dt>Sugestão</dt>
              <dd>a sua leitura ou tradução</dd>
            </div>
            <div>
              <dt>Fonte</dt>
              <dd>se possível, um comentário ou dicionário</dd>
            </div>
          </dl>
          <p class="ticket__note">Exemplo do formato — ainda não é um formulário.</p>
        </div>
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
    radial-gradient(ellipse at 100% 100%, rgb(112 47 61 / 0.45), transparent 50%), #0c1916;
}
.hero__title {
  margin-top: 0.75rem;
  font-size: clamp(3rem, 8vw, 5.2rem);
  line-height: 1;
  color: var(--color-ivory);
  animation: rise 1.1s var(--ease-garden) both;
}
.hero__fa {
  margin-top: 0.5rem;
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  color: #d9b97a;
  animation: rise 1.1s 0.1s var(--ease-garden) both;
}
.hero__lead {
  max-width: 30rem;
  margin: 1.25rem auto 0;
  font-size: 1.1rem;
  color: rgb(247 241 230 / 0.8);
  animation: rise 1.1s 0.2s var(--ease-garden) both;
}
.ribbon {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  animation: rise 1.1s 0.3s var(--ease-garden) both;
}
.ribbon li {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  color: #f1dca8;
  background: rgb(247 241 230 / 0.06);
  border: 1px solid rgb(217 185 122 / 0.4);
}
.arcade {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  width: 100%;
  height: 2.25rem;
}

/* ── Resumo ── */
.summary {
  display: grid;
  gap: 1rem;
}
@media (min-width: 640px) {
  .summary {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .summary {
    grid-template-columns: repeat(4, 1fr);
  }
}
.summary__card {
  --tone: var(--color-cypress);
  padding: 1.75rem;
  border-radius: 1.25rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
  border-top: 4px solid var(--tone);
}
.summary__card--info {
  --tone: #1f3d5a;
}
.summary__card--warn {
  --tone: var(--color-wine);
}
.summary__card--next {
  --tone: var(--color-gold);
}
.summary__icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  color: var(--tone);
  background: color-mix(in srgb, var(--tone) 12%, transparent);
}

/* ── Anatomia ── */
.anatomy {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 0% 0%, rgb(201 148 153 / 0.25), transparent 45%),
    radial-gradient(ellipse at 100% 100%, rgb(181 149 88 / 0.18), transparent 45%),
    var(--color-wine-deep);
}
.anatomy__pattern {
  position: absolute;
  inset: 0;
  color: rgb(247 241 230 / 0.05);
}
.flow {
  position: relative;
  display: grid;
  gap: 1.5rem;
  max-width: 48rem;
  margin-inline: auto;
  padding-left: 3.25rem;
}
.flow::before {
  content: '';
  position: absolute;
  left: 1.1rem;
  top: 1.5rem;
  bottom: 1.5rem;
  width: 2px;
  background: linear-gradient(to bottom, transparent, #d9b97a 5%, #d9b97a 95%, transparent);
  opacity: 0.6;
}
.stage {
  position: relative;
}
.stage__node {
  position: absolute;
  left: -3.25rem;
  top: 1.3rem;
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  clip-path: polygon(
    50% 0,
    64% 15%,
    85% 15%,
    85% 36%,
    100% 50%,
    85% 64%,
    85% 85%,
    64% 85%,
    50% 100%,
    36% 85%,
    15% 85%,
    15% 64%,
    0 50%,
    15% 36%,
    15% 15%,
    36% 15%
  );
  background: #d9b97a;
  font-family: var(--font-display);
  font-size: 1.05rem;
  color: var(--color-ink);
  font-variant-numeric: lining-nums;
}
.stage__card {
  padding: 1.5rem 1.6rem;
  border-radius: 1.25rem;
  color: var(--color-ink);
  background: #fffaf0;
  box-shadow: 0 30px 50px -35px rgb(0 0 0 / 0.6);
}
.stage--main .stage__card {
  box-shadow:
    0 0 0 3px #d9b97a,
    0 30px 60px -30px rgb(0 0 0 / 0.65);
}
.stage__label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-wine);
}
.stage__fa {
  margin-top: 0.9rem;
  font-family: var(--font-persian);
  font-size: clamp(1.3rem, 3vw, 1.7rem);
  line-height: 2;
  text-align: center;
  color: var(--color-cypress);
}
.stage__literal {
  margin-top: 0.9rem;
  font-family: var(--font-serif);
  font-style: italic;
  line-height: 1.7;
  color: var(--color-ink);
}
.stage__pt {
  margin-top: 0.9rem;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  line-height: 1.4;
  text-align: center;
}
.stage__plain {
  margin-top: 0.9rem;
  padding: 0.9rem 1.1rem;
  border-radius: 0.9rem;
  font-size: 1.1rem;
  background: rgb(201 148 153 / 0.18);
}
.stage__text {
  margin-top: 0.9rem;
  line-height: 1.7;
  color: var(--color-ink-muted);
}
.stage__note {
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px dashed var(--color-line);
  font-size: 0.85rem;
  color: var(--color-ink-muted);
}
.cta {
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
.cta:hover {
  color: var(--color-ink);
  transform: translateY(-2px);
}

/* ── Critérios ── */
.criteria {
  display: grid;
  gap: 1.25rem;
}
@media (min-width: 768px) {
  .criteria {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .criteria {
    grid-template-columns: repeat(3, 1fr);
  }
}
.criterion {
  display: flex;
  flex-direction: column;
  padding: 1.9rem;
  border-radius: 1.5rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
}
.criterion__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  color: var(--color-wine);
  background: rgb(181 149 88 / 0.18);
}
.criterion__ex {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: auto;
  padding-top: 1.25rem;
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--color-wine);
}
.criterion__ex > span:first-child {
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
  color: var(--color-ink-muted);
  background: var(--color-paper);
}
.criterion__ex [lang='fa'] {
  font-family: var(--font-persian);
}

/* ── IA ── */
.ai {
  padding: 2.5rem 2rem;
  border-radius: 1.75rem;
  background: var(--color-paper);
  border: 1px solid var(--color-line);
}
@media (min-width: 900px) {
  .ai {
    padding: 3rem;
  }
}
.ai__intro {
  max-width: 46rem;
}
.ai__cols {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}
@media (min-width: 768px) {
  .ai__cols {
    grid-template-columns: 1fr 1fr;
  }
}
.ai__col {
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: #fffdf8;
}
.ai__col ul {
  display: grid;
  gap: 0.6rem;
  margin-top: 1rem;
  color: var(--color-ink-muted);
}
.ai__col li {
  padding-left: 1.2rem;
  position: relative;
}
.ai__col li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 0.5rem;
  height: 0.5rem;
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
  background: currentColor;
}
.ai__col--good li::before {
  color: var(--color-cypress);
}
.ai__col--risk li::before {
  color: var(--color-wine);
}
.ai__title {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.ai__col--good .ai__title {
  color: var(--color-cypress);
}
.ai__col--risk .ai__title {
  color: var(--color-wine);
}
.ai__foot {
  margin-top: 1.5rem;
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--color-ink);
}

/* ── Contribuir ── */
.contribute {
  display: grid;
  gap: 2.5rem;
  padding: 2.5rem 2rem;
  border-radius: 1.75rem;
  color: var(--color-ivory);
  background:
    radial-gradient(circle at 100% 0%, rgb(201 148 153 / 0.3), transparent 45%),
    var(--color-cypress);
}
@media (min-width: 900px) {
  .contribute {
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: 3rem;
  }
}
.ticket {
  padding: 1.5rem;
  border-radius: 1.25rem;
  color: var(--color-ink);
  background: #fffaf0;
  box-shadow: 0 30px 50px -30px rgb(0 0 0 / 0.5);
  rotate: -1deg;
}
.ticket__head {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-wine);
}
.ticket dl {
  display: grid;
  gap: 0.6rem;
  margin-top: 1rem;
}
.ticket dl > div {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: 0.75rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px dashed var(--color-line);
  font-size: 0.92rem;
}
.ticket dt {
  color: var(--color-ink-muted);
}
.ticket dd {
  font-family: var(--font-display);
  font-size: 1.1rem;
}
.ticket__note {
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: var(--color-ink-muted);
}

@keyframes rise {
  from {
    opacity: 0;
    translate: 0 18px;
  }
}
</style>
