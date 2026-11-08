import { describe, expect, it } from 'vitest'
import { checkPublication, isPublishable } from '../../shared/utils/publication'
import { makePoem } from '../fixtures/poems'

describe('regra de publicação', () => {
  it('publica apenas poemas aprovados, autorizados, revisados e com original', () => {
    expect(isPublishable(makePoem())).toBe(true)
  })

  it('bloqueia poemas pendentes e explica o motivo', () => {
    const poem = makePoem({
      translation: undefined,
      translationStatus: 'pending',
      publicationAuthorized: false,
      authorization: undefined,
    })
    const check = checkPublication(poem)
    expect(check.publishable).toBe(false)
    expect(check.reasons).toEqual(
      expect.arrayContaining([
        'tradução com status "pending"',
        'sem tradução para o português',
        'publicação não autorizada',
      ]),
    )
  })

  it('bloqueia aprovados ainda não autorizados', () => {
    expect(
      isPublishable(makePoem({ publicationAuthorized: false, authorization: undefined })),
    ).toBe(false)
  })

  it('bloqueia poemas sem texto original', () => {
    expect(checkPublication(makePoem({ original: undefined })).reasons).toContain(
      'sem texto original persa verificado',
    )
  })
})
