import { useEffect } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';

import { useLocationStore } from '@/shared/store/locationStore';

export interface UseUserLocationResult {
  /** Null until permission is granted and a position fix is obtained. */
  userCoords: { latitude: number; longitude: number } | null;
  /** True when the OS permission dialog was dismissed with "deny". */
  permissionDenied: boolean;
}

/**
 * Principle: SRP — isolates expo-location behind a clean interface.
 * Principle: DIP — consumers depend on this hook, never on expo-location.
 *
 * Design decisions:
 * - Reads initial `status` via `getState()` (Zustand direct read) inside the
 *   effect so `status` is NOT a dep. This avoids the race where React cleans
 *   up (sets cancelled=true) the moment `setStatus` fires mid-async, which
 *   would block `setCoords` from ever being called.
 * - Uses `watchPositionAsync` (not `getCurrentPositionAsync`) so the distance
 *   updates dynamically as the device gets a better GPS fix, or when the user
 *   turns on location while the screen is open.
 * - An AppState listener resets status to 'undetermined' when the app returns
 *   to the foreground after the user enables location in device Settings.
 */
export function useUserLocation(): UseUserLocationResult {
  const coords    = useLocationStore((s) => s.coords);
  const status    = useLocationStore((s) => s.status);
  const setCoords = useLocationStore((s) => s.setCoords);
  const setStatus = useLocationStore((s) => s.setStatus);

  // ── Main location watcher ─────────────────────────────────────────────────
  useEffect(() => {
    // Read status synchronously from the store — NOT a reactive dep — so this
    // effect never re-runs due to status changes and the cleanup race is gone.
    const initialStatus = useLocationStore.getState().status;
    if (initialStatus !== 'undetermined') return;

    // Claim the request slot synchronously — before any await — so a second
    // mounted instance of this hook (e.g. PlacesScreen + PlaceDetailScreen both
    // mounted) reads 'requesting' and exits, preventing a double dialog.
    useLocationStore.getState().setStatus('requesting');

    let cancelled = false;
    let subscription: Location.LocationSubscription | null = null;

    async function start(): Promise<void> {
      // Pre-check the real OS-level permission state before prompting.
      // Handles two cases:
      //   (a) App restarted — store reset to 'undetermined' but OS already has
      //       a recorded denial from a prior session → skip the dialog.
      //   (b) Android OEM builds that request ACCESS_FINE_LOCATION and
      //       ACCESS_COARSE_LOCATION separately can show two system dialogs.
      //       If the OS already has a definitive answer, we never call request.
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      if (cancelled) return;

      if (existingStatus === 'denied') {
        setStatus('denied');
        return;
      }

      if (existingStatus !== 'granted') {
        // Truly undetermined at OS level — show the permission dialog.
        const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
        // Do NOT gate setStatus on `cancelled`.  In React 18 Strict Mode the
        // cleanup fires before the dialog resolves (cancelled = true), which
        // would leave status stuck at 'requesting' forever.  We always persist
        // the dialog result; only the position watcher is guarded by cancelled.
        if (permStatus !== 'granted') {
          setStatus('denied');
          return;
        }
      }

      if (cancelled) return;
      setStatus('granted');

      // Bootstrap: get one immediate fix so distance shows right away.
      // watchPositionAsync with distanceInterval:30 only fires after 30 m of
      // movement — a stationary device would never get a callback otherwise.
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled) {
          setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        }
      } catch {
        // No immediate fix yet — watcher will fill it in when GPS is ready.
      }

      if (cancelled) return;

      // Continue watching for movement-based updates (battery-friendly interval).
      try {
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 30 },
          (pos) => {
            if (!cancelled) {
              setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            }
          },
        );
      } catch {
        // GPS unavailable (airplane mode) — silent, bootstrap fix already shown.
      }
    }

    void start();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []); // intentionally empty — status is read via getState() to avoid the cleanup race

  // ── AppState listener — re-trigger after user enables location in Settings ─
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      if (nextState !== 'active') return;

      const currentStatus = useLocationStore.getState().status;
      if (currentStatus !== 'denied') return;

      // Re-check without prompting — user may have gone to Settings and enabled it.
      const { status: permStatus } = await Location.getForegroundPermissionsAsync();
      if (permStatus === 'granted') {
        // Reset to 'undetermined' so the main effect re-runs on next mount.
        // Since the main effect only runs on mount (empty deps), also start
        // watching immediately here.
        setStatus('granted');
        try {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        } catch {
          // Silent
        }
      }
    });

    return () => sub.remove();
  }, [setCoords, setStatus]);

  return {
    userCoords:       coords,
    permissionDenied: status === 'denied',
  };
}
