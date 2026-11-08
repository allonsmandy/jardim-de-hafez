<script setup lang="ts">
import { ArrowRight, ArrowDown } from '@lucide/vue'

useSeoMeta({
  title: 'O Poeta — Hafez de Shiraz',
  description:
    'Quem foi Hafez de Shiraz, poeta persa do século XIV: vida, a cidade e os governantes da época, como ele escrevia, lendas e legado — separando fatos, leituras dos estudiosos e tradições populares.',
})

type Reliability = 'fato' | 'estudiosos' | 'tradicao'
type Era = 'antes' | 'inju' | 'mozaffar' | 'timur'

const { open: openTerm } = useGlossary()

/* Abertura: partículas (posições fixas, iguais no servidor e no navegador) e paralaxe do mouse. */
const sparks = Array.from({ length: 18 }, (_, i) => ({
  kind: i % 3 === 0 ? 'star' : 'petal',
  left: `${(i * 53) % 100}%`,
  delay: `${-((i * 7) % 19)}s`,
  duration: `${14 + ((i * 5) % 10)}s`,
  size: `${0.45 + ((i * 3) % 5) * 0.12}rem`,
}))
const heroEl = ref<HTMLElement>()
function onHeroMove(e: PointerEvent) {
  const el = heroEl.value
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
  el.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
}

const facts = [
  { label: 'Cidade', value: 'Shiraz', sub: 'sul do atual Irã' },
  { label: 'Viveu', value: 'c. 1320–1390', sub: 'nascimento incerto' },
  { label: 'Obra', value: '~500', sub: 'gazéis no Divã' },
  { label: 'Lido há', value: '600+', sub: 'anos, sem parar' },
]

const names = [
  {
    fa: 'شمس‌الدین محمد',
    pt: 'Shamseddin Mohammad',
    tag: 'o nome de batismo',
    text: '“Shamseddin” era um título comum na época: “Sol da Fé”.',
  },
  {
    fa: 'حافظ',
    pt: 'Hafez',
    tag: 'o nome de poeta',
    text: 'Quer dizer “quem sabe o Alcorão de cor”. Ele assina quase todo poema com esse nome, no último par de versos.',
  },
  {
    fa: 'خواجه',
    pt: 'Khajeh',
    tag: 'o tratamento',
    text: 'Algo como “mestre” ou “senhor”. No Irã, ele é Khajeh Hafez.',
  },
  {
    fa: 'لسان‌الغیب',
    pt: 'Lessan al-Gheyb',
    tag: 'o apelido',
    text: '“A Língua do Invisível”: alguém que parece falar do além — daí o costume do Fal.',
  },
]

/* Régua comparativa: 1300 → 1500. */
const AXIS = { from: 1300, to: 1500 }
const pct = (y: number) => `${((y - AXIS.from) / (AXIS.to - AXIS.from)) * 100}%`
const span = (a: number, b: number) => ({ left: pct(a), width: `${((b - a) / 200) * 100}%` })
const ticks = [1300, 1350, 1400, 1450, 1500]
const shirazBars = [
  { from: 1343, to: 1353, label: 'Abu Eshaq', era: 'inju' as Era },
  { from: 1353, to: 1393, label: 'Mozaffaridas', era: 'mozaffar' as Era },
]
const worldMarks = [
  { year: 1321, label: 'Morre Dante' },
  { year: 1348, label: 'Peste Negra' },
  { year: 1374, label: 'Morre Petrarca' },
  { year: 1385, label: 'Aljubarrota' },
  { year: 1453, label: 'Queda de Constantinopla' },
  { year: 1500, label: 'Cabral no Brasil' },
]

const timeline: { year: string; title: string; text: string; kind: Reliability; era: Era }[] = [
  {
    year: 'c. 1320',
    title: 'Nasce Hafez, em Shiraz',
    text: 'Nenhum documento da época registra o ano. As datas propostas (entre 1315 e 1325) vêm de cálculos a partir dos poemas e de relatos posteriores.',
    kind: 'estudiosos',
    era: 'antes',
  },
  {
    year: 'infância',
    title: 'Um menino pobre que estudava',
    text: 'Relatos posteriores contam que o pai, Baha al-Din, era comerciante e morreu quando Hafez ainda era criança, deixando a família endividada, e que o menino trabalhou cedo — numa padaria, segundo a tradição. Pelos poemas, sabemos que ele teve uma formação sólida: domina o Alcorão, o árabe e toda a poesia persa anterior. Talvez tenha ensinado o Alcorão numa escola religiosa.',
    kind: 'tradicao',
    era: 'antes',
  },
  {
    year: '1335',
    title: 'O império mongol se desfaz',
    text: 'Morre Abu Sa‘id, último grande soberano mongol do Irã. O território se parte em reinos rivais, e Shiraz passa a ser disputada por dinastias locais.',
    kind: 'fato',
    era: 'antes',
  },
  {
    year: '1343',
    title: 'Os anos de Abu Eshaq',
    text: 'Abu Eshaq Inju governa Shiraz: um príncipe amante da poesia e da vida de corte. Hafez o elogia e parece ter vivido aí seus anos mais felizes. O vizir Haji Qavam é outro protetor citado pelo nome no Divã.',
    kind: 'fato',
    era: 'inju',
  },
  {
    year: '1353',
    title: 'Chega o governante severo',
    text: 'Mobarez al-Din, da dinastia Mozaffarida, toma Shiraz. Conhecido pelo rigor religioso, fechou tavernas e proibiu o vinho. Muitos estudiosos leem as ironias de Hafez contra os “falsos devotos” como reação a esse clima.',
    kind: 'estudiosos',
    era: 'mozaffar',
  },
  {
    year: '1358',
    title: 'Shah Shoja no poder',
    text: 'Shah Shoja, filho de Mobarez, derruba o próprio pai e governa até 1384. A relação com Hafez teve altos e baixos; há sinais de que o poeta caiu em desgraça por um tempo e viveu fora de Shiraz — talvez em Yazd e Isfahan — antes de voltar. No gazel 12, ele manda um recado aos moradores de Yazd.',
    kind: 'estudiosos',
    era: 'mozaffar',
  },
  {
    year: '1387',
    title: 'Tamerlão entra em Shiraz',
    text: 'O conquistador Timur (Tamerlão) toma a cidade. Hafez ainda estava vivo — e daqui nasce a lenda mais famosa sobre ele.',
    kind: 'fato',
    era: 'timur',
  },
  {
    year: '1389/90',
    title: 'Morte de Hafez',
    text: 'Ele morre em Shiraz e é enterrado num jardim da cidade, o Mosalla, que ele mesmo elogia nos poemas. O ano 1390 (792 do calendário islâmico) vem de relatos do século XV, como o do poeta Jami, e de uma inscrição no túmulo.',
    kind: 'fato',
    era: 'timur',
  },
  {
    year: 'depois',
    title: 'O Divã é reunido',
    text: 'Hafez não organizou o próprio livro. Segundo o prefácio atribuído a seu contemporâneo Mohammad Golandam, os poemas foram reunidos depois da morte do poeta. Nos séculos seguintes, copistas acrescentaram e mudaram versos, e os manuscritos passaram a variar muito. Só no século XX, comparando as cópias mais antigas, Qazvini e Ghani publicaram (1941) a edição crítica que este site segue.',
    kind: 'estudiosos',
    era: 'timur',
  },
]

