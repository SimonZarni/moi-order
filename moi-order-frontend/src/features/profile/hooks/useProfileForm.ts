import { useCallback, useEffect, useMemo, useState } from 'react';

import { User, ApiError } from '@/types/models';

export interface ProfileFormErrors {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
}

export interface UseProfileFormResult {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date | null;
  errors: ProfileFormErrors;
  isDirty: boolean;
  handleNameChange: (text: string) => void;
  handleEmailChange: (text: string) => void;
  handlePhoneNumberChange: (text: string) => void;
  handleDateChange: (date: Date) => void;
  validate: () => boolean;
  applyApiError: (apiError: ApiError) => void;
  resetToUser: (user: User) => void;
}

export function useProfileForm(user: User | null): UseProfileFormResult {
  const [name, setName]               = useState(user?.name ?? '');
  const [email, setEmail]             = useState(user?.email ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number ?? '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    user?.date_of_birth ? new Date(user.date_of_birth) : null,
  );
  const [errors, setErrors] = useState<ProfileFormErrors>({ name: null, email: null, phoneNumber: null, dateOfBirth: null });

  // Re-initialise when user data first loads or changes (e.g. after refetch)
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhoneNumber(user.phone_number ?? '');
      setDateOfBirth(user.date_of_birth ? new Date(user.date_of_birth) : null);
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDirty = useMemo((): boolean => {
    if (!user) return false;
    const savedDob = user.date_of_birth ?? null;
    const formDob  = dateOfBirth
      ? `${dateOfBirth.getFullYear()}-${String(dateOfBirth.getMonth() + 1).padStart(2, '0')}-${String(dateOfBirth.getDate()).padStart(2, '0')}`
      : null;
    return name.trim() !== user.name
      || email.trim() !== user.email
      || phoneNumber.trim() !== (user.phone_number ?? '')
      || formDob !== savedDob;
  }, [name, email, phoneNumber, dateOfBirth, user]);

  const handleNameChange = useCallback((text: string): void => {
    setName(text);
    setErrors((prev) => ({ ...prev, name: null }));
  }, []);

  const handleEmailChange = useCallback((text: string): void => {
    setEmail(text);
    setErrors((prev) => ({ ...prev, email: null }));
  }, []);

  const handlePhoneNumberChange = useCallback((text: string): void => {
    setPhoneNumber(text);
    setErrors((prev) => ({ ...prev, phoneNumber: null }));
  }, []);

  const handleDateChange = useCallback((date: Date): void => {
    setDateOfBirth(date);
    setErrors((prev) => ({ ...prev, dateOfBirth: null }));
  }, []);

  const validate = useCallback((): boolean => {
    const next: ProfileFormErrors = { name: null, email: null, phoneNumber: null, dateOfBirth: null };
    if (!name.trim()) next.name = 'Full name is required.';
    if (!email.trim()) {
      next.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Email address must be valid.';
    }
    if (phoneNumber.trim() !== '' && !/^(\+?66|0)[0-9]{9}$/.test(phoneNumber.replace(/\s+/g, ''))) {
      next.phoneNumber = 'Enter a valid Thai mobile number.';
    }
    setErrors(next);
    return Object.values(next).every((v) => v === null);
  }, [name, email, phoneNumber]);

  const applyApiError = useCallback((apiError: ApiError): void => {
    const fieldErrors = apiError.errors ?? {};
    setErrors({
      name:        fieldErrors['name']?.[0] ?? null,
      email:       fieldErrors['email']?.[0] ?? null,
      phoneNumber: fieldErrors['phone_number']?.[0] ?? null,
      dateOfBirth: fieldErrors['date_of_birth']?.[0] ?? null,
    });
  }, []);

  const resetToUser = useCallback((u: User): void => {
    setName(u.name);
    setEmail(u.email);
    setPhoneNumber(u.phone_number ?? '');
    setDateOfBirth(u.date_of_birth ? new Date(u.date_of_birth) : null);
    setErrors({ name: null, email: null, phoneNumber: null, dateOfBirth: null });
  }, []);

  return {
    name, email, phoneNumber, dateOfBirth, errors, isDirty,
    handleNameChange, handleEmailChange, handlePhoneNumberChange, handleDateChange,
    validate, applyApiError, resetToUser,
  };
}
