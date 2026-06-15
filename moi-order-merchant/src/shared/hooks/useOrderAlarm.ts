import { useEffect, useCallback, useSyncExternalStore } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

// ── Singleton AudioContext + decoded buffer ────────────────────────────────────

export type AudioStatus = 'unsupported' | 'suspended' | 'running' | 'error';

let _ctx: AudioContext | null = null;
let _unlocked = false;
let _pendingAlarm = false; // alarm fired while context was suspended — replay on next unlock
let _audioError: string | null = null;
let _buffer: AudioBuffer | null = null;     // pre-decoded custom alarm sound
let _fetchedUrl: string | null = null;      // tracks which URL populated _buffer
const _listeners = new Set<() => void>();

function _notify(): void { _listeners.forEach((fn) => fn()); }

function _subscribe(cb: () => void): () => void {
  _listeners.add(cb);
  return () => { _listeners.delete(cb); };
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  if (!_ctx) {
    try {
      _ctx = new AudioContext();
    } catch (err) {
      _audioError = `AudioContext creation failed: ${err instanceof Error ? err.message : String(err)}`;
      _notify();
      return null;
    }
  }
  return _ctx;
}

// Plays custom buffer if available, otherwise falls back to synth beeps.
function playSound(ctx: AudioContext): void {
  if (_buffer) {
    try {
      const source = ctx.createBufferSource();
      source.buffer = _buffer;
      source.connect(ctx.destination);
      source.start();
      _audioError = null;
      _notify();
      return;
    } catch {
      // Buffer play failed — fall through to synth beeps.
    }
  }
  playBeeps(ctx);
}

function attemptUnlock(): void {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'running') {
    if (!_unlocked) { _unlocked = true; _audioError = null; _notify(); }
    if (_pendingAlarm) { _pendingAlarm = false; playSound(ctx); }
    return;
  }
  ctx.resume()
    .then(() => {
      if (ctx.state === 'running') {
        _unlocked = true;
        _audioError = null;
        _notify();
        if (_pendingAlarm) { _pendingAlarm = false; playSound(ctx); }
      } else {
        _audioError = `resume() called but state is still: ${ctx.state}`;
        _notify();
      }
    })
    .catch((err: unknown) => {
      _audioError = `AudioContext.resume() failed: ${err instanceof Error ? err.message : String(err)}`;
      _notify();
    });
}

// ── Synth beep fallback ────────────────────────────────────────────────────────

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
  try {
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
    _audioError = null;
    _notify();
  } catch (err) {
    _audioError = `playBeeps failed: ${err instanceof Error ? err.message : String(err)}`;
    _notify();
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseOrderAlarmResult {
  isEnabled: boolean;
  isUnlocked: boolean;
  audioStatus: AudioStatus;
  audioError: string | null;
  toggleEnabled: () => void;
  triggerAlarm: () => void;
  unlockAudio: () => void;
}

export function useOrderAlarm(): UseOrderAlarmResult {
  const isEnabled       = useSettingsStore((s) => s.alarmEnabled);
  const setAlarmEnabled = useSettingsStore((s) => s.setAlarmEnabled);
  const alarmSoundUrl   = useSettingsStore((s) => s.alarmSoundUrl);

  const isUnlocked = useSyncExternalStore(_subscribe, () => _unlocked, () => false);
  const audioError = useSyncExternalStore(_subscribe, () => _audioError, () => null);

  const audioStatus = useSyncExternalStore(_subscribe, (): AudioStatus => {
    if (typeof window === 'undefined' || !('AudioContext' in window)) return 'unsupported';
    if (_audioError) return 'error';
    if (_unlocked) return 'running';
    return 'suspended';
  }, () => 'suspended' as AudioStatus);

  // Pre-fetch and decode the admin-uploaded alarm sound when the URL arrives.
  useEffect(() => {
    if (!alarmSoundUrl || alarmSoundUrl === _fetchedUrl) return;
    const ctx = getCtx();
    if (!ctx) return;

    let cancelled = false;
    fetch(alarmSoundUrl)
      .then((res) => res.arrayBuffer())
      .then((ab)  => ctx.decodeAudioData(ab))
      .then((buf) => {
        if (!cancelled) {
          _buffer     = buf;
          _fetchedUrl = alarmSoundUrl;
        }
      })
      .catch(() => {
        // Fetch/decode failed — silently fall back to synth beeps.
      });

    return () => { cancelled = true; };
  }, [alarmSoundUrl]);

  // Clear the buffer when the admin removes the alarm sound.
  useEffect(() => {
    if (alarmSoundUrl === null) {
      _buffer     = null;
      _fetchedUrl = null;
    }
  }, [alarmSoundUrl]);

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

  const unlockAudio = useCallback(() => { attemptUnlock(); }, []);

  const triggerAlarm = useCallback(() => {
    if (!isEnabled) return;
    const ctx = getCtx();
    if (!ctx) {
      _pendingAlarm = true;
      return;
    }
    if (ctx.state === 'running') {
      playSound(ctx);
    } else {
      _pendingAlarm = true;
      ctx.resume()
        .then(() => {
          if (ctx.state === 'running') {
            _pendingAlarm = false;
            playSound(ctx);
          }
        })
        .catch((err: unknown) => {
          _audioError = `triggerAlarm resume failed: ${err instanceof Error ? err.message : String(err)}`;
          _notify();
        });
    }
  }, [isEnabled]);

  const toggleEnabled = useCallback(() => {
    setAlarmEnabled(!isEnabled);
  }, [isEnabled, setAlarmEnabled]);

  return { isEnabled, isUnlocked, audioStatus, audioError, toggleEnabled, triggerAlarm, unlockAudio };
}
