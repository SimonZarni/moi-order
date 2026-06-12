import { useState, useCallback, useMemo, useEffect } from 'react';
import { useOperatingHoursData } from './useOperatingHoursData';
import type { OpeningHourInput } from '../../../api/restaurant';

const DEFAULT_HOURS: OpeningHourInput[] = Array.from({ length: 7 }, (_, i) => ({
  day_of_week: i,
  opens_at: '09:00',
  closes_at: '22:00',
  is_closed: false,
}));

export interface UseOperatingHoursScreenResult {
  isLoading: boolean;
  isSaving: boolean;
  hoursInput: OpeningHourInput[];
  error: string | null;
  handleHourChange: (dayOfWeek: number, field: 'opens_at' | 'closes_at', value: string) => void;
  handleHourToggle: (dayOfWeek: number, isClosed: boolean) => void;
  handleSave: () => void;
  handleClearError: () => void;
}

export function useOperatingHoursScreen(): UseOperatingHoursScreenResult {
  const { restaurant, isLoading, isSaving, saveError, saveHours, clearSaveError } = useOperatingHoursData();

  const hoursFromServer = useMemo((): OpeningHourInput[] => {
    if (!restaurant?.opening_hours?.length) return DEFAULT_HOURS;
    return DEFAULT_HOURS.map((def) => {
      const existing = restaurant.opening_hours?.find((h) => h.day_of_week === def.day_of_week);
      return existing ? { ...existing } : def;
    });
  }, [restaurant]);

  const [hoursInput, setHoursInput] = useState<OpeningHourInput[]>(DEFAULT_HOURS);

  useEffect(() => {
    setHoursInput(hoursFromServer);
  }, [hoursFromServer]);

  const handleHourChange = useCallback((dayOfWeek: number, field: 'opens_at' | 'closes_at', value: string) => {
    setHoursInput((prev) =>
      prev.map((h) => h.day_of_week === dayOfWeek ? { ...h, [field]: value } : h),
    );
  }, []);

  const handleHourToggle = useCallback((dayOfWeek: number, isClosed: boolean) => {
    setHoursInput((prev) =>
      prev.map((h) => h.day_of_week === dayOfWeek ? { ...h, is_closed: isClosed } : h),
    );
  }, []);

  const handleSave = useCallback(() => {
    const normalizeTime = (t: string | null): string | null => {
      if (!t) return null;
      const parts = t.split(':');
      const h = parts[0];
      const m = parts[1];
      if (!h || !m) return t;
      return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    };
    const normalized = hoursInput.map((h) => ({
      ...h,
      opens_at:  h.is_closed ? null : normalizeTime(h.opens_at),
      closes_at: h.is_closed ? null : normalizeTime(h.closes_at),
    }));
    saveHours(normalized);
  }, [hoursInput, saveHours]);

  return {
    isLoading,
    isSaving,
    hoursInput,
    error: saveError,
    handleHourChange,
    handleHourToggle,
    handleSave,
    handleClearError: clearSaveError,
  };
}
