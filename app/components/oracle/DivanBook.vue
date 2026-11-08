<script setup lang="ts">
/**
 * O Divã como objeto: capa de couro com molduras douradas e medalhão.
 * `opening` dispara a animação de abertura — da direita para a esquerda, como
 * os livros persas — com páginas folheando e luz saindo de dentro.
 */
withDefaults(defineProps<{ opening?: boolean }>(), { opening: false })
</script>

<template>
  <div class="divan" :class="{ 'divan--opening': opening }" aria-hidden="true">
    <div class="divan__glow" />
    <div class="divan__block">
      <span class="divan__pages" />
      <span v-for="n in 4" :key="n" class="divan__leaf" :style="{ '--n': n }" />
      <div class="divan__cover">
        <div class="divan__frame">
          <svg viewBox="0 0 100 100" class="divan__medallion">
            <rect x="20" y="20" width="60" height="60" />
            <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" />
            <circle cx="50" cy="50" r="13" />
            <circle cx="50" cy="50" r="44" stroke-dasharray="2 3" />
          </svg>
          <span lang="fa" class="divan__title">دیوان حافظ</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.divan {
  position: relative;
  width: min(15rem, 62vw);
  aspect-ratio: 3 / 4;
  perspective: 1400px;
}
.divan__glow {
  position: absolute;
  inset: -35%;
  border-radius: 999px;
  background: radial-gradient(closest-side, rgb(241 220 168 / 0.35), transparent);
  animation: glow 5s ease-in-out infinite;
}
.divan__block {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateX(8deg) rotateY(-14deg);
  transition: transform 0.8s var(--ease-garden);
  animation: hover-book 6s ease-in-out infinite;
}
/* Miolo: páginas de papel visíveis quando a capa abre */
.divan__pages {
  position: absolute;
  inset: 3% 3% 3% 0;
  border-radius: 2px 6px 6px 2px;
  background:
    repeating-linear-gradient(90deg, rgb(181 149 88 / 0.15) 0 1px, transparent 1px 3px) right / 6px
      100% no-repeat,
    linear-gradient(90deg, #efe2c4, #fffaf0 30%, #fffaf0);
  box-shadow: inset 0 0 30px rgb(181 149 88 / 0.35);
}
.divan__leaf {
  position: absolute;
  inset: 3% 3% 3% 0;
  border-radius: 2px 6px 6px 2px;
  background: linear-gradient(90deg, #f6ead0, #fffaf0);
  transform-origin: right center;
  opacity: 0;
}
/* Capa: couro vinho, borda dourada dupla, medalhão */
.divan__cover {
  position: absolute;
  inset: 0;
  border-radius: 4px 10px 10px 4px;
  transform-origin: right center;
  background:
    radial-gradient(ellipse at 30% 20%, rgb(255 255 255 / 0.12), transparent 50%),
    linear-gradient(135deg, #7d3442, #4a1c26);
  box-shadow:
    inset 0 0 0 1px rgb(0 0 0 / 0.3),
    inset -10px 0 18px rgb(0 0 0 / 0.25),
    0 40px 60px -20px rgb(0 0 0 / 0.6);
  transform-style: preserve-3d;
  transition: transform 1.6s cubic-bezier(0.6, 0.05, 0.25, 1);
}
.divan__frame {
  backface-visibility: hidden;
}
/* Verso da capa: guarda marmorizada, visível quando o livro abre */
.divan__cover::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px 4px 4px 10px;
  transform: rotateY(180deg) translateZ(1px);
  backface-visibility: hidden;
  background:
    radial-gradient(circle at 20% 30%, rgb(217 185 122 / 0.35), transparent 25%),
    radial-gradient(circle at 70% 60%, rgb(36 72 63 / 0.55), transparent 30%),
    radial-gradient(circle at 40% 85%, rgb(201 148 153 / 0.35), transparent 25%),
    radial-gradient(circle at 85% 15%, rgb(36 72 63 / 0.45), transparent 25%), #5a2330;
  box-shadow:
    inset 0 0 0 6px #5a2330,
    inset 0 0 0 7px rgb(217 185 122 / 0.6);
}
.divan__frame {
  position: absolute;
  inset: 9%;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 1rem;
  border: 1.5px solid rgb(217 185 122 / 0.85);
  outline: 1px solid rgb(217 185 122 / 0.45);
  outline-offset: 5px;
  border-radius: 3px;
}
.divan__medallion {
  width: 52%;
  fill: none;
  stroke: #d9b97a;
  stroke-width: 1.4;
  animation: spin 50s linear infinite;
}
.divan__medallion circle:first-of-type {
  fill: rgb(217 185 122 / 0.2);
}
.divan__title {
  font-family: var(--font-persian);
  font-size: clamp(1.1rem, 4vw, 1.5rem);
  color: #e9cf94;
  text-shadow: 0 1px 0 rgb(0 0 0 / 0.4);
}

/* Abertura */
.divan--opening .divan__block {
  animation: none;
  transform: rotateX(4deg) rotateY(0deg) scale(1.05);
}
.divan--opening .divan__cover {
  transform: rotateY(165deg);
}
.divan--opening .divan__leaf {
  animation: leaf 1.1s cubic-bezier(0.5, 0.1, 0.3, 1) both;
  animation-delay: calc(0.7s + var(--n) * 0.18s);
}
.divan--opening .divan__glow {
  animation: burst 2.2s 0.6s ease-out both;
}

@keyframes leaf {
  0% {
    opacity: 1;
    transform: rotateY(0);
  }
  100% {
    opacity: 1;
    transform: rotateY(160deg);
  }
}
@keyframes glow {
  50% {
    opacity: 0.6;
    scale: 1.08;
  }
}
@keyframes burst {
  0% {
    opacity: 0.6;
  }
  60% {
    opacity: 1;
    scale: 1.6;
  }
  100% {
    opacity: 0.8;
    scale: 1.4;
  }
}
@keyframes hover-book {
  50% {
    translate: 0 -8px;
  }
}
@keyframes spin {
  to {
    rotate: 360deg;
  }
}
</style>
