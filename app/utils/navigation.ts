export interface NavItem {
  label: string
  to: string
}

/** Navegação principal: Início | O Divã | Fal-e Hafez | O Poeta | Arte Persa | Sobre */
export const MAIN_NAVIGATION: NavItem[] = [
  { label: 'Início', to: '/' },
  { label: 'O Divã', to: '/diva' },
  { label: 'Fal-e Hafez', to: '/fal-e-hafez' },
  { label: 'O Poeta', to: '/o-poeta' },
  { label: 'Arte Persa', to: '/arte-persa' },
  { label: 'Sobre', to: '/sobre' },
]
