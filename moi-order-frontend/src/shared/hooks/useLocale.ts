import { useLocaleStore, Locale } from '@/shared/store/localeStore';

export interface UseLocaleResult {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export function useLocale(): UseLocaleResult {
  const locale    = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  return { locale, setLocale };
}
