/**
 * Principle: SRP — manages order alarm audio for the merchant dashboard.
 *
 * AudioContext is a module-level singleton so every useOrderAlarm() call shares
 * the same context. This means clicking the alarm button in the sidebar (one
 * component) also unlocks the context used by WebSocketManager (another component)
 * when triggerAlarm() is eventually called.
 *
 * Browser autoplay policy: AudioContext starts suspended until a user gesture
 * calls resume(). We attempt resume() on any click/keydown/pointerdown on the
 * page. Once running it stays running for the life of the tab.
 */
import { useEffect, useCallback, useSyncExternalStore } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

// ── Singleton AudioContext ─────────────────────────────────────────────────────

let _ctx: AudioContext | null = null;
let _unlocked = false;
const _listeners = new Set<() => void>();

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  if (!_ctx) _ctx = new AudioContext();
  return _ctx;
}

function notifyListeners(): void {
  _listeners.forEach((fn) => fn());
}

function attemptUnlock(): void {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'running') {
    if (!_unlocked) { _unlocked = true; notifyListeners(); }
    return;
  }
  ctx.resume().then(() => {
    if (ctx.state === 'running' && !_unlocked) {
      _unlocked = true;
      notifyListeners();
    }
  }).catch(() => {});
}

// ── Alarm pattern ─────────────────────────────────────────────────────────────

const BEEP_PATTERN: Array<[number, number]> = [
  [0.000, 0.100],
  [0.175, 0.280],
  [0.520, 0.620],
  [0.695, 0.800],
  [1.040, 1.140],
  [1.215, 1.320],
];

const FREQ = 880;
const GAIN = 0.30;

function playBeeps(ctx: AudioContext): void {
  const now = ctx.currentTime;
  for (const [start, end] of BEEP_PATTERN) {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.value = FREQ;
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(GAIN, now + start + 0.005);
    gain.gain.setValueAtTime(GAIN, now + end - 0.005);
    gain.gain.linearRampToValueAtTime(0, now + end);
    osc.start(now + start);
    osc.stop(now + end);
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseOrderAlarmResult {
  isEnabled: boolean;
  isUnlocked: boolean;
  toggleEnabled: () => void;
  triggerAlarm: () => void;
  unlockAudio: () => void;
}

export function useOrderAlarm(): UseOrderAlarmResult {
  const isEnabled       = useSettingsStore((s) => s.alarmEnabled);
  const setAlarmEnabled = useSettingsStore((s) => s.setAlarmEnabled);

  // Subscribe to the module-level _unlocked flag so all hook instances
  // re-render together when the AudioContext becomes running.
  const isUnlocked = useSyncExternalStore(
    (onStoreChange) => {
      _listeners.add(onStoreChange);
      return () => { _listeners.delete(onStoreChange); };
    },
    () => _unlocked,
    () => false,
  );

  // Attach unlock listeners on mount — any user gesture unlocks the singleton.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => attemptUnlock();
    window.addEventListener('click',       handler);
    window.addEventListener('keydown',     handler);
    window.addEventListener('pointerdown', handler);
    return () => {
      window.removeEventListener('click',       handler);
      window.removeEventListener('keydown',     handler);
      window.removeEventListener('pointerdown', handler);
    };
  }, []);

  const unlockAudio = useCallback(() => {
    attemptUnlock();
  }, []);

  const triggerAlarm = useCallback(() => {
    if (!isEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'running') {
      playBeeps(ctx);
    } else {
      ctx.resume().then(() => { if (ctx.state === 'running') playBeeps(ctx); }).catch(() => {});
    }
  }, [isEnabled]);

  const toggleEnabled = useCallback(() => {
    setAlarmEnabled(!isEnabled);
  }, [isEnabled, setAlarmEnabled]);

  return { isEnabled, isUnlocked, toggleEnabled, triggerAlarm, unlockAudio };
}
