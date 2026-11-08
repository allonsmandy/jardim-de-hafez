/**
 * Estado sincronizado com localStorage, seguro para SSR: no servidor (e até a
 * hidratação) usa o valor padrão; no cliente lê e grava o valor salvo.
 * Valores corrompidos ou de formato inesperado são descartados.
 */
export function useLocalState<T>(
  key: string,
  fallback: () => T,
  isValid: (value: unknown) => value is T,
) {
  const state = useState<T>(`local:${key}`, fallback)

  if (import.meta.client) {
    onMounted(() => {
      try {
        const raw = localStorage.getItem(key)
        if (raw !== null) {
          const parsed: unknown = JSON.parse(raw)
          if (isValid(parsed)) state.value = parsed
        }
      } catch {
        /* armazenamento indisponível ou corrompido: mantém o padrão */
      }
      watch(
        state,
        (value) => {
          try {
            localStorage.setItem(key, JSON.stringify(value))
          } catch {
            /* modo privado / cota cheia: segue só em memória */
          }
        },
        { deep: true },
      )
    })
  }

  return state
}
