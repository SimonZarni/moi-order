import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const NOTICE_DATE_KEY = 'notice_last_shown_date';

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface UseNoticeModalResult {
  isVisible: boolean;
  dismiss: () => void;
}

export function useNoticeModal(): UseNoticeModalResult {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function check(): Promise<void> {
      try {
        const stored = await SecureStore.getItemAsync(NOTICE_DATE_KEY);
        if (stored !== todayString()) {
          setIsVisible(true);
        }
      } catch {
        setIsVisible(true);
      }
    }
    void check();
  }, []);

  function dismiss(): void {
    SecureStore.setItemAsync(NOTICE_DATE_KEY, todayString()).catch(() => {});
    setIsVisible(false);
  }

  return { isVisible, dismiss };
}
