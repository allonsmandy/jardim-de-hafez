const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

/** Converte algarismos persas/arábicos em algarismos latinos. */
export function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (d) => {
    const persian = PERSIAN_DIGITS.indexOf(d)
    return String(persian >= 0 ? persian : ARABIC_DIGITS.indexOf(d))
  })
}

/** Converte um número em algarismos persas (۱۲۳). */
export function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]!)
}

/**
 * Normaliza texto para busca, tanto em português quanto em persa:
 * - remove acentos e diacríticos (inclusive harakat árabes);
 * - remove o kashida (ـ), usado só para alongar letras;
 * - troca ZWNJ (meia-espaço) por espaço;
 * - unifica variantes árabes de ي/ك para as formas persas ی/ک;
 * - converte algarismos persas em latinos;
 * - colapsa espaços e coloca em minúsculas.
 */
export function normalizeForSearch(value: string): string {
  return toLatinDigits(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ً-ٰٟ]/g, '')
    .replace(/ـ/g, '')
    .replace(/[‌‍]/g, ' ')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[أإٱآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

/** Junta estrofes em texto corrido (para copiar ou compartilhar). */
export function stanzasToPlainText(stanzas: string[][]): string {
  return stanzas.map((s) => s.join('\n')).join('\n\n')
}
