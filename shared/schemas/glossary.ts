import { z } from 'zod'

/** Termo do glossário (`content/glossary.yml`), explicado para quem nunca leu poesia persa. */
export const GlossaryEntry = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  term: z.string().min(1),
  termFa: z.string().min(1),
  transliteration: z.string().min(1),
  /** Explicação de uma ou duas frases, sem jargão, mostrada no balão ao tocar no termo. */
  short: z.string().min(1),
  definition: z.string().min(1),
  /** Formas em que o termo aparece nos textos (plural, sinônimos); usadas para destacá-lo. */
  aliases: z.array(z.string().min(1)).default([]),
})
export type GlossaryEntry = z.infer<typeof GlossaryEntry>

export const Glossary = z.array(GlossaryEntry).superRefine((entries, ctx) => {
  const seen = new Set<string>()
  entries.forEach((e, i) => {
    if (seen.has(e.id))
      ctx.addIssue({ code: 'custom', path: [i, 'id'], message: `Termo duplicado: ${e.id}` })
    seen.add(e.id)
  })
})
