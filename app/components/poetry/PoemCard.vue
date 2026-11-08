<script setup lang="ts">
import { ArrowRight, Sparkles } from '@lucide/vue'
import type { PoemSummary } from '#shared/schemas/poem'
import { getCategory, poemPath } from '#shared/utils/categories'
import { toPersianDigits } from '#shared/utils/text'

/** Cartão de poema em forma de nicho (arco persa), como uma página de manuscrito. */
const props = defineProps<{ poem: PoemSummary }>()
const category = computed(() => getCategory(props.poem.category))
const preliminary = computed(
  () => props.poem.publicationLevel === 'preliminary' || props.poem.machineAssisted,
)
</script>

<template>
  <NuxtLink :to="poemPath(poem)" class="niche">
    <span class="niche__medal" aria-hidden="true">
      <span lang="fa">{{ toPersianDigits(poem.number) }}</span>
    </span>
    <span class="niche__cat">{{ category.label }} {{ poem.number }}</span>
    <span lang="fa" dir="rtl" class="niche__fa">{{ poem.firstLine.fa }}</span>
    <span class="niche__divider" aria-hidden="true"><i /></span>
    <span class="niche__pt">
      <template v-if="poem.editorialTitle">{{ poem.editorialTitle }}</template>
      <template v-else>{{ poem.firstLine.pt ?? 'Tradução em preparação' }}</template>
    </span>
    <span class="niche__foot">
      <span v-if="preliminary" class="niche__badge">
        <Sparkles class="size-3" aria-hidden="true" /> preliminar
      </span>
      <span class="niche__go">Ler <ArrowRight class="size-3.5" aria-hidden="true" /></span>
    </span>
  </NuxtLink>
</template>

<style scoped>
.niche {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-height: 21rem;
  padding: 3rem 1.5rem 1.4rem;
  border-radius: 999px 999px 1.25rem 1.25rem;
  text-align: center;
  text-decoration: none;
  color: var(--color-ink);
  background: radial-gradient(ellipse at 50% 0%, rgb(181 149 88 / 0.18), transparent 55%), #fffaf0;
  box-shadow:
    inset 0 0 0 6px #fffaf0,
    inset 0 0 0 7px rgb(181 149 88 / 0.45),
    0 25px 45px -35px rgb(40 37 34 / 0.5);
  transition:
    transform 0.45s var(--ease-garden),
    box-shadow 0.45s var(--ease-garden);
}
.niche:hover {
  color: var(--color-ink);
  transform: translateY(-6px);
  box-shadow:
    inset 0 0 0 6px #fffaf0,
    inset 0 0 0 7px rgb(181 149 88 / 0.85),
    0 35px 55px -30px rgb(112 47 61 / 0.45);
}
.niche:focus-visible {
  outline: 2px solid var(--color-cypress);
  outline-offset: 4px;
}
.niche__medal {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
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
  background: var(--color-wine);
  font-family: var(--font-persian);
  font-size: 1.2rem;
  color: #f1dca8;
  transition: rotate 0.8s var(--ease-garden);
}
.niche:hover .niche__medal {
  rotate: 45deg;
}
.niche__cat {
  margin-top: 0.75rem;
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
.niche__fa {
  margin-top: 0.75rem;
  font-family: var(--font-persian);
  font-size: 1.25rem;
  line-height: 1.95;
  color: var(--color-cypress);
}
.niche__divider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.6rem 0;
}
.niche__divider::before,
.niche__divider::after {
  content: '';
  width: 2rem;
  height: 1px;
  background: rgb(181 149 88 / 0.6);
}
.niche__divider i {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--color-gold);
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
}
.niche__pt {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.3rem;
  line-height: 1.3;
}
.niche__foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1.25rem;
}
.niche__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  color: var(--color-wine-deep);
  background: rgb(201 148 153 / 0.22);
}
.niche__go {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-wine);
}
</style>
