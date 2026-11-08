export const READING_MODES = ['paralelo', 'portugues', 'persa'] as const
export type ReadingMode = (typeof READING_MODES)[number]

const isMode = (v: unknown): v is ReadingMode => READING_MODES.includes(v as ReadingMode)
const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

export function useReadingPreferences() {
  const mode = useLocalState<ReadingMode>('jardim:modo-leitura', () => 'paralelo', isMode)
  /** Modo estudo (explicações por dístico) — ligado por padrão, para quem lê Hafez pela primeira vez. */
  const study = useLocalState<boolean>('jardim:modo-estudo', () => true, isBoolean)
  return { mode, study }
}
