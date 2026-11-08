<script setup lang="ts">
defineProps<{ disabled?: boolean; opening?: boolean }>()
const emit = defineEmits<{ open: [] }>()

const steps = [
  { n: '۱', title: 'Silencie', text: 'Respire fundo algumas vezes, no ritmo do halo.' },
  {
    n: '۲',
    title: 'Pense numa pergunta',
    text: 'Algo que ocupa seu coração. Não precisa escrever.',
  },
  { n: '۳', title: 'Abra o Divã', text: 'Toque no livro. O poema que aparecer é a sua leitura.' },
]
</script>

<template>
  <div class="intro" :class="{ 'intro--opening': opening }">
    <p v-if="opening" class="sr-only" role="status" aria-live="polite">Abrindo o Divã…</p>
    <button
      type="button"
      class="intro__book"
      :disabled="disabled || opening"
      aria-label="Abrir o Divã de Hafez"
      @click="emit('open')"
    >
      <span class="halo" aria-hidden="true" />
      <DivanBook :opening="opening" />
      <span v-if="opening" class="breath breath--opening" aria-hidden="true">
        <span>abrindo o Divã…</span>
      </span>
      <span v-else class="breath" aria-hidden="true">
        <span>inspire…</span>
        <span>expire…</span>
      </span>
    </button>

    <ol class="steps">
      <li v-for="(s, i) in steps" :key="s.title" :style="{ animationDelay: `${0.4 + i * 0.15}s` }">
        <span lang="fa" class="steps__n">{{ s.n }}</span>
        <div>
          <p class="font-display text-xl text-ivory">{{ s.title }}</p>
          <p class="mt-1 text-sm text-ivory/65">{{ s.text }}</p>
        </div>
      </li>
    </ol>

    <button type="button" class="intro__cta" :disabled="disabled" @click="emit('open')">
      Abrir o Divã
    </button>
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  justify-items: center;
  gap: 3rem;
}
.intro__book {
  position: relative;
  display: grid;
  place-items: center;
  padding: 3.5rem 4rem 4.5rem;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.5s var(--ease-garden);
}
.intro__book:hover {
  transform: scale(1.03);
}
.intro__book:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 4px;
}
/* Halo que guia a respiração: 4s para inspirar, 4s para expirar */
.halo {
  position: absolute;
  inset: 8% 10%;
  border-radius: 999px;
  border: 1px solid rgb(217 185 122 / 0.45);
  box-shadow:
    0 0 60px rgb(217 185 122 / 0.15),
    inset 0 0 60px rgb(217 185 122 / 0.1);
  animation: breathe 8s ease-in-out infinite;
}
.breath {
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  translate: -50% 0;
  height: 1.5rem;
  width: 8rem;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.1rem;
  color: rgb(241 220 168 / 0.8);
}
.breath span {
  position: absolute;
  inset: 0;
  text-align: center;
  animation: breath-word 8s ease-in-out infinite;
}
.breath span:last-child {
  animation-delay: -4s;
}
.steps {
  display: grid;
  gap: 1rem;
  width: 100%;
  max-width: 56rem;
}
@media (min-width: 768px) {
  .steps {
    grid-template-columns: repeat(3, 1fr);
  }
}
.steps li {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 1.4rem;
  border-radius: 1.25rem;
  background: rgb(247 241 230 / 0.05);
  border: 1px solid rgb(217 185 122 / 0.22);
  backdrop-filter: blur(4px);
  animation: rise 0.9s var(--ease-garden) both;
}
.steps__n {
  display: grid;
  place-items: center;
  flex: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  font-family: var(--font-persian);
  font-size: 1.2rem;
  color: var(--color-ink);
  background: #d9b97a;
}
.intro__cta {
  padding: 0.95rem 2.75rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 1.35rem;
  color: var(--color-ink);
  background: linear-gradient(135deg, #f1dca8, #c9a35f);
  box-shadow:
    0 0 0 6px rgb(217 185 122 / 0.15),
    0 20px 40px -15px rgb(217 185 122 / 0.6);
  transition:
    transform 0.3s var(--ease-garden),
    box-shadow 0.3s;
}
.intro__cta:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 0 10px rgb(217 185 122 / 0.12),
    0 26px 50px -15px rgb(217 185 122 / 0.7);
}
.intro__cta:focus-visible {
  outline: 2px solid var(--color-ivory);
  outline-offset: 4px;
}

.intro--opening .steps,
.intro--opening .intro__cta {
  opacity: 0;
  translate: 0 12px;
  pointer-events: none;
  transition:
    opacity 0.5s,
    translate 0.5s;
}
.intro--opening .halo {
  animation: none;
  scale: 1.25;
  opacity: 0;
  transition:
    scale 1.2s var(--ease-garden),
    opacity 1.2s;
}
.intro__book:disabled {
  cursor: default;
}
.breath--opening {
  width: 12rem;
}
.breath--opening span {
  animation: opening-pulse 1.4s ease-in-out infinite;
}
@keyframes opening-pulse {
  50% {
    opacity: 0.35;
  }
}
@keyframes breathe {
  0%,
  100% {
    scale: 0.92;
    opacity: 0.5;
  }
  50% {
    scale: 1.08;
    opacity: 1;
  }
}
@keyframes breath-word {
  0%,
  40% {
    opacity: 1;
  }
  45%,
  95% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes rise {
  from {
    opacity: 0;
    translate: 0 16px;
  }
}
</style>
