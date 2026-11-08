# Jardim de Hafez — guia para agentes de conteúdo (Codex)

Site brasileiro para ler Hafez de Shiraz (poeta persa, séc. XIV) em persa e português, com
explicações para **quem nunca leu poesia persa**. Nuxt 4 + YAML validado por Zod.

> **Seu trabalho é só o TEXTO.** O design, os componentes, as páginas e as rotas estão prontos.
> Um poema novo aparece sozinho no site assim que o YAML dele estiver completo e válido.

---

## 1. O que você pode e o que não pode editar

| Pode editar                           | Para quê                                                  |
| ------------------------------------- | --------------------------------------------------------- |
| `content/poetry/<categoria>/<id>.yml` | Traduzir e explicar poemas (o grosso do trabalho)         |
| `content/glossary.yml`                | **Acrescentar** termos novos (não apagar nem renomear id) |
| `content/sources.yml`                 | **Acrescentar** fontes consultadas, com direitos          |

**Não edite** `app/`, `server/`, `shared/`, `scripts/`, `public/`, `nuxt.config.ts`, CSS, nem os
arquivos de configuração. Se achar que o site precisa de uma mudança de código para exibir algo,
**pare e descreva o problema** em vez de mexer — a proprietária faz isso com outra ferramenta.

Nunca altere o bloco `original` (texto persa) para "corrigir" o persa. Se suspeitar de erro na
transcrição, registre em `editorialNotes`.

---

## 2. Onde estão os poemas

Todo o persa já foi importado do Ganjoor (edição Qazvini-Ghani). Cada poema ainda não traduzido
é um arquivo com `translationStatus: pending` — ele não aparece no site até ser traduzido.

| Categoria (`category`) | Pasta                           | Qtd. | Rota no site              | O que é                                         |
| ---------------------- | ------------------------------- | ---- | ------------------------- | ----------------------------------------------- |
| `gazal`                | `content/poetry/gazal/`         | 495  | `/diva/gazeis/N`          | Poema lírico de rima única; núcleo do Divã      |
| `rubai`                | `content/poetry/rubai/`         | 42   | `/diva/rubaiyat/N`        | Quadra: 4 versos = 2 dísticos                   |
| `qete`                 | `content/poetry/qete/`          | 34   | `/diva/qetes/N`           | Poemas curtos de ocasião (conselho, elegia…)    |
| `qaside`               | `content/poetry/qaside/`        | 3    | `/diva/qasides/N`         | Odes longas de elogio a governantes             |
| `saqi-nameh`           | `content/poetry/saqi-nameh/`    | 1    | `/diva/saqi-nameh/1`      | "Livro do Copeiro", poema longo (masnavi)       |
| `ahu-ye-vahshi`        | `content/poetry/ahu-ye-vahshi/` | 1    | `/diva/gazela-selvagem/1` | "A gazela selvagem", poema longo (masnavi)      |
| `diversos`             | `content/poetry/diversos/`      | 118  | `/diva/diversos/N`        | Poemas **atribuídos** a Hafez, autoria duvidosa |

Ver o que falta: `pnpm content:next` (próximos pendentes) e `pnpm content:validate` (painel geral).
Se um arquivo não existir ainda: `pnpm import:ganjoor --category <categoria> --from N --to N`.

**Os gazéis 1–15 já estão prontos e são o padrão de qualidade.** Leia `gazal-001.yml` inteiro
antes de começar e imite o tom, a profundidade e o formato.

---

## 3. Passo a passo para traduzir um poema

Partindo de um arquivo `pending`, **acrescente** os blocos abaixo (o modelo completo está em
`docs/templates/poema-traduzido.yml`). Não apague o que já existe.

1. **`firstLine.pt`** — o primeiro verso traduzido (sem pontuação final).
2. **`translation`** — a tradução, verso a verso:
   ```yaml
   translation:
     language: pt-BR
     kind: translation
     stanzas: # MESMO número de estrofes e de versos que original.stanzas
       - - primeiro hemistíquio,
         - segundo hemistíquio.
     translators:
       - Codex (IA, OpenAI)
     reviewers: []
     notes:
       - Tradução preliminar feita por IA a partir do texto persa, sem rima, priorizando sentido,
         imagens e ambiguidades. Ver /como-traduzimos.
     machineAssisted: true
   ```