/* Esquema de um gazel: o 1º dístico rima nas duas metades; os outros, só na segunda. */
const anatomy = [
  { a: 78, b: 72, first: true },
  { a: 70, b: 80 },
  { a: 82, b: 66 },
  { a: 64, b: 76 },
  { a: 76, b: 70 },
  { a: 72, b: 78, last: true },
]

const readings = [
  {
    term: 'vinho',
    word: 'O vinho',
    earthly: 'vinho de verdade, festa, alegria',
    mystic: 'o êxtase do encontro com Deus',
  },
  {
    term: 'amado',
    word: 'O amado',
    earthly: 'uma pessoa bonita e cruel',
    mystic: 'Deus, que se mostra e se esconde',
  },
  {
    term: 'saqi',
    word: 'O copeiro',
    earthly: 'quem serve o vinho na festa',
    mystic: 'o mestre que dá a graça',
  },
  {
    term: 'pir-e-moghan',
    word: 'A taverna',
    earthly: 'o lugar proibido da cidade',
    mystic: 'onde a verdade não se disfarça',
  },
]

const legends = [
  {
    numeral: 'I',
    title: 'Hafez e Tamerlão',
    told: 'Num gazel famoso, Hafez diz que daria Samarcanda e Bucara — as joias do império de Tamerlão — pela pinta no rosto do amado. Conta-se que o conquistador o chamou: “Conquistei o mundo para enriquecer essas cidades, e tu as dás por uma pinta?”. Hafez, malvestido, teria respondido: “É por essa generosidade que estou assim, senhor”.',
    known:
      'Aparece num livro de biografias de poetas escrito quase cem anos depois, o Memorial dos Poetas de Dowlatshah. Nenhum registro histórico do encontro.',
    verdict: 1,
    link: { to: '/diva/gazeis/3', label: 'Ler o gazel da pinta' },
  },
  {
    numeral: 'II',
    title: 'As quarenta noites',
    told: 'Hafez teria sido ajudante de padeiro, apaixonado por uma moça chamada Shakh-e Nabat (“ramo de açúcar”). Passou quarenta noites acordado no túmulo de um santo; na última, um anjo lhe deu de beber, e com o gole veio o dom da poesia.',
    known:
      'Não aparece nas fontes mais antigas sobre Hafez; formou-se séculos depois. Linda, muito contada — mas não é biografia.',
    verdict: 0,
  },
  {
    numeral: 'III',
    title: 'A viagem à Índia',
    told: 'Um sultão da Índia teria convidado Hafez e pago a viagem. O poeta embarcou, mas uma tempestade o assustou; voltou a Shiraz e mandou ao sultão um gazel no lugar de si mesmo.',
    known:
      'Contada por cronistas indianos posteriores. Alguns estudiosos a acham plausível. Certo é que Hafez viveu quase sempre em Shiraz e a celebra como nenhuma outra cidade.',
    verdict: 2,
  },
  {
    numeral: 'IV',
    title: 'O menino que decorou o Alcorão',
    told: 'Conta-se que, ainda criança, Hafez aprendeu o Alcorão inteiro só de ouvir o pai recitar — e depois decorou também os grandes poetas persas, como Rumi, Saadi, Attar de Nishapur e Nezami.',
    known:
      'Que ele sabia o Alcorão de cor é fato: ele mesmo diz isso num verso (veja acima). A cena da infância e a lista de livros decorados são tradição.',
    verdict: 2,
  },
  {
    numeral: 'V',
    title: 'A iluminação aos sessenta',
    told: 'Já velho, Hafez teria passado quarenta dias dentro de um círculo traçado no chão, em vigília. No último dia, seu mestre lhe ofereceu uma taça de vinho, e ele teria alcançado a união com Deus.',
    known:
      'Aparece em biografias espirituais modernas, muito populares no Ocidente, que falam até em “consciência cósmica” — vocabulário do século XX. Não tem base nas fontes antigas.',
    verdict: 0,
  },
]
const VERDICTS = ['Lenda', 'Muito improvável', 'Talvez']

const references = [
  [
    'Encyclopaedia Iranica',
    'verbetes sobre Hafez, os Injuidas e os Mozaffaridas — base das datas.',
  ],
  [
    'Prefácio atribuído a Mohammad Golandam',
    'abre muitos manuscritos do Divã; principal fonte antiga sobre o poeta.',
  ],
  [
    'Dowlatshah Samarqandi, Tazkirat al-Shu‘ara (1487)',
    'o “Memorial dos Poetas”, origem da anedota com Tamerlão.',
  ],
  ['Qazvini e Ghani, edição crítica do Divã (1941)', 'a edição cujo texto e numeração seguimos.'],
  [
    'Edward G. Browne, A Literary History of Persia, vol. III',
    'história clássica da literatura persa; alerta para a pouca confiabilidade das biografias antigas.',
  ],
  [
    'Wikipédia em português, verbete “Hafez”',
    'usado só como roteiro de temas; cada dado foi conferido em outras fontes, e o que não se confirmou ficou de fora.',
  ],
  [
    'Bahaoddin Khorramshahi, Hafez-nameh',
    'comentário moderno de referência para as leituras dos poemas.',
  ],
] as const
</script>

