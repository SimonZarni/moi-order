import { useCallback, useEffect, useMemo, useState } from 'react';

import { User, ApiError } from '@/types/models';

// Principle: SRP — form state only. No API calls, no navigation.
// Principle: ISP — returns only what the screen and coordinator need.

/** LINE ID rules mirror the backend regex: 4-20 chars, [a-zA-Z0-9._-] only. */
const LINE_HANDLE_REGEX = /^[a-zA-Z0-9._-]+$/;

export interface ProfileFormErrors {
  name:       string | null;
  dateOfBirth: string | null;
  lineHandle:  string | null;
}

export interface UseProfileFormResult {
  name:        string;
  dateOfBirth: Date | null;
  lineHandle:  string;
  errors:      ProfileFormErrors;
  isDirty:     boolean;
  handleNameChange:       (text: string) => void;
  handleDateChange:       (date: Date)   => void;
  handleLineHandleChange: (text: string) => void;
  validate:      () => boolean;
  applyApiError: (apiError: ApiError) => void;
  resetToUser:   (user: User) => void;
}

export function useProfileForm(user: User | null): UseProfileFormResult {
  const [name, setName]               = useState(user?.name ?? '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    user?.date_of_birth ? new Date(user.date_of_birth) : null,
  );
  // lineHandle is a plain string; user can type with or without leading "@".
  // The backend strips "@" in prepareForValidation(), so we send the raw value.
  const [lineHandle, setLineHandle] = useState<string>(user?.line_handle ?? '');
  const [errors, setErrors] = useState<ProfileFormErrors>({
    name:        null,
    dateOfBirth: null,
    lineHandle:  null,
  });

  // Reset form when a different user loads (e.g., after re-login).
  useEffect(() => {
    if (user) {
      setName(user.name);
      setDateOfBirth(user.date_of_birth ? new Date(user.date_of_birth) : null);
      setLineHandle(user.line_handle ?? '');
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDirty = useMemo((): boolean => {
    if (!user) return false;
    const savedDob = user.date_of_birth ?? null;
    const formDob  = dateOfBirth
      ? `${dateOfBirth.getFullYear()}-${String(dateOfBirth.getMonth() + 1).padStart(2, '0')}-${String(dateOfBirth.getDate()).padStart(2, '0')}`
      : null;
    const savedHandle = user.line_handle ?? '';
    return (
      name.trim()         !== user.name ||
      formDob             !== savedDob  ||
      lineHandle.trim()   !== savedHandle
    );
  }, [name, dateOfBirth, lineHandle, user]);

  const handleNameChange = useCallback((text: string): void => {
    setName(text);
    setErrors((prev) => ({ ...prev, name: null }));
  }, []);

  const handleDateChange = useCallback((date: Date): void => {
    setDateOfBirth(date);
    setErrors((prev) => ({ ...prev, dateOfBirth: null }));
  }, []);

  const handleLineHandleChange = useCallback((text: string): void => {
    setLineHandle(text);
    setErrors((prev) => ({ ...prev, lineHandle: null }));
  }, []);

  const validate = useCallback((): boolean => {
    const next: ProfileFormErrors = { name: null, dateOfBirth: null, lineHandle: null };

    if (!name.trim()) {
      next.name = 'Full name is required.';
    }

    const normalized = lineHandle.replace(/^@/, '').trim();
    if (normalized !== '') {
      if (normalized.length < 4) {
        next.lineHandle = 'LINE ID must be at least 4 characters.';
      } else if (normalized.length > 20) {
        next.lineHandle = 'LINE ID must be at most 20 characters.';
      } else if (!LINE_HANDLE_REGEX.test(normalized)) {
        next.lineHandle = 'LINE ID may only contain letters, numbers, dots, hyphens, and underscores.';
      }
    }

    setErrors(next);
    return Object.values(next).every((v) => v === null);
  }, [name, lineHandle]);

  const applyApiError = useCallback((apiError: ApiError): void => {
    const fieldErrors = apiError.errors ?? {};
    setErrors({
      name:        fieldErrors['name']?.[0]        ?? null,
      dateOfBirth: fieldErrors['date_of_birth']?.[0] ?? null,
      lineHandle:  fieldErrors['line_handle']?.[0]   ?? null,
    });
  }, []);

  const resetToUser = useCallback((u: User): void => {
    setName(u.name);
    setDateOfBirth(u.date_of_birth ? new Date(u.date_of_birth) : null);
    setLineHandle(u.line_handle ?? '');
    setErrors({ name: null, dateOfBirth: null, lineHandle: null });
  }, []);

  return {
    name, dateOfBirth, lineHandle, errors, isDirty,
    handleNameChange, handleDateChange, handleLineHandleChange,
    validate, applyApiError, resetToUser,
  };
}
