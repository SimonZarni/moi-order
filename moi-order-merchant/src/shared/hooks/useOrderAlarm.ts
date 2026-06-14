import { useEffect, useRef, useCallback, useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

// Three double-beeps: [startSec, endSec]
const BEEP_PATTERN: Array<[number, number]> = [
  [0.000, 0.100],
  [0.175, 0.280],
  [0.520, 0.620],
  [0.695, 0.800],
  [1.040, 1.140],
  [1.215, 1.320],
];

const FREQ = 880;   // Hz — high A5, cuts through kitchen noise
const GAIN = 0.30;  // volume 0–1

export interface UseOrderAlarmResult {
  isEnabled: boolean;
  isUnlocked: boolean;
  toggleEnabled: () => void;
  triggerAlarm: () => void;
  unlockAudio: () => void;
}

export function useOrderAlarm(): UseOrderAlarmResult {
  const isEnabled      = useSettingsStore((s) => s.alarmEnabled);
  const setAlarmEnabled = useSettingsStore((s) => s.setAlarmEnabled);

  const ctxRef = useRef<AudioContext | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const unlockAudio = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume()
        .then(() => setIsUnlocked(ctx.state === 'running'))
        .catch(() => {});
    } else {
      setIsUnlocked(true);
    }
  }, [getCtx]);

  // Auto-unlock on first user gesture anywhere on the page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => unlockAudio();
    window.addEventListener('click',   handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => {
      window.removeEventListener('click',   handler);
      window.removeEventListener('keydown', handler);
    };
  }, [unlockAudio]);

  const triggerAlarm = useCallback(() => {
    if (!isEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;

    const play = () => {
      setIsUnlocked(true);
      const now = ctx.currentTime;
      for (const [start, end] of BEEP_PATTERN) {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.value = FREQ;
        // Tiny 5ms ramps to avoid clicks at note boundaries
        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(GAIN, now + start + 0.005);
        gain.gain.setValueAtTime(GAIN, now + end - 0.005);
        gain.gain.linearRampToValueAtTime(0, now + end);
        osc.start(now + start);
        osc.stop(now + end);
      }
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(play).catch(() => {});
    } else {
      play();
    }
  }, [isEnabled, getCtx]);

  const toggleEnabled = useCallback(() => {
    setAlarmEnabled(!isEnabled);
  }, [isEnabled, setAlarmEnabled]);

  return { isEnabled, isUnlocked, toggleEnabled, triggerAlarm, unlockAudio };
}
