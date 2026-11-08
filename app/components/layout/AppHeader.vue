<template>
  <header
    class="header border-b border-line/80 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/85"
  >
    <div class="header__bg" aria-hidden="true">
      <span class="header__glow header__glow--rose" />
      <span class="header__glow header__glow--gold" />
      <GirihPattern class="header__pattern" :size="56" />
      <span class="header__sheen" />
    </div>
    <div
      class="relative z-10 container-editorial flex h-16 items-center justify-between gap-6 sm:h-20"
    >
      <NuxtLink
        to="/"
        class="brand group flex items-center gap-2.5 no-underline"
        aria-label="Jardim de Hafez — página inicial"
      >
        <svg class="brand__star" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" />
          <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
          <circle cx="12" cy="12" r="2.2" />
        </svg>
        <span class="flex items-baseline gap-3">
          <span
            class="brand__name font-display text-2xl font-semibold tracking-tight text-wine sm:text-[1.7rem]"
            >Jardim de Hafez</span
          >
          <span lang="fa" dir="rtl" class="brand__fa hidden text-base text-cypress/80 sm:inline"
            >باغ حافظ</span
          >
        </span>
      </NuxtLink>
      <MainNavigation class="hidden lg:block" />
      <MobileNavigation class="lg:hidden" />
    </div>
  </header>
</template>

<style scoped>
.header {
  position: relative;
  z-index: 30; /* acima do conteúdo, para o menu do celular abrir por cima da página */
}
/* Fundo vivo: padrão persa deslizando, brilhos que passeiam e um reflexo dourado ocasional. */
.header__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.header__pattern {
  --tile: 56px;
  position: absolute;
  inset: 0 -56px -56px 0;
  width: calc(100% + 56px);
  height: calc(100% + 56px);
  color: rgb(181 149 88 / 0.22);
  mask-image: linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent);
  animation: header-drift 40s linear infinite;
}
.header__glow {
  position: absolute;
  top: -150%;
  width: 40rem;
  height: 400%;
  border-radius: 999px;
  filter: blur(30px);
}
.header__glow--rose {
  left: -10rem;
  background: radial-gradient(closest-side, rgb(201 148 153 / 0.4), transparent);
  animation: glow-a 18s ease-in-out infinite alternate;
}
.header__glow--gold {
  right: -10rem;
  background: radial-gradient(closest-side, rgb(181 149 88 / 0.35), transparent);
  animation: glow-b 22s ease-in-out infinite alternate;
}
.header__sheen {
  position: absolute;
  inset: 0;
  width: 30%;
  background: linear-gradient(
    100deg,
    transparent,
    rgb(255 253 248 / 0.7) 45%,
    rgb(181 149 88 / 0.18) 50%,
    transparent
  );
  translate: -120% 0;
  animation: sheen 9s 2s var(--ease-garden) infinite;
}

@keyframes header-drift {
  to {
    translate: calc(-1 * var(--tile)) calc(-1 * var(--tile));
  }
}
@keyframes glow-a {
  to {
    translate: 55vw 0;
  }
}
@keyframes glow-b {
  to {
    translate: -55vw 0;
  }
}
@keyframes sheen {
  0% {
    translate: -120% 0;
  }
  35%,
  100% {
    translate: 420% 0;
  }
}
/* Fio dourado que se desenha do centro na primeira carga. */
.header::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold) 50%, transparent);
  transform-origin: center;
  animation: header-line 1.6s 0.3s var(--ease-garden) both;
}

.brand__star {
  width: 1.35rem;
  height: 1.35rem;
  flex: none;
  fill: none;
  stroke: var(--color-gold);
  stroke-width: 1.4;
  animation: star-in 1.2s var(--ease-garden) both;
  transition:
    rotate 0.9s var(--ease-garden),
    stroke 0.3s;
}
.brand__star circle {
  fill: var(--color-wine);
  stroke: none;
}
.brand:hover .brand__star {
  rotate: 90deg;
  stroke: var(--color-wine);
}
.brand__name {
  animation: slide-in 0.9s 0.1s var(--ease-garden) both;
}
.brand__fa {
  animation: fade-in 1s 0.5s var(--ease-garden) both;
  transition: color 0.3s;
}
.brand:hover .brand__fa {
  color: var(--color-wine);
}

@keyframes header-line {
  from {
    scale: 0 1;
    opacity: 0;
  }
  to {
    opacity: 0.7;
  }
}
@keyframes star-in {
  from {
    opacity: 0;
    rotate: -135deg;
    scale: 0.4;
  }
}
@keyframes slide-in {
  from {
    opacity: 0;
    translate: -10px 0;
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
}
</style>
