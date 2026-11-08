<script setup lang="ts">
/**
 * Atmosfera decorativa para fundos escuros: padrão persa deslizando, pétalas e
 * estrelinhas subindo e, opcionalmente, uma rosácea girando. Posições fixas
 * (iguais no servidor e no navegador). Respeita prefers-reduced-motion via CSS global.
 */
const props = withDefaults(defineProps<{ count?: number; pattern?: boolean }>(), {
  count: 16,
  pattern: true,
})
const sparks = computed(() =>
  Array.from({ length: props.count }, (_, i) => ({
    kind: i % 3 === 0 ? 'star' : 'petal',
    left: `${(i * 37 + 11) % 100}%`,
    delay: `${-((i * 7) % 19)}s`,
    duration: `${14 + ((i * 5) % 10)}s`,
    size: `${0.45 + ((i * 3) % 5) * 0.12}rem`,
  })),
)
</script>

<template>
  <div class="ambient" aria-hidden="true">
    <GirihPattern v-if="pattern" class="ambient__pattern" />
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
</template>

<style scoped>
.ambient {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.ambient__pattern {
  position: absolute;
  inset: 0 -72px -72px 0;
  width: calc(100% + 72px);
  height: calc(100% + 72px);
  color: rgb(181 149 88 / 0.08);
  animation: ambient-drift 60s linear infinite;
}
.spark {
  position: absolute;
  bottom: -2rem;
  opacity: 0;
  animation-name: ambient-rise;
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
@keyframes ambient-drift {
  to {
    translate: -72px -72px;
  }
}
@keyframes ambient-rise {
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
</style>
