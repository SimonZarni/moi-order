import { useState, useCallback, useMemo, useEffect } from 'react';
import { useOperatingHoursData } from './useOperatingHoursData';
import type { OpeningHourInput, SessionInput } from '../../../api/restaurant';
import type { OpeningHourSession } from '../../../types/models';

const MAX_SESSIONS = 4;

const DEFAULT_HOURS: OpeningHourInput[] = Array.from({ length: 7 }, (_, i) => ({
  day_of_week: i,
  is_closed: false,
  sessions: [{ opens_at: '09:00', closes_at: '22:00' }],
}));

export interface UseOperatingHoursScreenResult {
  isLoading: boolean;
  isSaving: boolean;
  hoursInput: OpeningHourInput[];
  error: string | null;
  /** Returns the server-side opening_hour row for a given (dayOfWeek, sortIndex), or null if not yet saved. */
  getSessionHour: (dayOfWeek: number, sortIndex: number) => OpeningHourSession | null;
  handleToggleClosed: (dayOfWeek: number, isClosed: boolean) => void;
  handleSessionChange: (dayOfWeek: number, index: number, field: keyof SessionInput, value: string) => void;
  handleAddSession: (dayOfWeek: number) => void;
  handleRemoveSession: (dayOfWeek: number, index: number) => void;
  handleSave: () => void;
  handleClearError: () => void;
}

export function useOperatingHoursScreen(): UseOperatingHoursScreenResult {
  const { restaurant, isLoading, isSaving, saveError, saveHours, clearSaveError } = useOperatingHoursData();

  const hoursFromServer = useMemo((): OpeningHourInput[] => {
    if (!restaurant?.opening_hours?.length) return DEFAULT_HOURS;
    return DEFAULT_HOURS.map((def) => {
      const existing = restaurant.opening_hours?.find((h) => h.day_of_week === def.day_of_week);
      if (!existing) return def;
      return {
        day_of_week: existing.day_of_week,
        is_closed: existing.is_closed,
        sessions: existing.is_closed
          ? [{ opens_at: '09:00', closes_at: '22:00' }]
          : existing.sessions.map((s) => ({ opens_at: s.opens_at, closes_at: s.closes_at })),
      };
    });
  }, [restaurant]);

  const [hoursInput, setHoursInput] = useState<OpeningHourInput[]>(DEFAULT_HOURS);

  useEffect(() => {
    setHoursInput(hoursFromServer);
  }, [hoursFromServer]);

  const handleToggleClosed = useCallback((dayOfWeek: number, isClosed: boolean) => {
    setHoursInput((prev) =>
      prev.map((h) => h.day_of_week === dayOfWeek ? { ...h, is_closed: isClosed } : h),
    );
  }, []);

  const handleSessionChange = useCallback(
    (dayOfWeek: number, index: number, field: keyof SessionInput, value: string) => {
      setHoursInput((prev) =>
        prev.map((h) => {
          if (h.day_of_week !== dayOfWeek) return h;
          const sessions = h.sessions.map((s, i) => i === index ? { ...s, [field]: value } : s);
          return { ...h, sessions };
        }),
      );
    },
    [],
  );

  const handleAddSession = useCallback((dayOfWeek: number) => {
    setHoursInput((prev) =>
      prev.map((h) => {
        if (h.day_of_week !== dayOfWeek || h.sessions.length >= MAX_SESSIONS) return h;
        const last = h.sessions[h.sessions.length - 1];
        return {
          ...h,
          sessions: [...h.sessions, { opens_at: last?.closes_at ?? '09:00', closes_at: '22:00' }],
        };
      }),
    );
  }, []);

  const handleRemoveSession = useCallback((dayOfWeek: number, index: number) => {
    setHoursInput((prev) =>
      prev.map((h) => {
        if (h.day_of_week !== dayOfWeek || h.sessions.length <= 1) return h;
        return { ...h, sessions: h.sessions.filter((_, i) => i !== index) };
      }),
    );
  }, []);

  const handleSave = useCallback(() => {
    const normalizeTime = (t: string): string => {
      const parts = t.split(':');
      const hr  = parts[0] ?? '00';
      const min = parts[1] ?? '00';
      return `${hr.padStart(2, '0')}:${min.padStart(2, '0')}`;
    };
    const normalized: OpeningHourInput[] = hoursInput.map((h) => ({
      day_of_week: h.day_of_week,
      is_closed: h.is_closed,
      sessions: h.is_closed ? [] : h.sessions.map((s) => ({
        opens_at:  normalizeTime(s.opens_at),
        closes_at: normalizeTime(s.closes_at),
      })),
    }));
    saveHours(normalized);
  }, [hoursInput, saveHours]);

  const getSessionHour = useCallback(
    (dayOfWeek: number, sortIndex: number): OpeningHourSession | null => {
      const serverDay = restaurant?.opening_hours?.find((h) => h.day_of_week === dayOfWeek);
      return serverDay?.sessions.find((s) => s.sort_order === sortIndex) ?? null;
    },
    [restaurant],
  );

  return {
    isLoading,
    isSaving,
    hoursInput,
    error: saveError,
    getSessionHour,
    handleToggleClosed,
    handleSessionChange,
    handleAddSession,
    handleRemoveSession,
    handleSave,
    handleClearError: clearSaveError,
  };
}
