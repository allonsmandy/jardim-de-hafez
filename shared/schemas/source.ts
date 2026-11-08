import { z } from 'zod'

/** Fontes bibliográficas e digitais registradas em `content/sources.yml`. */
export const SourceType = z.enum([
  'critical-edition',
  'digital-transcription',
  'translation',
  'reference',
  'website',
])

export const Source = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  type: SourceType,
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).default([]),
  year: z.string().optional(),
  publisher: z.string().optional(),
  url: z.url().optional(),
  /** Situação de direitos tal como verificada pela equipe. */
  rights: z.object({
    status: z.enum([
      'public-domain',
      'open-license',
      'permission-granted',
      'restricted',
      'unverified',
    ]),
    note: z.string().min(1),
    verifiedAt: z.iso.date().optional(),
  }),
  /** Pode ser usada como base de texto publicado? */
  usableForPublication: z.boolean(),
})
export type Source = z.infer<typeof Source>

export const SourceRegistry = z.array(Source).superRefine((sources, ctx) => {
  const seen = new Set<string>()
  sources.forEach((s, i) => {
    if (seen.has(s.id))
      ctx.addIssue({ code: 'custom', path: [i, 'id'], message: `Fonte duplicada: ${s.id}` })
    seen.add(s.id)
  })
})
