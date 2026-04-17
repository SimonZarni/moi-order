import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { setMemoryLocale } from '@/shared/api/client';
import { LOCALE_KEY } from '@/shared/constants/config';

export type Locale = 'en' | 'mm';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'en',

  setLocale: (locale: Locale): void => {
    setMemoryLocale(locale);
    SecureStore.setItemAsync(LOCALE_KEY, locale).catch(() => {});
    set({ locale });
  },
}));
