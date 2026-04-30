/**
 * Formats a stored phone number (digits only, with country code) into a
 * human-readable international format.
 *
 * Thailand (+66): 66XXXXXXXXX (11 digits) → +(66) XX XXX XXXX
 * Generic international: prepends + and returns as-is.
 */
export function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');

  // Thailand: 66 + 9 local digits = 11 total
  if (digits.startsWith('66') && digits.length === 11) {
    const local = digits.slice(2); // 9 digits, e.g. 641385441
    return `+(66) ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
  }

  // Other international numbers stored with country code
  if (digits.length > 10) {
    return `+${digits}`;
  }

  return raw;
}