<template>
  <div class="poet">
    <!-- ───────────── Abertura ───────────── -->
    <section ref="heroEl" class="hero" @pointermove="onHeroMove">
      <GirihPattern class="hero__pattern" />
      <div class="hero__sparks" aria-hidden="true">
        <span
          v-for="(sp, i) in sparks"
          :key="i"
          :class="`spark spark--${sp.kind}`"
          :style="{
            left: sp.left,
            animationDelay: sp.delay,
            animationDuration: sp.duration,
            width: sp.size,
            height: sp.size,
          }"
        />
      </div>
      <div class="hero__parallax-far" aria-hidden="true">
        <p class="hero__watermark" lang="fa">حافظ</p>
      </div>
      <div
        class="container-editorial relative grid items-center gap-12 py-20 lg:grid-cols-[1.2fr_1fr] lg:py-28"
      >
        <div>
          <p class="eyebrow !text-gold">O poeta de Shiraz · século XIV</p>
          <h1 class="hero__title" aria-label="Hafez">
            <span
              v-for="(ch, i) in 'Hafez'"
              :key="i"
              class="hero__letter"
              :style="{ animationDelay: `${0.15 + i * 0.09}s` }"
              aria-hidden="true"
              >{{ ch }}</span
            >
          </h1>
          <p class="mt-6 max-w-xl text-lg text-ivory/80 sm:text-xl">
            Viveu há quase 700 anos numa cidade de jardins, rosas e vinhedos. Escreveu sobre amor,
            vinho e Deus com tanta liberdade que até hoje ninguém concorda sobre o que ele
            “realmente” quis dizer — e é por isso que ainda o leem.
          </p>
          <a href="#vida" class="hero__cta">
            Conhecer a história <ArrowDown class="size-4" aria-hidden="true" />
          </a>
        </div>
        <figure class="hero__arch-wrap" aria-label="Lessan al-Gheyb, A Língua do Invisível">
          <svg class="hero__rosette" viewBox="0 0 200 200" aria-hidden="true">
            <g fill="none" stroke="currentColor" stroke-width="0.6">
              <rect x="40" y="40" width="120" height="120" />
              <rect x="40" y="40" width="120" height="120" transform="rotate(45 100 100)" />
              <rect x="60" y="60" width="80" height="80" transform="rotate(22.5 100 100)" />
              <rect x="60" y="60" width="80" height="80" transform="rotate(67.5 100 100)" />
              <circle cx="100" cy="100" r="92" />
              <circle cx="100" cy="100" r="30" />
            </g>
          </svg>
          <PersianArch class="hero__arch" />
          <div class="hero__arch-inner">
            <PersianText as="p" class="text-4xl text-gold sm:text-5xl">لسان‌الغیب</PersianText>
            <p class="mt-3 font-display text-2xl text-ivory italic">A Língua do Invisível</p>
            <p class="mt-2 text-sm text-ivory/60">como os iranianos o chamam</p>
          </div>
        </figure>
      </div>
      <dl class="hero__facts container-editorial">
        <div v-for="f in facts" :key="f.label" class="hero__fact">
          <dt class="text-[0.7rem] tracking-[0.2em] text-gold uppercase">{{ f.label }}</dt>
          <dd class="mt-1 font-display text-4xl text-ivory [font-variant-numeric:lining-nums]">
            {{ f.value }}
          </dd>
          <dd class="text-sm text-ivory/60"><GlossaryText :text="f.sub" /></dd>
        </div>
      </dl>
    </section>

    <!-- ───────────── Selos ───────────── -->
    <section class="container-editorial py-14" aria-labelledby="como-ler">
      <div class="seals">
        <div class="max-w-md">
          <h2 id="como-ler" class="text-3xl">Fato, hipótese ou lenda?</h2>
          <p class="mt-3 text-ink-muted">
            Quase tudo que se conta sobre Hafez foi escrito muito depois da morte dele. Cada
            informação desta página traz um selo para você saber em que acreditar.
          </p>
        </div>
        <ul class="grid gap-3 sm:grid-cols-3">
          <li v-reveal="0" class="seal">
            <ReliabilityBadge kind="fato" /><span>Está em documentos ou nos próprios poemas.</span>
          </li>
          <li v-reveal="120" class="seal">
            <ReliabilityBadge kind="estudiosos" /><span
              >Hipótese razoável, sem prova definitiva.</span
            >
          </li>
          <li v-reveal="240" class="seal">
            <ReliabilityBadge kind="tradicao" /><span>Contada há séculos, sem confirmação.</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ───────────── Nomes ───────────── -->
    <section class="names" aria-labelledby="nomes">
      <div class="container-editorial py-20">
        <h2 id="nomes" class="text-center text-4xl sm:text-5xl">Um homem, quatro nomes</h2>
        <ol
          class="mt-14 grid gap-px overflow-hidden rounded-3xl bg-line sm:grid-cols-2 lg:grid-cols-4"
        >
          <li v-for="(n, i) in names" :key="n.pt" v-reveal="i * 110" class="name">
            <span class="name__index">0{{ i + 1 }}</span>
            <PersianText as="p" block class="name__fa">{{ n.fa }}</PersianText>
            <p class="mt-4 text-[0.7rem] tracking-[0.2em] text-cypress uppercase">{{ n.tag }}</p>
            <p class="mt-1 font-display text-2xl text-wine">{{ n.pt }}</p>
            <p class="mt-3 text-[0.95rem] text-ink-muted"><GlossaryText :text="n.text" /></p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ───────────── Citação ───────────── -->
    <section class="quote" aria-labelledby="alcorao-de-cor">
      <GirihPattern class="quote__pattern" :size="96" />
      <div
        class="container-editorial relative grid gap-12 py-24 lg:grid-cols-[1.3fr_1fr] lg:items-center"
      >
        <figure v-reveal>
          <p id="alcorao-de-cor" class="eyebrow !text-rose">Nas palavras do próprio Hafez</p>
          <blockquote class="mt-8">
            <PersianText as="p" block class="quote__fa">
              عشقت رسد به فریاد ار خود به سان حافظ<br />
              قرآن ز بر بخوانی در چارده روایت
            </PersianText>
            <p class="quote__pt">
              “O teu amor virá em teu socorro, ainda que, como Hafez, recites o Alcorão de cor nas
              catorze leituras.”
            </p>
          </blockquote>
          <figcaption class="mt-6 text-sm text-ivory/60">
            Gazel 94, último dístico · tradução preliminar do projeto
          </figcaption>
        </figure>
        <div v-reveal="200" class="quote__note">
          <p class="font-display text-2xl text-gold">Por que este verso importa</p>
          <p class="mt-3 text-ivory/85">
            Ele confirma o próprio apelido: Hafez sabia o
            <button type="button" class="glossary-term" @click="openTerm('alcorao')">
              Alcorão
            </button>
            inteiro de memória, nas catorze maneiras tradicionais de recitá-lo — saber de
            especialista.
          </p>
          <p class="mt-3 text-ivory/85">
            O resto tem duas leituras: o amor te ajuda mesmo que você seja um sábio assim, ou o amor
            vale mais que todo esse saber. Nas duas, a última palavra é do amor.
          </p>
          <ReliabilityBadge kind="fato" class="mt-5 !bg-ivory/90" />
        </div>
      </div>
    </section>

    <!-- ───────────── Régua: lá e cá ───────────── -->
    <section id="vida" class="container-editorial scroll-mt-20 pt-24" aria-labelledby="regua">
      <div class="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-end">
        <div>
          <p class="eyebrow">Para situar</p>
          <h2 id="regua" class="mt-2 text-4xl sm:text-5xl">Lá e cá</h2>
        </div>
        <p class="text-ink-muted lg:pb-2">
          Hafez é contemporâneo de Petrarca e viu Shiraz trocar de dono várias vezes. Quando ele
          morreu, Portugal tinha acabado de vencer em Aljubarrota — e faltava mais de um século para
          Cabral chegar ao Brasil.
        </p>
      </div>
      <div class="ruler-scroll mt-10">
        <div v-reveal class="ruler">
          <div class="ruler__row ruler__row--shiraz">
            <span class="ruler__label">Shiraz</span>
            <div class="ruler__track">
              <span
                v-for="b in shirazBars"
                :key="b.label"
                class="ruler__bar"
                :class="`ruler__bar--${b.era}`"
                :style="span(b.from, b.to)"
                ><em><GlossaryText :text="b.label" /></em
              ></span>
              <span class="ruler__pin" :style="{ left: pct(1387) }"
                ><GlossaryText text="Timur"
              /></span>
            </div>
          </div>
          <div class="ruler__row">
            <span class="ruler__label !text-wine">Hafez</span>
            <div class="ruler__track">
              <span class="ruler__life" :style="span(1315, 1390)">vida de Hafez</span>
            </div>
          </div>
          <div class="ruler__row ruler__row--world">
            <span class="ruler__label">Europa</span>
            <div class="ruler__track">
              <span
                v-for="(m, i) in worldMarks"
                :key="m.year"
                class="ruler__mark"
                :class="{ 'ruler__mark--low': i % 2 === 1, 'ruler__mark--end': m.year >= 1450 }"
                :style="{ left: pct(m.year) }"
              >
                <b>{{ m.year }}</b> {{ m.label }}
              </span>
            </div>
          </div>
          <div class="ruler__axis">
            <span v-for="t in ticks" :key="t" :style="{ left: pct(t) }">{{ t }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────── Linha do tempo ───────────── -->
    <section class="container-editorial py-20" aria-labelledby="vida-titulo">
      <h2 id="vida-titulo" class="max-w-2xl text-4xl sm:text-5xl">Uma vida entre reis que caíam</h2>
      <p class="mt-4 max-w-2xl text-ink-muted">
        <GlossaryText
          text="Ora o governante era um príncipe festeiro que amava poesia, ora um homem severo que fechava as tavernas. O vinho, a taverna e a crítica aos falsos devotos nos poemas também falam desse vai e vem."
        />
      </p>
      <ol class="chrono mt-14">
        <li
          v-for="item in timeline"
          :key="item.title"
          v-reveal
          class="chrono__item"
          :class="`chrono__item--${item.era}`"
        >
          <p class="chrono__year">{{ item.year }}</p>
          <div class="chrono__body">
            <h3 class="font-display text-2xl">{{ item.title }}</h3>
            <p class="mt-2 text-ink-muted"><GlossaryText :text="item.text" /></p>
            <ReliabilityBadge :kind="item.kind" class="mt-3" />
          </div>
        </li>
      </ol>
    </section>

    <!-- ───────────── Anatomia do gazel ───────────── -->
    <section class="anatomy" aria-labelledby="como-escrevia">
      <div class="container-editorial grid gap-14 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p class="eyebrow">A arte de Hafez</p>
          <h2 id="como-escrevia" class="mt-2 text-4xl sm:text-5xl">
            <GlossaryText text="Como é um gazel por dentro" />
          </h2>
          <p class="mt-5 text-ink-muted">
            <GlossaryText
              text="Quase tudo que Hafez escreveu são gazéis: poemas curtos, de uns 7 a 12 dísticos (pares de versos). Três regras explicam a forma:"
            />
          </p>
          <ol class="mt-8 space-y-6">
            <li class="rule">
              <span class="rule__n">1</span>
              <p>
                <strong>A mesma rima do começo ao fim.</strong> O primeiro par rima nas duas
                metades; os outros, só no fim da segunda.
              </p>
            </li>
            <li class="rule">
              <span class="rule__n">2</span>
              <p>
                <strong>Cada par de versos é quase independente.</strong> O poema pode mudar de
                assunto de um par para o outro — mais um colar de pérolas que uma história.
              </p>
            </li>
            <li class="rule">
              <span class="rule__n">3</span>
              <p>
                <strong>A assinatura no fim.</strong> No último par, o poeta fala de si pelo nome:
                “Hafez, não te queixes…”. Isso se chama
                <button type="button" class="glossary-term" @click="openTerm('takhallos')">
                  takhallos</button
                >.
              </p>
            </li>
          </ol>
        </div>
        <figure
          v-reveal
          class="diagram"
          aria-label="Esquema de um gazel: seis pares de versos, rimas marcadas em dourado e assinatura no último par."
        >
          <p class="diagram__caption">esquema de um gazel · lê-se da direita para a esquerda</p>
          <ol class="mt-6 space-y-3">
            <li
              v-for="(c, i) in anatomy"
              :key="i"
              class="couplet"
              :class="{ 'couplet--last': c.last }"
            >
              <span class="couplet__n">{{ i + 1 }}</span>
              <span class="couplet__line" :style="{ width: `${c.a}%` }">
                <i v-if="c.first" class="couplet__rhyme" />
              </span>
              <span class="couplet__line" :style="{ width: `${c.b}%` }">
                <i class="couplet__rhyme" />
                <em v-if="c.last" class="couplet__sign">حافظ</em>
              </span>
            </li>
          </ol>
          <div class="diagram__legend">
            <span><i class="couplet__rhyme !static !translate-none" /> rima repetida</span>
            <span
              ><em class="couplet__sign !static !translate-none">حافظ</em> assinatura do poeta</span
            >
          </div>
        </figure>
      </div>
    </section>

    <!-- ───────────── Duas leituras ───────────── -->
    <section class="container-editorial py-24" aria-labelledby="leituras">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow">O grande debate</p>
        <h2 id="leituras" class="mt-2 text-4xl sm:text-5xl">Na taverna ou no céu?</h2>
        <p class="mt-5 text-ink-muted">
          <GlossaryText
            text="As mesmas palavras podem falar de festa e amor humano ou de Deus. Muitos leitores iranianos leem Hafez como mística sufi; outros estudiosos o veem como poeta de corte, livre-pensador, que usa as imagens místicas com ironia. Não há documento que prove que ele pertenceu a uma ordem sufi. Hafez escreve de modo que as duas leituras fiquem de pé."
          />
        </p>
        <ReliabilityBadge kind="estudiosos" class="mt-4" />
      </div>
      <div class="readings mt-14">
        <div class="readings__head">
          <span class="readings__col" />
          <span class="readings__col readings__col--earth">Leitura terrena</span>
          <span class="readings__col readings__col--sky">Leitura mística</span>
        </div>
        <div v-for="(r, i) in readings" :key="r.term" v-reveal="i * 90" class="readings__row">
          <button type="button" class="readings__word" @click="openTerm(r.term)">
            {{ r.word }} <ArrowRight class="size-4 opacity-50" aria-hidden="true" />
          </button>
          <p class="readings__cell readings__cell--earth">
            <span class="readings__mobile">Terrena</span>{{ r.earthly }}
          </p>
          <p class="readings__cell readings__cell--sky">
            <span class="readings__mobile">Mística</span>{{ r.mystic }}
          </p>
        </div>
      </div>
      <p class="mt-6 text-center text-sm text-ink-muted">
        Nas explicações dos poemas, mostramos as duas leituras sempre que o verso permite.
      </p>
    </section>

    <!-- ───────────── Lendas ───────────── -->
    <section class="legends" aria-labelledby="lendas">
      <GirihPattern class="legends__pattern" :size="88" />
      <div class="container-editorial relative py-24">
        <div class="grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <h2 id="lendas" class="text-4xl !text-ivory sm:text-5xl">Cinco lendas sobre Hafez</h2>
          <p class="text-ivory/75 lg:pb-2">E o que os historiadores dizem sobre cada uma.</p>
        </div>
        <ul class="mt-14 grid gap-6 lg:grid-cols-3">
          <li v-for="(l, i) in legends" :key="l.title" v-reveal="i * 140" class="legend">
            <div class="flex items-start justify-between gap-4">
              <span class="legend__numeral">{{ l.numeral }}</span>
              <ReliabilityBadge kind="tradicao" />
            </div>
            <h3 class="mt-4 font-display text-3xl">{{ l.title }}</h3>
            <p class="mt-3 text-[0.95rem] leading-relaxed"><GlossaryText :text="l.told" /></p>
            <div class="legend__known">
              <div class="flex items-center justify-between gap-3">
                <p class="text-[0.7rem] tracking-[0.2em] text-cypress uppercase">Veredito</p>
                <span class="verdict" :aria-label="`Veredito: ${VERDICTS[l.verdict]}`">
                  <i v-for="k in 3" :key="k" :class="{ on: k <= l.verdict + 1 }" />
                  <b>{{ VERDICTS[l.verdict] }}</b>
                </span>
              </div>
              <p class="mt-3 text-[0.92rem] text-ink-muted"><GlossaryText :text="l.known" /></p>
              <NuxtLink
                v-if="l.link"
                :to="l.link.to"
                class="mt-3 inline-flex items-center gap-1 text-sm"
              >
                {{ l.link.label }} <ArrowRight class="size-3.5" aria-hidden="true" />
              </NuxtLink>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ───────────── Legado ───────────── -->
    <section class="container-editorial py-24" aria-labelledby="legado">
      <p class="eyebrow">Seiscentos anos depois</p>
      <h2 id="legado" class="mt-2 text-4xl sm:text-5xl">Hafez hoje</h2>
      <div class="bento mt-12">
        <article v-reveal class="tile tile--big">
          <span class="tile__number">2</span>
          <h3 class="mt-2 font-display text-3xl">livros em cada casa</h3>
          <p class="mt-3 max-w-lg text-ink-muted">
            <GlossaryText
              text="Diz-se no Irã que em toda casa há dois livros: o Alcorão e o Divã de Hafez. Versos dele viram provérbios, letras de música, frases de casamento."
            />
          </p>
        </article>
        <article v-reveal="100" class="tile tile--wine">
          <PersianText as="span" class="text-4xl text-rose">فال</PersianText>
          <h3 class="mt-3 font-display text-2xl !text-ivory">O Fal</h3>
          <p class="mt-2 text-ivory/85">
            <GlossaryText
              text="Abrir o Divã ao acaso com uma pergunta no coração — sobretudo na Noite de Yalda, a mais longa do ano."
            />
          </p>
          <NuxtLink to="/fal-e-hafez" class="mt-4 inline-flex items-center gap-1 !text-rose">
            Fazer o Fal <ArrowRight class="size-4" aria-hidden="true" />
          </NuxtLink>
        </article>
        <article v-reveal="200" class="tile tile--cypress">
          <h3 class="font-display text-2xl !text-ivory">O túmulo-jardim</h3>
          <p class="mt-2 text-ivory/85">
            <GlossaryText
              text="O Hafezieh, em Shiraz: laranjeiras e um pavilhão sobre o túmulo. Gente lendo, recitando, fazendo o Fal o dia inteiro."
            />
          </p>
        </article>
        <article v-reveal="100" class="tile">
          <span class="tile__number text-cypress">1819</span>
          <h3 class="mt-2 font-display text-2xl">Goethe</h3>
          <p class="mt-2 text-ink-muted">
            <GlossaryText
              text="publica o “Divã Ocidental-Oriental”, inspirado em Hafez. Depois vêm Emerson e Nietzsche."
            />
          </p>
        </article>
        <article v-reveal="200" class="tile tile--gold">
          <span class="tile__number">20 de Mehr</span>
          <p class="mt-2 text-ink">por volta de 12 de outubro: o Dia Nacional de Hafez no Irã.</p>
        </article>
        <article v-reveal="100" class="tile tile--music">
          <span class="tile__number">♪</span>
          <h3 class="mt-2 font-display text-2xl">Na música</h3>
          <p class="mt-2 text-ink-muted">
            <GlossaryText
              text="Os gazéis nasceram para ser cantados. Grandes vozes da música tradicional persa, como Shajarian, gravaram Hafez — e a banda de rock O-Hum, de Teerã, faz canções só com versos dele."
            />
          </p>
        </article>
        <article v-reveal="200" class="tile tile--lisbon">
          <span class="tile__number">1540</span>
          <h3 class="mt-2 font-display text-2xl">Um Divã em Lisboa</h3>
          <p class="mt-2 text-ink-muted">
            <GlossaryText
              text="A Fundação Calouste Gulbenkian, em Lisboa, guarda um Divã de Hafez copiado à mão e iluminado (decorado com ouro e cores) por volta de 1540 — um pedaço da tradição persa no mundo lusófono."
            />
          </p>
        </article>
      </div>
    </section>

    <!-- ───────────── Convite ───────────── -->
    <section class="invite" aria-labelledby="leia">
      <GirihPattern class="hero__pattern" />
      <div class="container-reading relative py-24 text-center">
        <h2 id="leia" class="text-4xl !text-ivory sm:text-5xl">O melhor jeito de conhecer Hafez</h2>
        <p class="mx-auto mt-4 max-w-lg text-lg text-ivory/80">
          é ler um poema dele, com calma, entendendo cada imagem.
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NuxtLink to="/diva/gazeis/1" class="btn bg-gold text-ink hover:bg-ivory hover:text-ink">
            Começar pelo primeiro gazel
          </NuxtLink>
          <NuxtLink
            to="/diva"
            class="btn border border-ivory/40 text-ivory hover:bg-ivory/10 hover:text-ivory"
          >
            Ver todos os poemas
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ───────────── Fontes ───────────── -->
    <section class="container-editorial py-16" aria-labelledby="fontes">
      <div class="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 id="fontes" class="text-2xl">De onde vêm estas informações</h2>
          <p class="mt-3 text-sm text-ink-muted">
            Texto do projeto, em versão preliminar. Encontrou um erro?
            <NuxtLink to="/como-traduzimos">Veja como contribuir</NuxtLink>.
          </p>
        </div>
        <ol class="refs">
          <li v-for="([title, detail], i) in references" :key="title">
            <span class="refs__n">{{ i + 1 }}</span>
            <p>
              <span class="font-semibold">{{ title }}</span>
              <span class="text-ink-muted"> — {{ detail }}</span>
            </p>
          </li>
        </ol>
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
    radial-gradient(ellipse at 80% 30%, rgb(112 47 61 / 0.55), transparent 55%),
    radial-gradient(ellipse at 10% 100%, rgb(181 149 88 / 0.18), transparent 50%), #12241f;
}
.hero__pattern {
  position: absolute;
  inset: 0;
  color: rgb(181 149 88 / 0.09);
}
.hero__watermark {
  position: absolute;
  right: -4vw;
  bottom: -14vw;
  font-size: clamp(14rem, 38vw, 34rem);
  line-height: 1;
  color: rgb(181 149 88 / 0.07);
  user-select: none;
  pointer-events: none;
}
.hero__title {
  margin-top: 0.75rem;
  font-size: clamp(5rem, 15vw, 10rem);
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: var(--color-ivory);
}
.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  padding-bottom: 0.25rem;
  color: var(--color-gold);
  text-decoration: none;
  border-bottom: 1px solid rgb(181 149 88 / 0.5);
}
.hero__cta:hover {
  color: var(--color-ivory);
  border-color: var(--color-ivory);
}
.hero__arch-wrap {
  position: relative;
  justify-self: center;
  width: min(22rem, 80vw);
  aspect-ratio: 4 / 5;
}
.hero__arch {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--color-gold);
}
.hero__arch-inner {
  position: absolute;
  inset: 22% 12% 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 999px 999px 0 0;
  background: radial-gradient(ellipse at 50% 40%, rgb(112 47 61 / 0.55), transparent 70%);
}
.hero__facts {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding-bottom: 3rem;
}
@media (min-width: 768px) {
  .hero__facts {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.hero__fact {
  padding: 1.25rem 1.25rem 0 0;
  border-top: 1px solid rgb(181 149 88 / 0.35);
}

/* ── Selos ── */
.seals {
  display: grid;
  gap: 2rem;
  align-items: center;
}
@media (min-width: 1024px) {
  .seals {
    grid-template-columns: 1fr 2fr;
  }
}
.seal {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem 0.9rem;
  border-radius: 1rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
  font-size: 0.92rem;
  color: var(--color-ink-muted);
}
.seal > :first-child {
  align-self: flex-start;
}

/* ── Nomes ── */
.names {
  background: var(--color-paper);
  border-block: 1px solid var(--color-line);
}
.name {
  position: relative;
  padding: 2.25rem 1.75rem 2rem;
  background: var(--color-ivory);
  transition: background 0.3s var(--ease-garden);
}
.name:hover {
  background: #fffdf8;
}
.name__index {
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--color-gold);
  font-variant-numeric: lining-nums;
}
.name__fa {
  margin-top: 1rem;
  white-space: nowrap;
  font-size: clamp(1.4rem, 1.9vw, 2rem);
  line-height: 1.6;
  color: var(--color-cypress);
}

/* ── Citação ── */
.quote {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 0% 0%, rgb(201 148 153 / 0.25), transparent 50%),
    var(--color-wine-deep);
}
.quote__pattern {
  position: absolute;
  inset: 0;
  color: rgb(247 241 230 / 0.05);
}
.quote__fa {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  line-height: 2;
  color: var(--color-rose);
}
.quote__pt {
  margin-top: 1.5rem;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  line-height: 1.3;
  font-style: italic;
  color: var(--color-ivory);
}
.quote__note {
  padding: 2rem;
  border-radius: 1.5rem;
  background: rgb(18 36 31 / 0.4);
  border: 1px solid rgb(181 149 88 / 0.3);
}

