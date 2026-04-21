import { Locale } from '@/shared/store/localeStore';

export function localeName(
  item: { name_en: string; name_mm: string | null } | null | undefined,
  locale: Locale,
): string {
  if (!item) return '—';
  return locale === 'mm' && item.name_mm !== null ? item.name_mm : item.name_en;
}

export function localeLabel(
  item: { label: string; label_mm: string },
  locale: Locale,
): string {
  return locale === 'mm' ? item.label_mm : item.label;
}
