<script setup lang="ts">
/**
 * Padrão geométrico de estrelas de oito pontas (girih), como nos azulejos e
 * portais persas. Decorativo; herda a cor de `currentColor`.
 */
withDefaults(defineProps<{ size?: number }>(), { size: 72 })
const id = useId()

function star(cx: number, cy: number, r: number) {
  const inner = r * 0.765
  const pts: string[] = []
  for (let k = 0; k < 16; k++) {
    const radius = k % 2 === 0 ? r : inner
    const a = (Math.PI / 8) * k - Math.PI / 2
    pts.push(`${(cx + radius * Math.cos(a)).toFixed(2)},${(cy + radius * Math.sin(a)).toFixed(2)}`)
  }
  return pts.join(' ')
}
</script>

<template>
  <svg aria-hidden="true" class="pointer-events-none" width="100%" height="100%">
    <defs>
      <pattern :id="`girih-${id}`" :width="size" :height="size" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="currentColor" stroke-width="0.8">
          <polygon :points="star(size / 2, size / 2, size * 0.3)" />
          <polygon :points="star(size / 2, size / 2, size * 0.14)" />
          <polygon :points="star(0, 0, size * 0.3)" />
          <polygon :points="star(size, 0, size * 0.3)" />
          <polygon :points="star(0, size, size * 0.3)" />
          <polygon :points="star(size, size, size * 0.3)" />
          <line :x1="size / 2" y1="0" :x2="size / 2" :y2="size * 0.2" />
          <line :x1="size / 2" :y1="size * 0.8" :x2="size / 2" :y2="size" />
          <line x1="0" :y1="size / 2" :x2="size * 0.2" :y2="size / 2" />
          <line :x1="size * 0.8" :y1="size / 2" :x2="size" :y2="size / 2" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#girih-${id})`" />
  </svg>
</template>
