import { create } from 'zustand';
import type { Language } from '../shared/constants/translations';
import { storage } from '../shared/utils/storage';

export type { Language };
export type Theme = 'light' | 'dark';
export type MenuView = 'list' | 'grid';

const SETTINGS_KEY = 'merchant_settings';

interface PersistedSettings {
  language: Language;
  theme: Theme;
  menuView: MenuView;
}

interface SettingsState extends PersistedSettings {
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setMenuView: (view: MenuView) => void;
  initFromStorage: () => Promise<void>;
}

function persist(state: PersistedSettings): void {
  storage.setItemAsync(SETTINGS_KEY, JSON.stringify(state)).catch(() => {});
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  language: 'en',
  theme: 'light',
  menuView: 'list',

  setLanguage(language) {
    set({ language });
    persist({ language, theme: get().theme, menuView: get().menuView });
  },

  setTheme(theme) {
    set({ theme });
    persist({ language: get().language, theme, menuView: get().menuView });
  },

  setMenuView(menuView) {
    set({ menuView });
    persist({ language: get().language, theme: get().theme, menuView });
  },

  async initFromStorage() {
    try {
      const raw = await storage.getItemAsync(SETTINGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
      set({
        language: parsed.language ?? 'en',
        theme: parsed.theme ?? 'light',
        menuView: parsed.menuView ?? 'list',
      });
    } catch {}
  },
}));
