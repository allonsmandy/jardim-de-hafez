# Modelo de conteúdo

Schema oficial: `shared/schemas/poem.ts` (Zod). Fontes: `shared/schemas/source.ts`.

## Arquivo de poema

`content/poetry/<categoria>/<categoria>-NNN.yml` — o nome do arquivo deve ser igual ao `id`.

```yaml
id: gazal-001 # <categoria>-<número com 3 dígitos>
category: gazal # gazal | rubai | qete | qaside | saqi-nameh | ahu-ye-vahshi | diversos
number: 1 # numeração Qazvini-Ghani
editorialTitle: # opcional; sempre exibido como "título editorial"
firstLine:
  fa: اَلا یا اَیُّهَا السّاقی ...
  pt: ... # opcional (primeiro verso traduzido)
original:
  language: fa
  stanzas: [[hemistíquio 1, hemistíquio 2], ...] # 1 estrofe = 1 dístico (bayt)
  edition: qazvini-ghani # id em sources.yml
  transcription: { source: ganjoor, locator: Gazel 1, url: https://ganjoor.net/hafez/ghazal/sh1 }
translation: # obrigatório se status ≠ pending
  language: pt-BR
  kind: translation # translation | relay-translation | adaptation
  basedOn: { source: ... } # obrigatório para relay-translation e adaptation
  stanzas: [[...], ...] # alinhadas ao original (obrigatório quando aprovada)
  translators: [Nome]
  reviewers: [Nome] # ≥ 1 quando aprovada
  reviewedAt: 2026-01-10 # obrigatório quando aprovada
  notes: [...] # notas de tradução
  machineAssisted: false # rascunho com auxílio de IA
translationStatus: pending # pending | draft | review | approved
publicationAuthorized: false
authorization:
  { level: verified, by: Nome, at: 2026-01-11, basis: Tradução original do projeto }
  # level: verified | preliminary (ver ADR 0006)
concordance: { khanlari: 1 } # opcional: numeração em outras edições
references: [{ source: qazvini-ghani, locator: Gazel 1 }]
introduction: [parágrafo, ...] # apresentação do poema para iniciantes
stanzaNotes: # explicação dístico a dístico (stanza começa em 1)
  - stanza: 1
    literal: tradução palavra por palavra
    meaning: o que significa, com contexto cultural
    choices: por que foi traduzido assim
glossary: [saqi, vinho] # ids de content/glossary.yml
culturalNotes: [{ title: O saqi, body: ..., sources: [{ source: ... }] }]
editorialNotes: [...]
updatedAt: 2026-11-07
```

## Regras de consistência (schema)

- `id` = `categoria-NNN`; arquivo = `id.yml`.
- Status diferente de `pending` exige `translation`.
- `approved` exige revisor, data de revisão e o mesmo número de estrofes do original.
- `publicationAuthorized: true` exige status `approved` e bloco `authorization`.
- Tradução indireta ou adaptação exige `basedOn`.

## Regras de acervo (`loadContent`)

- Sem duplicatas de categoria+número; alerta para primeiro verso repetido (duplicata entre edições).
- Toda fonte citada existe em `sources.yml`.
- Poema autorizado não pode se basear em fonte com `usableForPublication: false`
  (inclui a transcrição do texto persa).

## Regra de publicação (`shared/utils/publication.ts`)

Um poema é **publicado** (biblioteca, página, sitemap, Fal) em um de dois níveis:

- **verificado** (`level: verified`): status `approved`, revisão humana, autorização e texto persa;
- **preliminar** (`level: preliminary`): tradução em `draft`/`review` (ex.: feita por IA), autorização
  registrada e texto persa. Aparece sempre com o aviso “Tradução preliminar” (ADR 0006).
  Qualquer outra situação → invisível em produção (404). A prévia editorial local mostra tudo com aviso
  e `noindex`.

## Categorias e rotas

| id            | rota                      | rótulo                                         |
| ------------- | ------------------------- | ---------------------------------------------- |
| gazal         | `/diva/gazeis/N`          | Gazéis (495)                                   |
| rubai         | `/diva/rubaiyat/N`        | Rubaiyat                                       |
| saqi-nameh    | `/diva/saqi-nameh/N`      | Saqi-Nameh                                     |
| ahu-ye-vahshi | `/diva/gazela-selvagem/N` | A gazela selvagem                              |
| qete          | `/diva/qetes/N`           | Qet‘es (34)                                    |
| qaside        | `/diva/qasides/N`         | Qasides (3)                                    |
| diversos      | `/diva/diversos/N`        | Diversos (118, atribuídos; edição = `ganjoor`) |

## Glossário

`content/glossary.yml`: `id`, `term`, `termFa`, `transliteration`, `definition`. Cada poema lista os
termos relevantes em `glossary`; o validador garante que existam. Página: `/glossario`.
