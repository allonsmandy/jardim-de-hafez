import type { MaybeRefOrGetter } from 'vue'
import type { Source } from '#shared/schemas/source'

export type RightsStatus = Source['rights']['status']
export type RightsTone = 'free' | 'closed' | 'pending'

/** Situação de direitos de uma fonte, com rótulo curto e explicação para leigos. */
export const RIGHTS_STATUS: Record<
  RightsStatus,
  { label: string; plain: string; tone: RightsTone }
> = {
  'public-domain': {
    label: 'Domínio público',
    plain: 'A obra é tão antiga que ninguém mais é dono dela. Qualquer pessoa pode usar.',
    tone: 'free',
  },
  'open-license': {
    label: 'Licença aberta',
    plain: 'Quem fez liberou o uso, pedindo em troca crédito e link — e é o que damos.',
    tone: 'free',
  },
  'permission-granted': {
    label: 'Uso autorizado',
    plain: 'Feito ou cedido especialmente para o projeto, com autorização registrada.',
    tone: 'free',
  },
  restricted: {
    label: 'Só consulta',
    plain:
      'Obra moderna com dono. Pode ser lida e citada como referência, mas não copiada nem traduzida.',
    tone: 'closed',
  },
  unverified: {
    label: 'Em verificação',
    plain: 'Ainda não sabemos se pode ser usada — então, por enquanto, não usamos.',
    tone: 'pending',
  },
}

export function useRightsStatus(status: MaybeRefOrGetter<RightsStatus>) {
  const info = computed(() => RIGHTS_STATUS[toValue(status)])
  return { label: computed(() => info.value.label), tone: computed(() => info.value.tone) }
}
