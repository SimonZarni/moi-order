import { useCallback, useEffect, useMemo, useState } from 'react';

import { User, ApiError } from '@/types/models';

export interface ProfileFormErrors {
  name: string | null;
  email: string | null;
  dateOfBirth: string | null;
}

export interface UseProfileFormResult {
  name: string;
  email: string;
  dateOfBirth: Date | null;
  errors: ProfileFormErrors;
  isDirty: boolean;
  handleNameChange: (text: string) => void;
  handleEmailChange: (text: string) => void;
  handleDateChange: (date: Date) => void;
  validate: () => boolean;
  applyApiError: (apiError: ApiError) => void;
  resetToUser: (user: User) => void;
}

export function useProfileForm(user: User | null): UseProfileFormResult {
  const [name, setName]               = useState(user?.name ?? '');
  const [email, setEmail]             = useState(user?.email ?? '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    user?.date_of_birth ? new Date(user.date_of_birth) : null,
  );
  const [errors, setErrors] = useState<ProfileFormErrors>({ name: null, email: null, dateOfBirth: null });

  // Re-initialise when user data first loads or changes (e.g. after refetch)
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setDateOfBirth(user.date_of_birth ? new Date(user.date_of_birth) : null);
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDirty = useMemo((): boolean => {
    if (!user) return false;
    const savedDob = user.date_of_birth ?? null;
    const formDob  = dateOfBirth
      ? `${dateOfBirth.getFullYear()}-${String(dateOfBirth.getMonth() + 1).padStart(2, '0')}-${String(dateOfBirth.getDate()).padStart(2, '0')}`
      : null;
    return name.trim() !== user.name || email.trim() !== user.email || formDob !== savedDob;
  }, [name, email, dateOfBirth, user]);

  const handleNameChange = useCallback((text: string): void => {
    setName(text);
    setErrors((prev) => ({ ...prev, name: null }));
  }, []);

  const handleEmailChange = useCallback((text: string): void => {
    setEmail(text);
    setErrors((prev) => ({ ...prev, email: null }));
  }, []);

  const handleDateChange = useCallback((date: Date): void => {
    setDateOfBirth(date);
    setErrors((prev) => ({ ...prev, dateOfBirth: null }));
  }, []);

  const validate = useCallback((): boolean => {
    const next: ProfileFormErrors = { name: null, email: null, dateOfBirth: null };
    if (!name.trim()) next.name = 'Full name is required.';
    if (!email.trim()) {
      next.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Email address must be valid.';
    }
    setErrors(next);
    return Object.values(next).every((v) => v === null);
  }, [name, email]);

  const applyApiError = useCallback((apiError: ApiError): void => {
    const fieldErrors = apiError.errors ?? {};
    setErrors({
      name:        fieldErrors['name']?.[0] ?? null,
      email:       fieldErrors['email']?.[0] ?? null,
      dateOfBirth: fieldErrors['date_of_birth']?.[0] ?? null,
    });
  }, []);

  const resetToUser = useCallback((u: User): void => {
    setName(u.name);
    setEmail(u.email);
    setDateOfBirth(u.date_of_birth ? new Date(u.date_of_birth) : null);
    setErrors({ name: null, email: null, dateOfBirth: null });
  }, []);

  return {
    name, email, dateOfBirth, errors, isDirty,
    handleNameChange, handleEmailChange, handleDateChange,
    validate, applyApiError, resetToUser,
  };
}
