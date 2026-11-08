import type { Poem, PublicationLevel } from '../schemas/poem'

export interface PublicationCheck {
  publishable: boolean
  /** Nível com que o poema aparece no site (quando publicável). */
  level?: PublicationLevel
  reasons: string[]
}

/**
 * Regra única de publicação. Um poema só aparece no site público (biblioteca,
 * sitemap, Fal-e Hafez) quando todas as condições do seu nível são verdadeiras.
 *
 * - verified: tradução aprovada + revisão humana + autorização + original.
 * - preliminary: tradução (draft/review) + autorização preliminar + original.
 *   Exibida sempre com aviso de que ainda não foi revisada.
 */
export function checkPublication(poem: Poem): PublicationCheck {
  const reasons: string[] = []
  const level = poem.authorization?.level ?? 'verified'
  if (!poem.translation) reasons.push('sem tradução para o português')
  if (!poem.publicationAuthorized) reasons.push('publicação não autorizada')
  if (!poem.authorization) reasons.push('sem registro de autorização')
  if (!poem.original) reasons.push('sem texto original persa verificado')
  if (level === 'verified') {
    if (poem.translationStatus !== 'approved')
      reasons.push(`tradução com status "${poem.translationStatus}"`)
    if (poem.translation && poem.translation.reviewers.length === 0)
      reasons.push('sem revisão humana')
  } else if (poem.translationStatus === 'pending') {
    reasons.push('tradução com status "pending"')
  }
  return reasons.length === 0
    ? { publishable: true, level, reasons }
    : { publishable: false, reasons }
}

export const isPublishable = (poem: Poem): boolean => checkPublication(poem).publishable
