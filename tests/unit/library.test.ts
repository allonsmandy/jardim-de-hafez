import { describe, expect, it } from 'vitest'
import { getNeighbors, paginate, searchPoems, toSummary } from '../../shared/utils/library'
import { makePoem } from '../fixtures/poems'

const summaries = [
  makePoem({ number: 3 }),
  makePoem({ number: 1 }),
  makePoem({ number: 12, firstLine: { fa: 'گل و بلبل', pt: 'A rosa e o rouxinol' } }),
  makePoem({ number: 1, category: 'rubai' }),
].map(toSummary)

describe('busca', () => {
  it('sem consulta, devolve tudo em ordem de categoria e número', () => {
    expect(searchPoems(summaries, {}).map((p) => p.id)).toEqual([
      'gazal-001',
      'gazal-003',
      'gazal-012',
      'rubai-001',
    ])
  })

  it('busca por número exato com algarismos latinos ou persas', () => {
    expect(searchPoems(summaries, { q: '12' }).map((p) => p.id)).toEqual(['gazal-012'])
    expect(searchPoems(summaries, { q: '۱۲' }).map((p) => p.id)).toEqual(['gazal-012'])
    expect(searchPoems(summaries, { q: 'nº 3' }).map((p) => p.id)).toEqual(['gazal-003'])
  })

  it('número não confunde prefixos (1 não encontra 12)', () => {
    expect(searchPoems(summaries, { q: '1', category: 'gazal' }).map((p) => p.id)).toEqual([
      'gazal-001',
    ])
  })

  it('busca textual ignora acentos e maiúsculas', () => {
    expect(searchPoems(summaries, { q: 'ROUXINÓL' }).map((p) => p.id)).toEqual(['gazal-012'])
  })

  it('busca textual em persa ignora kashida e variantes árabes', () => {
    expect(searchPoems(summaries, { q: 'بلـبل' }).map((p) => p.id)).toEqual(['gazal-012'])
  })

  it('todas as palavras precisam estar presentes', () => {
    expect(searchPoems(summaries, { q: 'rosa inexistente' })).toEqual([])
  })

  it('filtra por categoria', () => {
    expect(searchPoems(summaries, { category: 'rubai' }).map((p) => p.id)).toEqual(['rubai-001'])
  })

  it('combina filtro e busca e devolve lista vazia quando nada corresponde', () => {
    expect(searchPoems(summaries, { category: 'rubai', q: 'rouxinol' })).toEqual([])
  })
})

describe('paginação', () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1)

  it('divide em páginas', () => {
    expect(paginate(items, 2, 10)).toMatchObject({
      items: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      page: 2,
      total: 25,
      totalPages: 3,
    })
  })

  it('ajusta páginas fora do intervalo', () => {
    expect(paginate(items, 99, 10).page).toBe(3)
    expect(paginate(items, -1, 10).page).toBe(1)
    expect(paginate(items, Number.NaN, 10).page).toBe(1)
  })

  it('lista vazia tem uma página vazia', () => {
    expect(paginate([], 1, 10)).toMatchObject({ items: [], page: 1, totalPages: 1, total: 0 })
  })

  it('rejeita tamanho de página inválido', () => {
    expect(() => paginate(items, 1, 0)).toThrow(RangeError)
  })
})

describe('navegação entre poemas', () => {
  it('encontra anterior e próximo na mesma categoria', () => {
    const n = getNeighbors(summaries, { category: 'gazal', number: 3 })
    expect(n.previous?.number).toBe(1)
    expect(n.next?.number).toBe(12)
  })

  it('não atravessa categorias nas pontas', () => {
    const n = getNeighbors(summaries, { category: 'gazal', number: 12 })
    expect(n.next).toBeUndefined()
    expect(getNeighbors(summaries, { category: 'rubai', number: 1 })).toEqual({
      previous: undefined,
      next: undefined,
    })
  })

  it('poema inexistente não tem vizinhos', () => {
    expect(getNeighbors(summaries, { category: 'gazal', number: 400 })).toEqual({})
  })
})
