import { z } from 'zod'

/**
 * Obra da galeria Arte Persa. Só entra obra com origem e licença verificadas
 * (ver docs/copyright-and-sources.md): título, data, acervo, número de inventário,
 * licença e link para a ficha oficial do museu.
 */
export const ART_ROOMS = ['diva', 'shiraz', 'imagens'] as const
export const ArtRoom = z.enum(ART_ROOMS)
export type ArtRoom = z.infer<typeof ArtRoom>

const nonEmpty = z.string().trim().min(1)

export const Artwork = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  room: ArtRoom,
  /** Título em português, dado pelo projeto a partir do título do museu. */
  title: nonEmpty,
  /** Título exatamente como aparece na ficha do museu. */
  originalTitle: nonEmpty,
  date: nonEmpty,
  place: nonEmpty,
  /** Autoria/atribuição conforme o museu; omitido quando desconhecida. */
  maker: nonEmpty.optional(),
  medium: nonEmpty,
  size: nonEmpty.optional(),
  collection: z.object({
    institution: nonEmpty,
    accession: nonEmpty,
    creditLine: nonEmpty,
    url: z.url(),
  }),
  license: z.object({
    status: z.enum(['public-domain', 'open-license']),
    label: nonEmpty,
  }),
  image: z.object({ src: z.url(), full: z.url(), alt: nonEmpty }),
  /** O que é a obra, em linguagem simples. */
  description: nonEmpty,
  /** Por que ela está num site sobre Hafez. */
  connection: nonEmpty,
  glossary: z.array(nonEmpty).default([]),
  /** Link interno opcional (ex.: um gazel relacionado). */
  link: z.object({ to: nonEmpty, label: nonEmpty }).optional(),
})
export type Artwork = z.infer<typeof Artwork>

export const ArtCollection = z.array(Artwork).superRefine((items, ctx) => {
  const seen = new Set<string>()
  items.forEach((a, i) => {
    if (seen.has(a.id))
      ctx.addIssue({ code: 'custom', path: [i, 'id'], message: `Obra duplicada: ${a.id}` })
    seen.add(a.id)
  })
})
