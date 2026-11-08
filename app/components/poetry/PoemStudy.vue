<script setup lang="ts">
import { Lightbulb, Landmark, Microscope } from '@lucide/vue'
import type { StanzaNote } from '#shared/schemas/poem'
import { toPersianDigits } from '#shared/utils/text'

/**
 * Modo estudo: o gazel como um colar — cada dístico é uma conta presa a um fio
 * dourado, com os versos, a paráfrase simples e o contexto.
 */
const props = defineProps<{
  original?: string[][]
  translation?: string[][]
  notes: StanzaNote[]
  showPersian: boolean
}>()

const stanzas = computed(() => {
  const length = Math.max(props.original?.length ?? 0, props.translation?.length ?? 0)
  return Array.from({ length }, (_, i) => ({
    number: i + 1,
    fa: props.original?.[i],
    pt: props.translation?.[i],
    note: props.notes.find((n) => n.stanza === i + 1),
    last: i === length - 1,
    /** O poeta costuma se nomear no fim; só marcamos quando o nome aparece de fato. */
    signed: (props.original?.[i] ?? [])
      .join(' ')
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .includes('حافظ'),
  }))
})
</script>

<template>
  <ol class="necklace">
    <li
      v-for="s in stanzas"
      :key="s.number"
      v-reveal
      class="bead-item"
      :class="{ 'bead-item--last': s.signed }"
    >
      <div class="bead" aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <rect x="8" y="8" width="24" height="24" />
          <rect x="8" y="8" width="24" height="24" transform="rotate(45 20 20)" />
        </svg>
        <span>{{ s.number }}</span>
      </div>
      <h3 class="sr-only">Dístico {{ s.number }}</h3>

      <article class="card">
        <header class="card__verses">
          <p v-if="showPersian && s.fa" class="card__fa" lang="fa" dir="rtl">
            <span v-for="(line, j) in s.fa" :key="j" class="block">{{ line }}</span>
          </p>
          <span v-if="showPersian && s.fa && s.pt" class="card__divider" aria-hidden="true"
            ><i
          /></span>
          <p v-if="s.pt" class="card__pt" lang="pt-BR">
            <span v-for="(line, j) in s.pt" :key="j" class="block">
              <GlossaryText :text="line" />
            </span>
          </p>
          <span class="card__tag" aria-hidden="true">
            <template v-if="s.number === 1">abertura · as duas metades rimam</template>
            <template v-else-if="s.signed">a assinatura: o poeta diz o próprio nome</template>
            <template v-else
              >dístico <span lang="fa">{{ toPersianDigits(s.number) }}</span></template
            >
          </span>
        </header>

        <div v-if="s.note" class="card__body">
          <section class="plain">
            <h4 class="label">
              <Lightbulb class="size-4" aria-hidden="true" /> Em palavras simples
            </h4>
            <GlossaryText as="p" :text="s.note.plain" class="plain__text" />
          </section>

          <section class="mt-7">
            <h4 class="label">
              <Landmark class="size-4" aria-hidden="true" /> Por trás das palavras
            </h4>
            <GlossaryText
              as="p"
              :text="s.note.meaning"
              class="mt-2 leading-relaxed text-ink-muted"
            />
          </section>

          <details v-if="s.note.literal || s.note.choices" class="deep">
            <summary>
              <Microscope class="size-4" aria-hidden="true" />
              <span>Para se aprofundar: palavra por palavra e escolhas da tradução</span>
            </summary>
            <dl class="deep__body">
              <div v-if="s.note.literal">
                <dt>Palavra por palavra</dt>
                <dd class="italic">{{ s.note.literal }}</dd>
              </div>
              <div v-if="s.note.choices">
                <dt>Por que traduzimos assim</dt>
                <dd><GlossaryText :text="s.note.choices" /></dd>
              </div>
            </dl>
          </details>
        </div>
      </article>
    </li>
  </ol>
</template>

<style scoped>
/* O fio dourado do colar */
.necklace {
  position: relative;
  display: grid;
  gap: 3rem;
  padding-left: 2.25rem;
}
@media (min-width: 768px) {
  .necklace {
    padding-left: 4.5rem;
  }
}
.necklace::before {
  content: '';
  position: absolute;
  left: 0.7rem;
  top: 1.5rem;
  bottom: 1.5rem;
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--color-gold) 4%,
    var(--color-gold) 96%,
    transparent
  );
  opacity: 0.6;
}
@media (min-width: 768px) {
  .necklace::before {
    left: 1.85rem;
  }
}

