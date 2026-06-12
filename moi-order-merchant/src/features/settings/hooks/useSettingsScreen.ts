import { useCallback } from 'react';
import { useSettingsStore } from '../../../store/settingsStore';
import type { Language, Theme, MenuView } from '../../../store/settingsStore';
import { useAuthStore } from '../../../store/authStore';

export interface UseSettingsScreenResult {
  language: Language;
  theme: Theme;
  menuView: MenuView;
  hasPassword: boolean;
  handleSetLanguage: (lang: Language) => void;
  handleSetTheme: (theme: Theme) => void;
  handleSetMenuView: (view: MenuView) => void;
}

export function useSettingsScreen(): UseSettingsScreenResult {
  const { language, theme, menuView, setLanguage, setTheme, setMenuView } = useSettingsStore();
  const user = useAuthStore((s) => s.user);

  const handleSetLanguage = useCallback((lang: Language) => setLanguage(lang), [setLanguage]);
  const handleSetTheme = useCallback((t: Theme) => setTheme(t), [setTheme]);
  const handleSetMenuView = useCallback((v: MenuView) => setMenuView(v), [setMenuView]);

  return {
    language,
    theme,
    menuView,
    hasPassword: user?.has_password ?? false,
    handleSetLanguage,
    handleSetTheme,
    handleSetMenuView,
  };
}
