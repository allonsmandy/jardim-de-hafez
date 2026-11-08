import { describe, expect, it } from 'vitest'
import {
  normalizeForSearch,
  stanzasToPlainText,
  toLatinDigits,
  toPersianDigits,
} from '../../shared/utils/text'

describe('texto', () => {
  it('converte algarismos persas e latinos', () => {
    expect(toLatinDigits('غزل ۴۹۵')).toBe('غزل 495')
    expect(toPersianDigits(495)).toBe('۴۹۵')
  })

  it('remove harakat, kashida e unifica variantes', () => {
    expect(normalizeForSearch('اَلا یا اَیُّهَا السّاقی')).toBe(
      normalizeForSearch('الا يا ايها الساقی'),
    )
    expect(normalizeForSearch('الـساقی')).toBe('الساقی')
  })

  it('trata a meia-espaço (ZWNJ) como separador', () => {
    expect(normalizeForSearch('مشکل‌ها')).toBe('مشکل ها')
  })

  it('remove acentos do português', () => {
    expect(normalizeForSearch('Coração, ÁGUA!')).toBe('coracao agua')
  })

  it('gera texto corrido a partir de estrofes', () => {
    expect(stanzasToPlainText([['a', 'b'], ['c']])).toBe('a\nb\n\nc')
  })
})
