import { useState, useCallback } from 'react';
import { registerMerchant } from '../../../api/auth';
import { useAuthStore } from '../../../store/authStore';
import { extractApiError } from '../../../api/client';

interface UseRegisterScreenResult {
  name: string;
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handleSubmit: () => Promise<void>;
}

export function useRegisterScreen(): UseRegisterScreenResult {
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !email.trim() || !password) return;
    setIsLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const { user, token } = await registerMerchant(
        name.trim(),
        email.trim(),
        password,
      );
      setAuth(user, token);
    } catch (e) {
      const apiError = extractApiError(e);
      setError(apiError.message);
      if (apiError.errors) {
        const flat: Record<string, string> = {};
        for (const [field, msgs] of Object.entries(apiError.errors)) {
          flat[field] = msgs[0] ?? '';
        }
        setFieldErrors(flat);
      }
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, setAuth]);

  return {
    name,
    email,
    password,
    isLoading,
    error,
    fieldErrors,
    setName,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