.bead-item {
  position: relative;
}
.bead {
  position: absolute;
  left: -2.25rem;
  margin-left: -0.4rem;
  top: 1.4rem;
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
}
@media (min-width: 768px) {
  .bead {
    left: -4.5rem;
    margin-left: 0;
    width: 3.75rem;
    height: 3.75rem;
    top: 1.2rem;
  }
}
.bead svg {
  position: absolute;
  inset: 0;
  fill: var(--color-ivory);
  stroke: var(--color-gold);
  stroke-width: 1.4;
  transition:
    fill 0.4s,
    rotate 0.8s var(--ease-garden);
}
.bead span {
  position: relative;
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--color-wine);
  font-variant-numeric: lining-nums;
}
@media (min-width: 768px) {
  .bead span {
    font-size: 1.35rem;
  }
}
.bead-item:hover .bead svg,
.bead-item--last .bead svg {
  fill: var(--color-wine);
  rotate: 45deg;
}
.bead-item:hover .bead span,
.bead-item--last .bead span {
  color: var(--color-ivory);
}
.bead-item.reveal-done .bead {
  animation: bead-pop 0.7s 0.15s var(--ease-garden) both;
}

/* Cartão de cada dístico */
.card {
  overflow: hidden;
  border-radius: 1.5rem;
  background: #fffdf8;
  border: 1px solid var(--color-line);
  box-shadow:
    0 1px 0 rgb(40 37 34 / 0.03),
    0 30px 60px -45px rgb(40 37 34 / 0.45);
  transition:
    box-shadow 0.4s var(--ease-garden),
    transform 0.4s var(--ease-garden);
}
.bead-item:hover .card {
  transform: translateY(-3px);
  box-shadow:
    0 1px 0 rgb(40 37 34 / 0.03),
    0 36px 70px -40px rgb(112 47 61 / 0.4);
}
.card__verses {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 1.1rem;
  padding: 2.5rem 1.5rem 3rem;
  text-align: center;
  background:
    radial-gradient(ellipse at 100% 0%, rgb(181 149 88 / 0.18), transparent 55%),
    radial-gradient(ellipse at 0% 100%, rgb(201 148 153 / 0.14), transparent 55%),
    var(--color-paper);
  border-bottom: 1px solid var(--color-line);
}
@media (min-width: 640px) {
  .card__verses {
    padding: 3rem 3rem 3.25rem;
  }
}
.card__fa {
  font-size: clamp(1.3rem, 2.6vw, 1.7rem);
  line-height: 2.1;
  color: var(--color-cypress);
  text-align: center;
}
.card__pt {
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.4vw, 1.65rem);
  line-height: 1.45;
  color: var(--color-ink);
}
.card__divider {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.card__divider::before,
.card__divider::after {
  content: '';
  width: 3rem;
  height: 1px;
  background: rgb(181 149 88 / 0.6);
}
.card__divider i {
  width: 0.6rem;
  height: 0.6rem;
  background: var(--color-gold);
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
}
.card__tag {
  position: static;
  margin-top: 0.5rem;
}
@media (min-width: 640px) {
  .card__tag {
    position: absolute;
    margin-top: 0;
  }
}
.card__tag {
  bottom: 0.85rem;
  right: 1.5rem;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgb(112 47 61 / 0.55);
}
.card__tag [lang='fa'] {
  letter-spacing: 0;
  font-size: 0.9rem;
}
.card__body {
  padding: 1.75rem 1.5rem 2rem;
}
@media (min-width: 640px) {
  .card__body {
    padding: 2rem 2.5rem 2.25rem;
  }
}

/* Em palavras simples: destaque com aspas grandes */
.plain {
  position: relative;
  padding: 1.25rem 1.4rem 1.35rem 1.4rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, rgb(201 148 153 / 0.2), rgb(201 148 153 / 0.06));
}
.plain::before {
  content: '“';
  position: absolute;
  right: 1rem;
  top: -0.6rem;
  font-family: var(--font-display);
  font-size: 5rem;
  line-height: 1;
  color: rgb(112 47 61 / 0.18);
}
.plain__text {
  margin-top: 0.5rem;
  font-size: 1.12rem;
  line-height: 1.65;
  color: var(--color-ink);
}
.label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-serif);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-cypress);
}

/* Aprofundamento */
.deep {
  margin-top: 1.75rem;
  border-radius: 0.9rem;
  border: 1px solid var(--color-line);
  background: var(--color-ivory);
}
.deep summary {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.1rem;
  cursor: pointer;
  list-style: none;
  font-size: 0.92rem;
  color: var(--color-cypress);
}
.deep summary::-webkit-details-marker {
  display: none;
}
.deep summary::after {
  content: '+';
  margin-left: auto;
  font-family: var(--font-display);
  font-size: 1.4rem;
  line-height: 1;
  transition: rotate 0.3s var(--ease-garden);
}
.deep[open] summary::after {
  rotate: 45deg;
}
.deep__body {
  display: grid;
  gap: 1rem;
  padding: 0 1.1rem 1.1rem;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--color-ink-muted);
}
.deep__body dt {
  font-weight: 600;
  color: var(--color-ink);
}
.deep__body dd {
  margin-top: 0.25rem;
}
.deep[open] .deep__body {
  animation: open-deep 0.4s var(--ease-garden);
}

@keyframes bead-pop {
  from {
    scale: 0.3;
    rotate: -90deg;
    opacity: 0;
  }
}
@keyframes open-deep {
  from {
    opacity: 0;
    translate: 0 -6px;
  }
}
</style>