/* ── Régua ── */
.ruler-scroll {
  overflow-x: auto;
  padding-bottom: 0.5rem;
}
.ruler {
  min-width: 720px;
  padding: 2rem 2.5rem 1rem 2rem;
  border-radius: 1.5rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
}
.ruler__row {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  align-items: stretch;
  min-height: 3.25rem;
}
.ruler__row--world {
  min-height: 7rem;
}
.ruler__label {
  align-self: center;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-cypress);
}
.ruler__track {
  position: relative;
  background: linear-gradient(var(--color-line), var(--color-line)) center / 100% 1px no-repeat;
}
.ruler__bar {
  position: absolute;
  bottom: 1.6rem;
  height: 0.8rem;
  border-radius: 999px;
}
.ruler__bar em {
  position: absolute;
  bottom: calc(100% + 0.3rem);
  left: 0;
  font-style: normal;
  font-size: 0.78rem;
  white-space: nowrap;
}
.ruler__life {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 1.9rem;
  display: flex;
  align-items: center;
  padding-inline: 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  white-space: nowrap;
  overflow: hidden;
}
.ruler__bar--inju {
  background: var(--color-gold);
  color: #6b4f1a;
}
.ruler__bar--mozaffar {
  background: var(--color-cypress);
  color: var(--color-cypress);
}
.ruler__row--shiraz {
  min-height: 5.25rem;
}
.ruler__row--shiraz .ruler__track {
  background-position: 0 calc(100% - 2rem);
}
.ruler__bar--inju em {
  bottom: auto;
  top: calc(100% + 0.3rem);
}
.ruler__life {
  background: linear-gradient(90deg, rgb(112 47 61 / 0.12), var(--color-wine) 18%);
  color: var(--color-ivory);
  justify-content: flex-end;
  font-family: var(--font-display);
  font-size: 1rem;
}
.ruler__pin {
  position: absolute;
  top: 0.2rem;
  bottom: 0.4rem;
  padding-left: 0.35rem;
  font-size: 0.78rem;
  color: var(--color-wine);
  border-left: 2px solid var(--color-wine);
}
.ruler__mark {
  position: absolute;
  bottom: 50%;
  padding: 0 0 0.45rem 0.45rem;
  font-size: 0.75rem;
  line-height: 1.25;
  white-space: nowrap;
  color: var(--color-ink-muted);
  border-left: 1px solid var(--color-gold);
}
.ruler__mark--low {
  bottom: auto;
  top: 50%;
  padding: 0.45rem 0 0 0.45rem;
}
.ruler__mark--end {
  border-left: 0;
  border-right: 1px solid var(--color-gold);
  padding-left: 0;
  padding-right: 0.45rem;
  translate: -100% 0;
  text-align: right;
}
.ruler__mark b {
  display: block;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-ink);
  font-variant-numeric: lining-nums;
}
.ruler__mark::before {
  content: '';
  position: absolute;
  left: -4px;
  bottom: -4px;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--color-gold);
}
.ruler__mark--low::before {
  bottom: auto;
  top: -4px;
}
.ruler__mark--end::before {
  left: auto;
  right: -4px;
}
.ruler__axis {
  position: relative;
  margin-left: 5.5rem;
  margin-top: 0.75rem;
  height: 1.75rem;
  border-top: 1px solid var(--color-ink-muted);
}
.ruler__axis span {
  position: absolute;
  top: 0.35rem;
  transform: translateX(-50%);
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--color-ink-muted);
  font-variant-numeric: lining-nums;
}
.ruler__axis span:first-child {
  transform: none;
}
.ruler__axis span:last-child {
  transform: translateX(-100%);
}

