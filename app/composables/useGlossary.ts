import type { GlossaryEntry } from '#shared/schemas/glossary'
import { buildGlossaryMatcher } from '#shared/utils/glossary'

/** Glossário compartilhado por todo o site + estado do modal de explicação. */
export function useGlossary() {
  const { data } = useFetch<GlossaryEntry[]>('/api/glossary.json', {
    key: 'glossary',
    default: () => [],
  })
  const openId = useState<string | null>('glossary-open', () => null)

  const entries = computed(() => data.value ?? [])
  const matcher = computed(() => buildGlossaryMatcher(entries.value))
  const current = computed(() => entries.value.find((e) => e.id === openId.value))

  return {
    entries,
    matcher,
    current,
    open: (id: string) => (openId.value = id),
    close: () => (openId.value = null),
  }
}
