<script setup lang="ts">
import { ArrowUp } from '@lucide/vue'

const groups = [
  {
    title: 'Explorar',
    links: [
      { to: '/diva', label: 'O Divã' },
      { to: '/fal-e-hafez', label: 'Fal-e Hafez' },
      { to: '/o-poeta', label: 'O Poeta' },
      { to: '/arte-persa', label: 'Arte Persa' },
    ],
  },
  {
    title: 'Aprender',
    links: [
      { to: '/glossario', label: 'Glossário' },
      { to: '/como-traduzimos', label: 'Como traduzimos' },
    ],
  },
  {
    title: 'Projeto',
    links: [
      { to: '/sobre', label: 'Sobre o Jardim' },
      { to: '/creditos', label: 'Créditos e fontes' },
    ],
  },
]

const tileId = useId()

function toTop() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}
</script>

<template>
  <footer class="footer">
    <!-- Faixa de azulejo: estrelas de oito pontas e cruzes, como nos frisos das mesquitas -->
    <div class="band" aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern :id="tileId" width="48" height="48" patternUnits="userSpaceOnUse">
            <rect width="48" height="48" fill="#1f3d5a" />
            <!-- cruzes marfim entre as estrelas -->
            <path
              d="M0 18 L6 24 L0 30 Z M48 18 L42 24 L48 30 Z M18 0 L24 6 L30 0 Z M18 48 L24 42 L30 48 Z"
              fill="#f3ead6"
            />
            <!-- estrela de oito pontas -->
            <g transform="translate(24 24)">
              <rect x="-11" y="-11" width="22" height="22" fill="#d9b97a" />
              <rect x="-11" y="-11" width="22" height="22" fill="#d9b97a" transform="rotate(45)" />
              <rect x="-7" y="-7" width="14" height="14" fill="#702f3d" transform="rotate(22.5)" />
              <circle r="3" fill="#f3ead6" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#${tileId})`" />
      </svg>
    </div>

    <div class="container-editorial">
      <div class="footer__main">
        <div>
          <NuxtLink to="/" class="footer__brand">
            <svg viewBox="0 0 24 24" class="footer__star" aria-hidden="true">
              <rect x="5" y="5" width="14" height="14" />
              <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
              <circle cx="12" cy="12" r="2.2" />
            </svg>
            <span class="font-display text-[1.9rem] leading-none text-wine">Jardim de Hafez</span>
          </NuxtLink>
          <p lang="fa" class="mt-2 text-xl text-cypress">باغ حافظ</p>
          <p class="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-ink-muted">
            Poesia de Hafez de Shiraz em persa e português, explicada verso a verso para quem está
            começando.
          </p>
        </div>

        <nav v-for="g in groups" :key="g.title" :aria-label="g.title">
          <p class="footer__label">{{ g.title }}</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="l in g.links" :key="l.to">
              <NuxtLink :to="l.to" class="footer__link">{{ l.label }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="footer__bottom">
        <p>
          Poemas de Hafez em domínio público · traduções preliminares feitas por IA, abertas a
          correções (<NuxtLink to="/como-traduzimos">saiba como</NuxtLink>) · imagens do Met Open
          Access (CC0).
        </p>
        <button type="button" class="footer__top" @click="toTop">
          Voltar ao topo <ArrowUp class="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 6rem;
  background: var(--color-ivory);
}
.band {
  height: 3rem;
  border-block: 3px solid var(--color-gold);
  box-shadow:
    0 -6px 0 -3px var(--color-ivory),
    0 -7px 0 -3px rgb(181 149 88 / 0.6);
}
.band svg {
  display: block;
}
.footer__main {
  display: grid;
  gap: 2.5rem 2rem;
  padding: 3.5rem 0 3rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.footer__main > :first-child {
  grid-column: 1 / -1;
}
@media (min-width: 900px) {
  .footer__main {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
  .footer__main > :first-child {
    grid-column: auto;
  }
}
.footer__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
}
.footer__star {
  width: 1.6rem;
  height: 1.6rem;
  fill: none;
  stroke: var(--color-gold);
  stroke-width: 1.4;
  transition: rotate 0.9s var(--ease-garden);
}
.footer__star circle {
  fill: var(--color-wine);
  stroke: none;
}
.footer__brand:hover .footer__star {
  rotate: 90deg;
}
.footer__label {
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-cypress);
}
.footer__link {
  position: relative;
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--color-ink);
  text-decoration: none;
  transition: color 0.2s;
}
.footer__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1px;
  background: var(--color-gold);
  scale: 0 1;
  transform-origin: left;
  transition: scale 0.35s var(--ease-garden);
}
.footer__link:hover {
  color: var(--color-wine);
}
.footer__link:hover::after {
  scale: 1 1;
}
.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 0 2rem;
  border-top: 1px solid var(--color-line);
  font-size: 0.8rem;
  color: var(--color-ink-muted);
}
.footer__bottom p {
  max-width: 44rem;
}
.footer__top {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  color: var(--color-wine);
  border: 1px solid rgb(112 47 61 / 0.3);
  transition:
    background 0.2s,
    color 0.2s;
}
.footer__top:hover {
  color: var(--color-ivory);
  background: var(--color-wine);
}
</style>