/* ── Linha do tempo ── */
.chrono__item {
  --era: var(--color-ink-muted);
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem 2.5rem;
  padding: 2rem 0;
  border-top: 1px solid var(--color-line);
}
@media (min-width: 768px) {
  .chrono__item {
    grid-template-columns: 12rem 1fr;
  }
}
.chrono__item--inju {
  --era: #8a6a2c;
}
.chrono__item--mozaffar {
  --era: var(--color-cypress);
}
.chrono__item--timur {
  --era: var(--color-wine);
}
.chrono__year {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  line-height: 1;
  color: var(--era);
  font-variant-numeric: lining-nums;
}
.chrono__body {
  max-width: 40rem;
  padding-left: 1.25rem;
  border-left: 3px solid var(--era);
}

/* ── Anatomia ── */
.anatomy {
  background: var(--color-paper);
  border-block: 1px solid var(--color-line);
}
.rule {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 1rem;
  color: var(--color-ink-muted);
}
.rule strong {
  color: var(--color-ink);
  font-weight: 600;
}
.rule__n {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--color-ivory);
  background: var(--color-wine);
  font-variant-numeric: lining-nums;
}
.diagram {
  padding: 2rem;
  border-radius: 1.5rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
  box-shadow: 0 30px 60px -40px rgb(40 37 34 / 0.45);
}
.diagram__caption {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
.couplet {
  display: grid;
  grid-template-columns: 1.5rem 1fr 1fr;
  gap: 0.9rem;
  align-items: center;
  direction: rtl;
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
}
.couplet--last {
  background: rgb(201 148 153 / 0.16);
}
.couplet__n {
  direction: ltr;
  font-family: var(--font-display);
  color: var(--color-gold);
  font-variant-numeric: lining-nums;
}
.couplet__line {
  position: relative;
  justify-self: start;
  height: 0.5rem;
  border-radius: 999px;
  background: rgb(40 37 34 / 0.14);
}
.couplet__rhyme {
  position: absolute;
  left: 0;
  top: 50%;
  translate: 0 -50%;
  display: inline-block;
  width: 1.4rem;
  height: 0.85rem;
  border-radius: 999px;
  background: var(--color-gold);
}
.couplet__sign {
  position: absolute;
  right: 18%;
  top: 50%;
  translate: 0 -50%;
  padding: 0 0.45rem;
  font-family: var(--font-persian);
  font-style: normal;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-ivory);
  background: var(--color-wine);
  border-radius: 0.4rem;
}
.diagram__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px dashed var(--color-line);
  font-size: 0.85rem;
  color: var(--color-ink-muted);
}
.diagram__legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* ── Duas leituras ── */
.readings {
  overflow: hidden;
  border-radius: 1.5rem;
  border: 1px solid var(--color-line);
}
.readings__head,
.readings__row {
  display: grid;
  grid-template-columns: 1fr;
}
.readings__head {
  display: none;
}
@media (min-width: 768px) {
  .readings__head,
  .readings__row {
    display: grid;
    grid-template-columns: 13rem 1fr 1fr;
  }
}
.readings__col {
  padding: 1.25rem 1.5rem;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  background: var(--color-paper);
}
.readings__col--earth,
.readings__cell--earth {
  background: #fffdf8;
  color: var(--color-wine);
}
.readings__col--sky,
.readings__cell--sky {
  background: var(--color-cypress);
  color: var(--color-ivory);
}
.readings__col--sky {
  color: var(--color-gold);
}
.readings__row {
  border-top: 1px solid var(--color-line);
}
.readings__word {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem;
  font-family: var(--font-display);
  font-size: 1.6rem;
  text-align: left;
  color: var(--color-ink);
  background: var(--color-paper);
  transition: color 0.2s;
}
.readings__word:hover {
  color: var(--color-wine);
}
.readings__cell {
  padding: 1.25rem 1.5rem;
  font-family: var(--font-display);
  font-size: 1.3rem;
  line-height: 1.35;
  font-style: italic;
}
.readings__cell--earth {
  color: var(--color-ink);
}
.readings__mobile {
  display: block;
  margin-bottom: 0.25rem;
  font-family: var(--font-serif);
  font-style: normal;
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.7;
}
@media (min-width: 768px) {
  .readings__mobile {
    display: none;
  }
}

