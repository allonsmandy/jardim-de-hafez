import { describe, expect, it } from 'vitest'
import { drawPoem, uniformIndex } from '../../shared/utils/oracle'
import { isPublishable } from '../../shared/utils/publication'
import { makePoem } from '../fixtures/poems'

const sequence = (...values: number[]) => {
  let i = 0
  return () => values[i++ % values.length]!
}

describe('sorteio do Fal-e Hafez', () => {
  it('usa a fonte de aleatoriedade para escolher o índice', () => {
    expect(uniformIndex(3, sequence(0))).toBe(0)
    expect(uniformIndex(3, sequence(4))).toBe(1)
  })

  it('rejeita valores que causariam viés de módulo', () => {
    // 2^32 % 3 === 1, então o maior valor (2^32 - 1) deve ser descartado.
    expect(uniformIndex(3, sequence(2 ** 32 - 1, 5))).toBe(2)
  })

  it('valida o tamanho do intervalo', () => {
    expect(() => uniformIndex(0)).toThrow(RangeError)
    expect(() => uniformIndex(1.5)).toThrow(RangeError)
  })

  it('devolve undefined quando não há poemas elegíveis', () => {
    expect(drawPoem([])).toBeUndefined()
  })

  it('evita repetir o último poema quando há alternativas', () => {
    const pool = ['a', 'b']
    for (let i = 0; i < 50; i++) expect(drawPoem(pool, { exclude: (p) => p === 'a' })).toBe('b')
  })

  it('com um único poema elegível, ele sempre pode ser sorteado', () => {
    expect(drawPoem(['a'], { exclude: (p) => p === 'a' })).toBe('a')
  })

  it('distribui de maneira aproximadamente uniforme (crypto)', () => {
    const pool = Array.from({ length: 10 }, (_, i) => i)
    const counts = new Array(10).fill(0)
    const draws = 50_000
    for (let i = 0; i < draws; i++) counts[drawPoem(pool)!]++
    // qui-quadrado com 9 graus de liberdade; 27.88 ≈ p = 0.001
    const expected = draws / 10
    const chi2 = counts.reduce((acc, c) => acc + (c - expected) ** 2 / expected, 0)
    expect(chi2).toBeLessThan(27.88)
  })

  it('o conjunto elegível exclui poemas não publicáveis', () => {
    const poems = [
      makePoem({ number: 1 }),
      makePoem({
        number: 2,
        translationStatus: 'review',
        publicationAuthorized: false,
        authorization: undefined,
      }),
      makePoem({ number: 3, publicationAuthorized: false, authorization: undefined }),
    ]
    const pool = poems.filter(isPublishable)
    for (let i = 0; i < 100; i++) expect(drawPoem(pool)?.number).toBe(1)
  })
})
