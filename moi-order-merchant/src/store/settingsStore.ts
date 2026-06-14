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
  alarmEnabled: boolean;
}

interface SettingsState extends PersistedSettings {
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setMenuView: (view: MenuView) => void;
  setAlarmEnabled: (enabled: boolean) => void;
  initFromStorage: () => Promise<void>;
}

function persist(state: PersistedSettings): void {
  storage.setItemAsync(SETTINGS_KEY, JSON.stringify(state)).catch(() => {});
}

function snapshot(get: () => SettingsState): PersistedSettings {
  const s = get();
  return { language: s.language, theme: s.theme, menuView: s.menuView, alarmEnabled: s.alarmEnabled };
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  language: 'en',
  theme: 'light',
  menuView: 'grid',
  alarmEnabled: true,

  setLanguage(language) {
    set({ language });
    persist({ ...snapshot(get), language });
  },

  setTheme(theme) {
    set({ theme });
    persist({ ...snapshot(get), theme });
  },

  setMenuView(menuView) {
    set({ menuView });
    persist({ ...snapshot(get), menuView });
  },

  setAlarmEnabled(alarmEnabled) {
    set({ alarmEnabled });
    persist({ ...snapshot(get), alarmEnabled });
  },

  async initFromStorage() {
    try {
      const raw = await storage.getItemAsync(SETTINGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
      set({
        language:     parsed.language     ?? 'en',
        theme:        parsed.theme        ?? 'light',
        menuView:     'grid',
        alarmEnabled: parsed.alarmEnabled ?? true,
      });
    } catch {}
  },
}));
