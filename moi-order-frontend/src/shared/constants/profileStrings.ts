import { type Locale } from '@/shared/store/localeStore';
import { STRINGS } from '@/shared/i18n';

/** @deprecated Use useStrings().profile directly */
export function getProfileStrings(locale: Locale) {
  return STRINGS[locale].profile;
}
