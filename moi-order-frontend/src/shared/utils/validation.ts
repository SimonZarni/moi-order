/**
 * Principle: SRP — pure validation functions (zero React, zero state).
 * These are UX helpers only; the server always re-validates.
 */

export function required(value: string, label: string): string | undefined {
  return value.trim().length === 0 ? `${label} is required.` : undefined;
}

export function minLength(value: string, min: number, label: string): string | undefined {
  return value.trim().length < min
    ? `${label} must be at least ${min} characters.`
    : undefined;
}

export function isValidEmail(value: string): string | undefined {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_RE.test(value) ? undefined : 'Please enter a valid email address.';
}