3. **Status e publicação** (é o que faz o poema aparecer no site, com o aviso de "preliminar"):
   ```yaml
   translationStatus: draft
   publicationAuthorized: true
   authorization:
     level: preliminary
     by: Proprietária do projeto
     at: AAAA-MM-DD # data de hoje
     basis: Publicação como tradução preliminar por IA, aberta a correções, autorizada pela proprietária.
   ```
4. **`themes`** — 2 a 4 temas curtos, em linguagem de gente ("A vida passa depressa").
5. **`introduction`** — 2 a 3 parágrafos para leigos: do que o poema fala, por que importa, uma
   curiosidade. Nada de jargão sem explicação.
6. **`stanzaNotes`** — **um item para cada estrofe** (`stanza` começa em 1), com:
   - `plain` (obrigatório) — **"Em palavras simples"**: a ideia do dístico como se explicasse a um
     amigo de 15 anos. Uma ou duas frases. Sem metáfora nova, sem termos técnicos.
   - `meaning` (obrigatório) — **"Por trás das palavras"**: imagens, costumes, lendas, leitura
     amorosa e leitura mística. É aqui que entra o contexto cultural.
   - `literal` (recomendado) — tradução palavra a palavra, com `/` separando os hemistíquios e
     colchetes para o que é acréscimo ou mudança de língua.
   - `choices` (recomendado) — por que traduziu assim: palavras persas difíceis (transliteradas
     entre aspas), alternativas descartadas, ambiguidades que você preservou.
7. **`glossary`** — ids de `content/glossary.yml` dos termos que aparecem no poema.
8. **`culturalNotes`** — 1 a 3 notas sobre o poema inteiro (lenda, recepção, forma), cada uma com
   `title`, `body` e, se for afirmação histórica, `sources`.
9. **`updatedAt`** — data de hoje.
10. Rode `pnpm content:validate` e `pnpm format`. Abra `pnpm dev` e confira a página do poema.

---

## 4. Como traduzir

- **Direto do persa**, verso a verso, **sem rima**. Fidelidade ao sentido, às imagens e ao tom.
- **Preserve as ambiguidades** em vez de resolvê-las: o amado pode ser humano ou divino; o vinho
  pode ser vinho ou êxtase místico. No verso fica a ambiguidade; a explicação vai para `meaning`.
- Português do Brasil, registro literário mas claro. Tratamento "tu" para o amado e o copeiro,
  como nos gazéis 1–15. Evite arcaísmos gratuitos.
- Não acrescente o que não está no original. Não transforme o poema em frase de autoajuda.
- Versos em **árabe** no original: traduza e registre em `choices` que mudou de língua.
- **Assinatura (takhallos):** quando Hafez diz o próprio nome (geralmente no último dístico de um
  gazel), mantenha "Hafez" e explique o recurso.
- Hemistíquio que comece com aspas, dois-pontos ou caractere especial precisa estar entre aspas
  simples no YAML (ver gazal-001, estrofes 3 e 7).

### Particularidades por categoria

- **rubai**: 2 estrofes de 2 versos. Uma `stanzaNote` por estrofe. Na introdução, explique que o
  rubai é uma quadra e que a autoria dos rubaiyat de Hafez é menos segura que a dos gazéis.
- **qete**: muitos são elegias com "data em letras" (_mâdde târikh_: as letras de um verso somam o
  ano da morte). Explique o recurso de forma simples e diga quem era a pessoa, se for conhecida.
- **qaside**: poemas de elogio. Diga quem é o homenageado (Shah Shoja, Haji Qavam, Shah Sheikh
  Abu Eshaq — já estão no glossário) e por que poetas escreviam elogios.
- **diversos**: são poemas **atribuídos**. A introdução **sempre** começa dizendo que a autoria é
  duvidosa e que não estão na edição Qazvini-Ghani.