/* ── Lendas ── */
.legends {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background:
    radial-gradient(ellipse at 100% 0%, rgb(201 148 153 / 0.3), transparent 50%), var(--color-wine);
}
.legends__pattern {
  position: absolute;
  inset: 0;
  color: rgb(247 241 230 / 0.06);
}
.legend {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 1.5rem;
  color: var(--color-ink);
  background: var(--color-ivory);
  box-shadow: 0 30px 60px -30px rgb(0 0 0 / 0.45);
}
.legend__numeral {
  font-family: var(--font-display);
  font-size: 3.5rem;
  line-height: 0.8;
  color: var(--color-rose);
}
.legend__known {
  margin-top: auto;
  padding-top: 1.5rem;
}
.legend__known > :first-child {
  padding-top: 1.25rem;
  border-top: 1px dashed var(--color-line);
}
.verdict {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.verdict i {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--color-wine);
}
.verdict i.on {
  background: var(--color-wine);
}
.verdict b {
  margin-left: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-wine);
}

/* ── Legado ── */
.bento {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .bento {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .tile--big {
    grid-column: span 2;
    grid-row: span 2;
  }
  .tile--gold,
  .tile--lisbon {
    grid-column: span 2;
  }
}
.tile {
  padding: 2rem;
  border-radius: 1.5rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
}
.tile--big {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 20rem;
  background:
    radial-gradient(circle at 85% 15%, rgb(181 149 88 / 0.25), transparent 45%), var(--color-paper);
}
.tile__number {
  display: block;
  font-family: var(--font-display);
  font-size: 3rem;
  line-height: 0.9;
  color: var(--color-wine);
  font-variant-numeric: lining-nums;
}
.tile--big .tile__number {
  font-size: clamp(6rem, 14vw, 11rem);
}
.tile--wine {
  background: var(--color-wine);
  border-color: transparent;
}
.tile--cypress {
  background: var(--color-cypress);
  border-color: transparent;
}
.tile--gold {
  background: rgb(181 149 88 / 0.28);
  border-color: transparent;
}
.tile--gold .tile__number {
  font-size: 2.25rem;
  color: var(--color-ink);
}

/* ── Convite ── */
.invite {
  position: relative;
  overflow: hidden;
  color: var(--color-ivory);
  background: radial-gradient(ellipse at 50% 120%, rgb(181 149 88 / 0.3), transparent 60%), #12241f;
}

/* ── Fontes ── */
.refs {
  display: grid;
  gap: 1rem;
  font-size: 0.95rem;
}
.refs li {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0.75rem;
}
.refs__n {
  font-family: var(--font-display);
  font-size: 1.4rem;
  line-height: 1.2;
  color: var(--color-gold);
  font-variant-numeric: lining-nums;
}

/* ── Animações ── */
@keyframes rise {
  from {
    opacity: 0;
    translate: 0 24px;
  }
}
@keyframes fade {
  from {
    opacity: 0;
  }
}
@keyframes draw {
  from {
    stroke-dashoffset: 1;
  }
}
@keyframes drift {
  to {
    translate: calc(-1 * var(--tile)) calc(-1 * var(--tile));
  }
}
@keyframes float {
  50% {
    translate: 0 -14px;
  }
}
@keyframes glow {
  50% {
    opacity: 0.55;
    scale: 1.08;
  }
}
@keyframes pop {
  from {
    scale: 0;
  }
  70% {
    scale: 1.25;
  }
}
@keyframes grow-x {
  from {
    scale: 0 1;
  }
}
@keyframes grow-y {
  from {
    scale: 1 0;
  }
}

/* Abertura: entrada em cascata, arco se desenhando, padrão e marca d'água vivos */
.hero .eyebrow {
  animation: fade 1s var(--ease-garden) both;
}
.hero__title {
  animation: rise 1.1s 0.1s var(--ease-garden) both;
}
.hero__title + p {
  animation: rise 1.1s 0.3s var(--ease-garden) both;
}
.hero__cta {
  animation: rise 1.1s 0.5s var(--ease-garden) both;
}
.hero__cta svg {
  animation: float 2.4s 1.6s ease-in-out infinite;
}
.hero__arch :deep(path) {
  stroke-dasharray: 1;
  animation: draw 2.4s 0.2s var(--ease-garden) both;
}
.hero__arch :deep(circle) {
  animation: pop 0.6s 2.2s var(--ease-garden) both;
  transform-box: fill-box;
  transform-origin: center;
}
.hero__arch-inner {
  isolation: isolate;
  animation: fade 1.6s 1.2s var(--ease-garden) both;
}
.hero__arch-inner::before {
  content: '';
  position: absolute;
  inset: 10% 15% 30%;
  z-index: -1;
  border-radius: 999px;
  background: radial-gradient(circle, rgb(181 149 88 / 0.35), transparent 70%);
  animation: glow 6s ease-in-out infinite;
}
.hero__fact {
  animation: rise 0.9s var(--ease-garden) both;
}
.hero__fact:nth-child(1) {
  animation-delay: 0.7s;
}
.hero__fact:nth-child(2) {
  animation-delay: 0.8s;
}
.hero__fact:nth-child(3) {
  animation-delay: 0.9s;
}
.hero__fact:nth-child(4) {
  animation-delay: 1s;
}
.hero__pattern {
  --tile: 72px;
}
.quote__pattern {
  --tile: 96px;
}
.legends__pattern {
  --tile: 88px;
}
.hero__pattern,
.quote__pattern,
.legends__pattern {
  inset: 0 -96px -96px 0;
  width: calc(100% + 96px);
  height: calc(100% + 96px);
  animation: drift 60s linear infinite;
}
.hero__watermark {
  animation: float 12s ease-in-out infinite;
}

/* Nomes: o persa ganha cor ao passar o mouse */
.name__fa {
  transition:
    color 0.4s,
    translate 0.4s var(--ease-garden);
}
.name:hover .name__fa {
  color: var(--color-wine);
  translate: 0 -3px;
}

/* Régua: as barras crescem quando a régua aparece */
.ruler.reveal-done .ruler__bar,
.ruler.reveal-done .ruler__life {
  transform-origin: left center;
  animation: grow-x 1.2s 0.2s var(--ease-garden) both;
}
.ruler.reveal-done .ruler__bar--mozaffar {
  animation-delay: 0.5s;
}
.ruler.reveal-done .ruler__life {
  animation-delay: 0.35s;
  animation-duration: 1.6s;
}
.ruler.reveal-done .ruler__pin {
  transform-origin: bottom;
  animation: grow-y 0.6s 1.2s var(--ease-garden) both;
}
.ruler.reveal-done .ruler__mark {
  animation: fade 0.6s var(--ease-garden) both;
}
.ruler.reveal-done .ruler__mark:nth-child(1) {
  animation-delay: 0.5s;
}
.ruler.reveal-done .ruler__mark:nth-child(2) {
  animation-delay: 0.7s;
}
.ruler.reveal-done .ruler__mark:nth-child(3) {
  animation-delay: 0.9s;
}
.ruler.reveal-done .ruler__mark:nth-child(4) {
  animation-delay: 1.1s;
}
.ruler.reveal-done .ruler__mark:nth-child(5) {
  animation-delay: 1.3s;
}
.ruler.reveal-done .ruler__mark:nth-child(6) {
  animation-delay: 1.5s;
}

/* Linha do tempo: o fio colorido desce quando o item aparece */
.chrono__body {
  position: relative;
  border-left-color: transparent;
}
.chrono__body::before {
  content: '';
  position: absolute;
  left: -3px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--era);
  transform-origin: top;
}
.chrono__item.reveal-done .chrono__body::before {
  animation: grow-y 0.9s 0.25s var(--ease-garden) both;
}

