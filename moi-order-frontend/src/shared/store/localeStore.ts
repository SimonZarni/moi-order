import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import apiClient from '@/shared/api/client';

import { setMemoryLocale } from '@/shared/api/client';
import { LOCALE_KEY } from '@/shared/constants/config';

export type Locale = 'en' | 'mm' | 'th';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'mm',

  setLocale: (locale: Locale): void => {
    setMemoryLocale(locale);
    SecureStore.setItemAsync(LOCALE_KEY, locale).catch(() => {});
    set({ locale });
    // Sync to backend so push notifications arrive in the user's language.
    // Fire-and-forget — locale change is immediate locally regardless of network.
    apiClient.patch('/api/v1/profile/locale', { locale }).catch(() => {});
  },
}));