- **saqi-nameh** e **ahu-ye-vahshi**: poemas longos (58 e 29 dísticos). Mesmo formato; uma
  `stanzaNote` por dístico. Trabalhe em partes e valide no meio.

---

## 5. Como explicar (o mais importante)

O leitor nunca ouviu falar de Hafez, de sufismo ou do Irã medieval.

- **Comece simples, aprofunde depois**: `plain` → `meaning` → `literal`/`choices`.
- Toda palavra estranha (copeiro, dervixe, Alcorão, gazel, manto…) precisa estar no glossário.
  No site, os termos com `aliases` viram links que abrem um balão explicativo — então **não**
  escreva definições longas dentro das notas; use o termo e garanta que ele esteja no glossário.
- **Fato ≠ lenda.** Lendas (Hafez e Tamerlão, a noite em claro de 40 dias…) sempre identificadas
  como "conta a tradição", "segundo a lenda". Nunca invente datas, nomes ou citações.
- Frases curtas. Parágrafos de no máximo ~5 linhas.

### Glossário (`content/glossary.yml`)

Antes de criar um termo, procure se já existe (há ~58). Para criar:

```yaml
- id: kebab-case-sem-acento
  term: Nome em português
  termFa: نام فارسی
  transliteration: transliteração
  short: Uma ou duas frases, sem jargão — aparece no balão.
  definition: >-
    Explicação completa, 3 a 6 frases, para a página /glossario.
  aliases: [formas exatas, plural, Maiúscula]
```

`aliases` são destacados **automaticamente em todo o site**: use só formas inconfundíveis
(nunca palavras comuns como "amor", "taça", "noite").

---

## 6. Direitos e fontes — regras que não se quebram

- O texto persa vem do Ganjoor (dados abertos). **Nunca** copie comentários, resumos ou
  explicações do Ganjoor.
- **Proibido** usar como base, parafrasear ou copiar traduções modernas protegidas: Shahriari
  (hafizonlove.com), Paul Smith, Elizabeth T. Gray, Aryanpur Kashani, Daniel Ladinsky (este
  último nem é tradução — são poemas inventados atribuídos a Hafez).
- Clarke (1891) e Bell (1897) estão em domínio público e podem ser consultadas.
- Toda fonte citada em `sources:` deve existir em `content/sources.yml`. Para incluir uma nova,
  registre a situação de direitos com honestidade (`restricted` se for obra moderna).
- O tradutor é sempre registrado como `Codex (IA, OpenAI)` — nunca como pessoa, nunca omitido.

---

## 7. Comandos

```bash
pnpm content:next              # próximos poemas pendentes (use --category rubai, --count 20)
pnpm content:validate          # valida tudo; mostra o painel por categoria e status
pnpm format                    # formata os YAML (Prettier)
pnpm dev                       # site local em http://localhost:3000
pnpm check                     # lint + formato + tipos + testes + validação (rode antes de commitar)
```

Trabalhe em **lotes de 5 a 10 poemas**. Um commit por lote, mensagem em português, por exemplo:
`conteúdo: traduz gazéis 16–25 (preliminar, Codex)`.

---

## 8. Checklist antes de dar um poema por pronto

- [ ] `translation.stanzas` tem o mesmo número de estrofes **e de versos** que `original.stanzas`
- [ ] `translators: [Codex (IA, OpenAI)]`, `machineAssisted: true`
- [ ] `translationStatus: draft`, `publicationAuthorized: true`, `authorization.level: preliminary`
- [ ] `firstLine.pt`, `themes`, `introduction` preenchidos
- [ ] uma `stanzaNote` com `plain` e `meaning` para **cada** estrofe
- [ ] termos difíceis no `glossary` do poema e em `content/glossary.yml`
- [ ] lendas marcadas como lendas; nenhuma fonte protegida usada
- [ ] `updatedAt` com a data de hoje
- [ ] `pnpm content:validate` sem erros e página conferida no `pnpm dev`

Documentação de apoio: `docs/translation-workflow.md`, `docs/content-model.md`,
`docs/copyright-and-sources.md`, `docs/decisions/0006-traducoes-preliminares-por-ia.md`.
