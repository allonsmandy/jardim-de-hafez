import { describe, expect, it } from 'vitest'
import { Poem } from '../../shared/schemas/poem'
import { makePoemInput } from '../fixtures/poems'

const issues = (input: unknown) => {
  const r = Poem.safeParse(input)
  return r.success ? [] : r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
}

describe('schema de poema', () => {
  it('aceita um poema aprovado e autorizado completo', () => {
    expect(issues(makePoemInput())).toEqual([])
  })

  it('aplica valores padrão', () => {
    const poem = Poem.parse(makePoemInput({ culturalNotes: undefined }))
    expect(poem.culturalNotes).toEqual([])
    expect(poem.originalLanguage).toBe('fa')
  })

  it('exige id coerente com categoria e número', () => {
    expect(issues(makePoemInput({ id: 'gazal-002' }))).toContainEqual(
      expect.stringContaining('gazal-001'),
    )
  })

  it('permite poema pendente sem tradução', () => {
    expect(
      issues(
        makePoemInput({
          translation: undefined,
          translationStatus: 'pending',
          publicationAuthorized: false,
          authorization: undefined,
        }),
      ),
    ).toEqual([])
  })

  it('rejeita status de rascunho sem bloco de tradução', () => {
    expect(
      issues(
        makePoemInput({
          translation: undefined,
          translationStatus: 'draft',
          publicationAuthorized: false,
        }),
      ),
    ).toContainEqual(expect.stringMatching(/^translation:/))
  })

  it('rejeita tradução aprovada sem revisor', () => {
    const input = makePoemInput()
    input.translation!.reviewers = []
    expect(issues(input)).toContainEqual(expect.stringMatching(/reviewers/))
  })

  it('rejeita tradução aprovada com número de estrofes diferente do original', () => {
    const input = makePoemInput()
    input.translation!.stanzas = [['Só uma estrofe']]
    expect(issues(input)).toContainEqual(expect.stringMatching(/estrofes/))
  })

  it('impede autorizar publicação de tradução não aprovada', () => {
    expect(issues(makePoemInput({ translationStatus: 'review' }))).toContainEqual(
      expect.stringMatching(/^publicationAuthorized/),
    )
  })

  it('impede autorizar publicação sem registro de autorização', () => {
    expect(issues(makePoemInput({ authorization: undefined }))).toContainEqual(
      expect.stringMatching(/^authorization/),
    )
  })

  it('exige versão de base para adaptações e traduções indiretas', () => {
    const input = makePoemInput()
    input.translation!.kind = 'adaptation'
    expect(issues(input)).toContainEqual(expect.stringMatching(/basedOn/))
  })

  it('rejeita datas fora do formato ISO', () => {
    expect(issues(makePoemInput({ updatedAt: '10/01/2026' }))).toContainEqual(
      expect.stringMatching(/^updatedAt/),
    )
  })
})