/* Esquema do gazel: os versos se escrevem e as rimas acendem uma a uma */
.diagram.reveal-done .couplet__line {
  transform-origin: right center;
  animation: grow-x 0.7s var(--ease-garden) both;
}
.diagram.reveal-done .couplet__line .couplet__rhyme {
  animation: pop 0.45s var(--ease-garden) both;
}
.diagram.reveal-done .couplet__sign {
  animation: pop 0.5s 1.9s var(--ease-garden) both;
}
.diagram.reveal-done .couplet:nth-child(1) > * {
  animation-delay: 0.1s;
}
.diagram.reveal-done .couplet:nth-child(2) > * {
  animation-delay: 0.3s;
}
.diagram.reveal-done .couplet:nth-child(3) > * {
  animation-delay: 0.5s;
}
.diagram.reveal-done .couplet:nth-child(4) > * {
  animation-delay: 0.7s;
}
.diagram.reveal-done .couplet:nth-child(5) > * {
  animation-delay: 0.9s;
}
.diagram.reveal-done .couplet:nth-child(6) > * {
  animation-delay: 1.1s;
}
.diagram.reveal-done .couplet:nth-child(1) .couplet__rhyme {
  animation-delay: 0.7s;
}
.diagram.reveal-done .couplet:nth-child(2) .couplet__rhyme {
  animation-delay: 0.9s;
}
.diagram.reveal-done .couplet:nth-child(3) .couplet__rhyme {
  animation-delay: 1.1s;
}
.diagram.reveal-done .couplet:nth-child(4) .couplet__rhyme {
  animation-delay: 1.3s;
}
.diagram.reveal-done .couplet:nth-child(5) .couplet__rhyme {
  animation-delay: 1.5s;
}
.diagram.reveal-done .couplet:nth-child(6) .couplet__rhyme {
  animation-delay: 1.7s;
}

