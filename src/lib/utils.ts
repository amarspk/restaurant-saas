/**
 * Generate a URL-safe slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
}

/**
 * Format a price number to a locale currency string.
 */
export function formatPrice(amount: number, currency = 'SAR', locale = 'en-SA'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Pick the display name based on current i18n language.
 */
export function localName(
  nameEn: string,
  nameAr: string,
  lang: string
): string {
  return lang === 'ar' ? nameAr : nameEn
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
