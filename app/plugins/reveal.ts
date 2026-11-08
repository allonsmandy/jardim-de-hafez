import type { Directive } from 'vue'

/**
 * `v-reveal` — o elemento surge suavemente quando entra na tela.
 *
 * - Só esconde o que ainda está ABAIXO da área visível no momento da montagem,
 *   então nada "pisca" no carregamento e o HTML pré-renderizado continua legível.
 * - Valor opcional: atraso em ms (ex.: `v-reveal="120"`), útil para cascatas.
 * - Respeita `prefers-reduced-motion`: nesse caso não faz nada.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const reduced =
    import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let observer: IntersectionObserver | undefined
  const getObserver = () =>
    (observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.remove('reveal-pending')
          entry.target.classList.add('reveal-done')
          observer?.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    ))

  const reveal: Directive<HTMLElement, number | undefined> = {
    getSSRProps: () => ({ 'data-reveal': '' }),
    mounted(el, binding) {
      el.dataset.reveal = ''
      if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      if (reduced || el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.classList.add('reveal-done')
        return
      }
      el.classList.add('reveal-pending')
      getObserver().observe(el)
    },
    unmounted(el) {
      observer?.unobserve(el)
    },
  }

  nuxtApp.vueApp.directive('reveal', reveal)
})
