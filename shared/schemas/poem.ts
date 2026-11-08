import { z } from 'zod'

/**
 * Modelo de conteúdo dos poemas.
 *
 * Princípios (ver docs/content-model.md):
 * - Hafez é sempre o autor; cada tradução registra seus tradutores.
 * - O texto persa e a tradução são listas de estrofes; cada estrofe é uma
 *   lista de versos (num gazel, uma estrofe = um bayt com dois hemistíquios).
 *   Isso permite a leitura paralela verso a verso.
 * - O schema garante CONSISTÊNCIA (ex.: "aprovado" exige revisor). A decisão
 *   de PUBLICAR fica em `shared/utils/publication.ts`.
 */

export const POEM_CATEGORY_IDS = [
  'gazal',
  'rubai',
  'saqi-nameh',
  'ahu-ye-vahshi',
  'qete',
  'qaside',
  'diversos',
] as const
export const PoemCategoryId = z.enum(POEM_CATEGORY_IDS)
export type PoemCategoryId = z.infer<typeof PoemCategoryId>

export const TRANSLATION_STATUSES = ['pending', 'draft', 'review', 'approved'] as const
export const TranslationStatus = z.enum(TRANSLATION_STATUSES)
export type TranslationStatus = z.infer<typeof TranslationStatus>

/**
 * - `translation`: tradução direta do persa.
 * - `relay-translation`: tradução feita a partir de outra tradução (ex.: inglês
 *   em domínio público). Exige `basedOn`.
 * - `adaptation`: adaptação livre — nunca apresentada como tradução literal.
 */
export const TranslationKind = z.enum(['translation', 'relay-translation', 'adaptation'])
export type TranslationKind = z.infer<typeof TranslationKind>

const isoDate = z.iso.date({ error: 'Use uma data no formato AAAA-MM-DD.' })
const nonEmpty = z.string().trim().min(1)

export const Stanza = z.array(nonEmpty).min(1)
export const Stanzas = z.array(Stanza).min(1)

/** Referência a uma fonte registrada em `content/sources.yml`. */
export const SourceReference = z.object({
  source: nonEmpty,
  /** Localizador dentro da fonte: número do gazel, página, URL específica. */
  locator: nonEmpty.optional(),
  url: z.url().optional(),
})
export type SourceReference = z.infer<typeof SourceReference>

export const Note = z.object({
  title: nonEmpty.optional(),
  body: nonEmpty,
  /** Fontes que sustentam a nota (obrigatório para afirmações históricas). */
  sources: z.array(SourceReference).default([]),
})
export type Note = z.infer<typeof Note>

export const OriginalText = z.object({
  language: z.literal('fa'),
  stanzas: Stanzas,
  /** Edição crítica de referência (id em sources.yml), ex.: `qazvini-ghani`. */
  edition: nonEmpty,
  /** De onde a transcrição digital foi obtida. */
  transcription: SourceReference,
})
export type OriginalText = z.infer<typeof OriginalText>

export const Translation = z
  .object({
    language: z.literal('pt-BR'),
    kind: TranslationKind,
    stanzas: Stanzas,
    translators: z.array(nonEmpty).min(1),
    /** Para `relay-translation`/`adaptation`: a versão usada como base. */
    basedOn: SourceReference.optional(),
    reviewers: z.array(nonEmpty).default([]),
    reviewedAt: isoDate.optional(),
    /** Notas de tradução (escolhas, ambiguidades preservadas). */
    notes: z.array(nonEmpty).default([]),
    /** Indica rascunho preparado com auxílio de IA. Nunca publicável sem revisão humana. */
    machineAssisted: z.boolean().default(false),
  })
  .superRefine((t, ctx) => {
    if (t.kind !== 'translation' && !t.basedOn) {
      ctx.addIssue({
        code: 'custom',
        path: ['basedOn'],
        message: 'Traduções indiretas e adaptações precisam indicar a versão de base (basedOn).',
      })
    }
  })
export type Translation = z.infer<typeof Translation>

/**
 * Nível de publicação:
 * - `verified`: tradução aprovada por revisão humana.
 * - `preliminary`: tradução preliminar (ex.: feita por IA) publicada por decisão
 *   da proprietária, com aviso visível em todas as páginas onde aparece.
 */
export const PublicationLevel = z.enum(['verified', 'preliminary'])
export type PublicationLevel = z.infer<typeof PublicationLevel>

export const PublicationAuthorization = z.object({
  level: PublicationLevel.default('verified'),
  by: nonEmpty,
  at: isoDate,
  /** Ex.: "Tradução original do projeto", "Domínio público", "Licença CC BY 4.0". */
  basis: nonEmpty,
})

/** Explicação de um dístico/estrofe (número a partir de 1). */
export const StanzaNote = z.object({
  stanza: z.number().int().positive(),
  /** "Em palavras simples": paráfrase sem nenhum jargão, para quem nunca leu poesia persa. */
  plain: nonEmpty,
  /** Tradução palavra a palavra, para mostrar a distância entre original e versão. */
  literal: nonEmpty.optional(),
  /** "Por trás das palavras": o contexto cultural que explica as imagens. */
  meaning: nonEmpty,
  /** Por que foi traduzido assim: escolhas, perdas, ambiguidades preservadas. */
  choices: nonEmpty.optional(),
})
export type StanzaNote = z.infer<typeof StanzaNote>

