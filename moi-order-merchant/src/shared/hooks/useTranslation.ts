import { useSettingsStore } from '../../store/settingsStore';
import { TRANSLATIONS, type TranslationKey } from '../constants/translations';

export function useTranslation(): (key: TranslationKey) => string {
  const language = useSettingsStore((s) => s.language);
  const t = TRANSLATIONS[language];
  return (key: TranslationKey) => t[key];
}
