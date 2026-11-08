/**
 * Sorteio do Fal-e Hafez.
 *
 * Usa `crypto.getRandomValues` com amostragem por rejeição para obter um
 * índice uniforme, sem o viés de módulo de `Math.floor(Math.random() * n)`
 * em geradores fracos. A fonte de aleatoriedade é injetável para testes.
 */
export type RandomUint32 = () => number

export const cryptoRandomUint32: RandomUint32 = () => {
  const buffer = new Uint32Array(1)
  globalThis.crypto.getRandomValues(buffer)
  return buffer[0]!
}

const UINT32_RANGE = 2 ** 32

/** Inteiro uniforme em [0, max). */
export function uniformIndex(max: number, random: RandomUint32 = cryptoRandomUint32): number {
  if (!Number.isInteger(max) || max < 1 || max > UINT32_RANGE) {
    throw new RangeError('max deve ser um inteiro entre 1 e 2^32')
  }
  const limit = UINT32_RANGE - (UINT32_RANGE % max)
  for (let attempt = 0; attempt < 1000; attempt++) {
    const value = random()
    if (value < limit) return value % max
  }
  throw new Error('Fonte de aleatoriedade não produziu um valor válido.')
}

export interface DrawOptions<T> {
  random?: RandomUint32
  /** Evita repetir imediatamente o último poema sorteado (quando houver mais de um). */
  exclude?: (item: T) => boolean
}

/** Sorteia um item da lista de poemas elegíveis; `undefined` se a lista estiver vazia. */
export function drawPoem<T>(pool: readonly T[], options: DrawOptions<T> = {}): T | undefined {
  if (pool.length === 0) return undefined
  const filtered = options.exclude ? pool.filter((p) => !options.exclude!(p)) : pool
  const candidates = filtered.length > 0 ? filtered : pool
  return candidates[uniformIndex(candidates.length, options.random)]
}