export const Poem = z
  .object({
    id: z
      .string()
      .regex(/^[a-z-]+-\d{3}$/, 'Formato esperado: <categoria>-<número com 3 dígitos>.'),
    category: PoemCategoryId,
    number: z.number().int().positive(),

    /** Título criado pela equipe editorial; sempre exibido como "título editorial". */
    editorialTitle: nonEmpty.optional(),
    firstLine: z.object({ fa: nonEmpty, pt: nonEmpty.optional() }),

    originalLanguage: z.literal('fa').default('fa'),
    original: OriginalText.optional(),

    translation: Translation.optional(),
    translationStatus: TranslationStatus,

    publicationAuthorized: z.boolean().default(false),
    authorization: PublicationAuthorization.optional(),

    /** Correspondências em outras edições/numerações (ex.: Khanlari). */
    concordance: z.record(z.string(), z.union([z.number().int(), z.string()])).default({}),
    references: z.array(SourceReference).min(1),

    /** Temas do poema em poucas palavras (ex.: "A brevidade da vida"). */
    themes: z.array(nonEmpty).default([]),
    /** Apresentação do poema: tema, forma, contexto (parágrafos). */
    introduction: z.array(nonEmpty).default([]),
    stanzaNotes: z.array(StanzaNote).default([]),
    /** Termos do glossário (ids em content/glossary.yml) relevantes para o poema. */
    glossary: z.array(nonEmpty).default([]),
    culturalNotes: z.array(Note).default([]),
    editorialNotes: z.array(nonEmpty).default([]),

    updatedAt: isoDate,
  })
  .superRefine((p, ctx) => {
    const expectedId = `${p.category}-${String(p.number).padStart(3, '0')}`
    if (p.id !== expectedId) {
      ctx.addIssue({ code: 'custom', path: ['id'], message: `O id deveria ser "${expectedId}".` })
    }
    if (p.translationStatus !== 'pending' && !p.translation) {
      ctx.addIssue({
        code: 'custom',
        path: ['translation'],
        message: `Status "${p.translationStatus}" exige o bloco translation.`,
      })
    }
    if (p.translationStatus === 'approved' && p.translation) {
      if (p.translation.reviewers.length === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['translation', 'reviewers'],
          message: 'Uma tradução aprovada precisa de pelo menos um revisor.',
        })
      }
      if (!p.translation.reviewedAt) {
        ctx.addIssue({
          code: 'custom',
          path: ['translation', 'reviewedAt'],
          message: 'Uma tradução aprovada precisa da data de revisão.',
        })
      }
      if (p.original && p.translation.stanzas.length !== p.original.stanzas.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['translation', 'stanzas'],
          message: `A tradução aprovada tem ${p.translation.stanzas.length} estrofes; o original tem ${p.original.stanzas.length}.`,
        })
      }
    }
    const stanzaCount = p.original?.stanzas.length ?? p.translation?.stanzas.length ?? 0
    p.stanzaNotes.forEach((n, i) => {
      if (n.stanza > stanzaCount) {
        ctx.addIssue({
          code: 'custom',
          path: ['stanzaNotes', i, 'stanza'],
          message: `O poema tem ${stanzaCount} estrofes; não existe a estrofe ${n.stanza}.`,
        })
      }
    })
    if (p.publicationAuthorized) {
      const level = p.authorization?.level ?? 'verified'
      if (level === 'verified' && p.translationStatus !== 'approved') {
        ctx.addIssue({
          code: 'custom',
          path: ['publicationAuthorized'],
          message:
            'Só traduções aprovadas podem ser publicadas como verificadas. Para rascunhos, use authorization.level: preliminary.',
        })
      }
      if (level === 'preliminary' && p.translationStatus === 'pending') {
        ctx.addIssue({
          code: 'custom',
          path: ['publicationAuthorized'],
          message: 'Uma publicação preliminar precisa de tradução (status draft ou review).',
        })
      }
      if (
        level === 'preliminary' &&
        p.translation &&
        p.original &&
        p.translation.stanzas.length !== p.original.stanzas.length
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['translation', 'stanzas'],
          message: 'A tradução preliminar precisa ter o mesmo número de estrofes do original.',
        })
      }
      if (!p.authorization) {
        ctx.addIssue({
          code: 'custom',
          path: ['authorization'],
          message: 'Registre quem autorizou a publicação, quando e com qual base.',
        })
      }
    }
  })

export type Poem = z.infer<typeof Poem>
export type PoemInput = z.input<typeof Poem>

/** Resumo enviado ao navegador para listagem, busca e sorteio. */
export interface PoemSummary {
  id: string
  category: PoemCategoryId
  number: number
  editorialTitle?: string
  firstLine: { fa: string; pt?: string }
  translators: string[]
  translationKind?: TranslationKind
  machineAssisted: boolean
  publicationLevel?: PublicationLevel
  /** Texto normalizado (pt + fa) para busca textual no cliente. */
  searchText: string
}

export interface PoemNeighbors {
  previous?: Pick<PoemSummary, 'category' | 'number' | 'firstLine' | 'editorialTitle'>
  next?: Pick<PoemSummary, 'category' | 'number' | 'firstLine' | 'editorialTitle'>
}
