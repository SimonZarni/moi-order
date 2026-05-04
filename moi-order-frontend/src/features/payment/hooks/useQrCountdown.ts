import { useEffect, useRef, useState } from 'react';

interface UseQrCountdownResult {
  secondsLeft: number;
  countdownLabel: string;
  isExpired: boolean;
}

function secondsUntil(iso: string): number {
  return Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 1000));
}

/**
 * Ticks every second. Calls onExpired() exactly once when the countdown reaches 0.
 * Resets automatically when expiresAt changes (i.e. a fresh QR is generated).
 */
export function useQrCountdown(
  expiresAt: string | null | undefined,
  onExpired: () => void,
): UseQrCountdownResult {
  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    expiresAt ? secondsUntil(expiresAt) : 0,
  );
  const onExpiredRef = useRef(onExpired);
  const firedRef     = useRef(false);

  useEffect(() => { onExpiredRef.current = onExpired; }, [onExpired]);

  useEffect(() => {
    if (!expiresAt) return;
    firedRef.current = false;
    setSecondsLeft(secondsUntil(expiresAt));

    const id = setInterval(() => {
      const secs = secondsUntil(expiresAt);
      setSecondsLeft(secs);
      if (secs === 0 && !firedRef.current) {
        firedRef.current = true;
        onExpiredRef.current();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const mm    = Math.floor(secondsLeft / 60);
  const ss    = secondsLeft % 60;
  const label = expiresAt
    ? `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
    : '';

  return { secondsLeft, countdownLabel: label, isExpired: !!expiresAt && secondsLeft === 0 };
}
