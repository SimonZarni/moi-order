import { type Locale } from '@/shared/store/localeStore';
import { STRINGS } from '@/shared/i18n';

/** @deprecated Use useStrings().home directly */
export function getHomeStrings(locale: Locale) {
  return STRINGS[locale].home;
}
