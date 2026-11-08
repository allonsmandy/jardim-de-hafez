<script setup lang="ts">
import { Menu, X } from '@lucide/vue'

const open = ref(false)
const route = useRoute()
watch(
  () => route.fullPath,
  () => (open.value = false),
)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}
</script>

<template>
  <div @keydown="onKeydown">
    <button
      type="button"
      class="btn-quiet -mr-2"
      :aria-expanded="open"
      aria-controls="menu-movel"
      @click="open = !open"
    >
      <Transition name="icon" mode="out-in">
        <component :is="open ? X : Menu" :key="String(open)" class="size-5" aria-hidden="true" />
      </Transition>
      <span class="text-sm">{{ open ? 'Fechar' : 'Menu' }}</span>
    </button>
    <Transition
      enter-active-class="transition duration-200 ease-[var(--ease-garden)]"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <nav
        v-show="open"
        id="menu-movel"
        aria-label="Navegação principal"
        class="absolute inset-x-0 top-16 z-40 border-b border-line bg-ivory shadow-[0_12px_24px_-16px_rgb(40_37_34/0.25)] sm:top-20"
      >
        <ul class="container-editorial flex flex-col py-3">
          <li
            v-for="(item, i) in MAIN_NAVIGATION"
            :key="item.to"
            class="menu-item"
            :style="{ animationDelay: `${i * 0.05}s` }"
          >
            <NuxtLink
              :to="item.to"
              class="block border-b border-line/60 py-3.5 font-display text-xl text-ink no-underline last:border-0"
              exact-active-class="!text-wine"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </div>
</template>

<style scoped>
.menu-item {
  animation: menu-in 0.4s var(--ease-garden) both;
}
.icon-enter-active,
.icon-leave-active {
  transition:
    rotate 0.2s var(--ease-garden),
    opacity 0.2s;
}
.icon-enter-from {
  rotate: -90deg;
  opacity: 0;
}
.icon-leave-to {
  rotate: 90deg;
  opacity: 0;
}

@keyframes menu-in {
  from {
    opacity: 0;
    translate: -8px 0;
  }
}
</style>
