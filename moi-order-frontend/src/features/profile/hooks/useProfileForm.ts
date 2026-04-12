import { useCallback, useEffect, useMemo, useState } from 'react';

import { User, ApiError } from '@/types/models';

export interface ProfileFormErrors {
  name: string | null;
  dateOfBirth: string | null;
}

export interface UseProfileFormResult {
  name: string;
  dateOfBirth: Date | null;
  errors: ProfileFormErrors;
  isDirty: boolean;
  handleNameChange: (text: string) => void;
  handleDateChange: (date: Date) => void;
  validate: () => boolean;
  applyApiError: (apiError: ApiError) => void;
  resetToUser: (user: User) => void;
}

export function useProfileForm(user: User | null): UseProfileFormResult {
  const [name, setName]               = useState(user?.name ?? '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    user?.date_of_birth ? new Date(user.date_of_birth) : null,
  );
  const [errors, setErrors] = useState<ProfileFormErrors>({ name: null, dateOfBirth: null });

  // Re-initialise when user data first loads or changes (e.g. after refetch)
  useEffect(() => {
    if (user) {
      setName(user.name);
      setDateOfBirth(user.date_of_birth ? new Date(user.date_of_birth) : null);
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDirty = useMemo((): boolean => {
    if (!user) return false;
    const savedDob = user.date_of_birth ?? null;
    const formDob  = dateOfBirth
      ? `${dateOfBirth.getFullYear()}-${String(dateOfBirth.getMonth() + 1).padStart(2, '0')}-${String(dateOfBirth.getDate()).padStart(2, '0')}`
      : null;
    return name.trim() !== user.name || formDob !== savedDob;
  }, [name, dateOfBirth, user]);

  const handleNameChange = useCallback((text: string): void => {
    setName(text);
    setErrors((prev) => ({ ...prev, name: null }));
  }, []);

  const handleDateChange = useCallback((date: Date): void => {
    setDateOfBirth(date);
    setErrors((prev) => ({ ...prev, dateOfBirth: null }));
  }, []);

  const validate = useCallback((): boolean => {
    const next: ProfileFormErrors = { name: null, dateOfBirth: null };
    if (!name.trim()) next.name = 'Full name is required.';
    setErrors(next);
    return Object.values(next).every((v) => v === null);
  }, [name]);

  const applyApiError = useCallback((apiError: ApiError): void => {
    const fieldErrors = apiError.errors ?? {};
    setErrors({
      name:        fieldErrors['name']?.[0] ?? null,
      dateOfBirth: fieldErrors['date_of_birth']?.[0] ?? null,
    });
  }, []);

  const resetToUser = useCallback((u: User): void => {
    setName(u.name);
    setDateOfBirth(u.date_of_birth ? new Date(u.date_of_birth) : null);
    setErrors({ name: null, dateOfBirth: null });
  }, []);

  return {
    name, dateOfBirth, errors, isDirty,
    handleNameChange, handleDateChange,
    validate, applyApiError, resetToUser,
  };
}