/* Duas leituras: a linha inteira reage ao passar o mouse */
.readings__row > * {
  transition:
    background 0.3s,
    padding 0.3s var(--ease-garden);
}
.readings__row:hover .readings__word {
  padding-left: 2rem;
  color: var(--color-wine);
}
.readings__row:hover .readings__cell--earth {
  background: #fff;
}
.readings__row:hover .readings__cell--sky {
  background: #1d3d35;
}

/* Lendas e blocos: leve elevação */
.legend,
.tile {
  transition:
    opacity 0.9s var(--ease-garden),
    translate 0.9s var(--ease-garden),
    transform 0.35s var(--ease-garden),
    box-shadow 0.35s var(--ease-garden);
  transition-delay: var(--reveal-delay, 0ms), var(--reveal-delay, 0ms), 0s, 0s;
}
.legend:hover,
.tile:hover {
  transform: translateY(-6px);
}
.tile:hover {
  box-shadow: 0 24px 50px -30px rgb(40 37 34 / 0.5);
}
.legend.reveal-done .verdict i.on {
  animation: pop 0.4s var(--ease-garden) both;
}
.legend.reveal-done .verdict i:nth-child(1) {
  animation-delay: 0.6s;
}
.legend.reveal-done .verdict i:nth-child(2) {
  animation-delay: 0.75s;
}
.legend.reveal-done .verdict i:nth-child(3) {
  animation-delay: 0.9s;
}
.tile--big .tile__number {
  transition: scale 0.6s var(--ease-garden);
  transform-origin: left bottom;
}
.tile--big:hover .tile__number {
  scale: 1.06;
}

/* ── Abertura mais viva ── */
.hero {
  --mx: 0;
  --my: 0;
}
.hero__title {
  animation: none;
}
.hero__letter {
  display: inline-block;
  background: linear-gradient(100deg, var(--color-ivory) 40%, #e9cf94 50%, var(--color-ivory) 60%);
  background-size: 300% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation:
    letter-in 1s var(--ease-garden) both,
    shimmer 7s 2s ease-in-out infinite;
}
@keyframes letter-in {
  from {
    opacity: 0;
    translate: 0 0.4em;
    filter: blur(8px);
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
.hero__sparks {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.spark {
  position: absolute;
  bottom: -2rem;
  opacity: 0;
  animation-name: spark-rise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.spark--petal {
  border-radius: 0 100% 0 100%;
  background: rgb(201 148 153 / 0.7);
}
.spark--star {
  background: #e9cf94;
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
}
@keyframes spark-rise {
  10% {
    opacity: 0.8;
  }
  50% {
    translate: 2rem -45vh;
    rotate: 180deg;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 0;
    translate: -1rem -90vh;
    rotate: 360deg;
  }
}
.hero__parallax-far {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform: translate(calc(var(--mx) * -22px), calc(var(--my) * -14px));
  transition: transform 0.6s var(--ease-garden);
}
.hero__arch-wrap {
  transform: translate(calc(var(--mx) * 14px), calc(var(--my) * 10px));
  transition: transform 0.6s var(--ease-garden);
}
.hero__rosette {
  position: absolute;
  inset: 8% -18% auto;
  width: 136%;
  color: rgb(181 149 88 / 0.22);
  animation:
    fade 2s 0.8s both,
    spin 90s linear infinite;
}
@keyframes spin {
  to {
    rotate: 360deg;
  }
}

.tile--music {
  background: radial-gradient(circle at 90% 10%, rgb(201 148 153 / 0.25), transparent 50%), #fffdf8;
}
.tile--lisbon {
  background: radial-gradient(circle at 10% 90%, rgb(36 72 63 / 0.12), transparent 50%), #fffdf8;
}
</style>
