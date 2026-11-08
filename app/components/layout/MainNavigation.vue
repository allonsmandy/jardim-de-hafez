<template>
  <nav aria-label="Navegação principal">
    <ul class="flex items-center gap-1">
      <li
        v-for="(item, i) in MAIN_NAVIGATION"
        :key="item.to"
        class="nav-item"
        :style="{ animationDelay: `${0.25 + i * 0.07}s` }"
      >
        <NuxtLink
          :to="item.to"
          class="nav-link relative rounded-full px-3.5 py-2 text-[0.95rem] text-ink no-underline transition-colors hover:text-wine"
          active-class="text-wine"
          exact-active-class="nav-current"
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-item {
  animation: nav-in 0.7s var(--ease-garden) both;
}
.router-link-active:not([href='/']),
.nav-current {
  color: var(--color-wine);
}
/* Sublinhado dourado que cresce do centro; fica fixo na página atual. */
.nav-link::after {
  content: '';
  position: absolute;
  inset-inline: 0.875rem;
  bottom: 0.25rem;
  height: 1px;
  background: var(--color-gold);
  scale: 0 1;
  transition: scale 0.35s var(--ease-garden);
}
.nav-link:hover::after,
.router-link-active:not([href='/'])::after,
.nav-current::after {
  scale: 1 1;
}

@keyframes nav-in {
  from {
    opacity: 0;
    translate: 0 -8px;
  }
}
</style>
