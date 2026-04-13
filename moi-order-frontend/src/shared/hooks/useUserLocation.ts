import { useEffect } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';

import { useLocationStore } from '@/shared/store/locationStore';

export interface UseUserLocationResult {
  /** Null until location is available and a position fix is obtained. */
  userCoords: { latitude: number; longitude: number } | null;
}

/**
 * Principle: SRP — isolates expo-location behind a clean interface.
 * Principle: DIP — consumers depend on this hook, never on expo-location.
 *
 * Design decisions:
 * - Never prompts for permission. Distances appear automatically when the
 *   device already has location access granted; otherwise the field is simply
 *   absent — no dialog, no banner, no friction.
 * - Reads initial `status` via `getState()` (Zustand direct read) inside the
 *   effect so `status` is NOT a dep, avoiding the cleanup race where React
 *   sets cancelled=true the moment `setStatus` fires mid-async.
 * - Uses `watchPositionAsync` so the distance updates dynamically as GPS
 *   improves or the user starts moving.
 * - An AppState listener re-checks when the app returns to the foreground so
 *   distances appear immediately after the user enables location in Settings.
 */
export function useUserLocation(): UseUserLocationResult {
  const coords    = useLocationStore((s) => s.coords);
  const setCoords = useLocationStore((s) => s.setCoords);
  const setStatus = useLocationStore((s) => s.setStatus);

  // ── Main location watcher ─────────────────────────────────────────────────
  useEffect(() => {
    const initialStatus = useLocationStore.getState().status;
    if (initialStatus !== 'undetermined') return;

    // Claim the slot synchronously — before any await — so a second concurrent
    // instance of this hook (PlacesScreen + PlaceDetailScreen both mounted)
    // reads 'requesting' and exits without starting a duplicate watcher.
    useLocationStore.getState().setStatus('requesting');

    let cancelled = false;
    let subscription: Location.LocationSubscription | null = null;

    async function start(): Promise<void> {
      // Check existing OS-level grant — never request.
      const { status } = await Location.getForegroundPermissionsAsync();
      if (cancelled) return;

      if (status !== 'granted') {
        // Location unavailable (not granted). Mark so the AppState listener
        // can re-check after the user enables it in Settings.
        setStatus('denied');
        return;
      }

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
        // No fix yet — watcher will fill it in when GPS is ready.
      }

      if (cancelled) return;

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
        // GPS unavailable (airplane mode) — silent.
      }
    }

    void start();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []); // intentionally empty — status is read via getState() to avoid the cleanup race

  // ── AppState listener — pick up location the moment user enables it ───────
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      if (nextState !== 'active') return;

      const currentStatus = useLocationStore.getState().status;
      if (currentStatus !== 'denied') return;

      // Re-check without prompting — user may have just enabled location in Settings.
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        setStatus('granted');
        try {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        } catch {
          // Silent.
        }
      }
    });

    return () => sub.remove();
  }, [setCoords, setStatus]);

  return { userCoords: coords };
}