const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string')

/** Favoritos guardados apenas neste navegador (ids de poemas, ex.: "gazal-001"). */
export function useFavorites() {
  const ids = useLocalState<string[]>('jardim:favoritos', () => [], isStringArray)

  const isFavorite = (id: string) => ids.value.includes(id)
  const toggle = (id: string) => {
    ids.value = isFavorite(id) ? ids.value.filter((x) => x !== id) : [...ids.value, id]
  }

  return { ids: readonly(ids), isFavorite, toggle }
}
