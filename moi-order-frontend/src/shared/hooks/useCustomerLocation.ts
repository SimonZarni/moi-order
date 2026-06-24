import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { AppState, Linking } from 'react-native';

export type CustomerLocationPermission = 'loading' | 'granted' | 'denied';

interface CustomerCoords {
  latitude: number;
  longitude: number;
}

export interface UseCustomerLocationResult {
  location: CustomerCoords | null;
  permissionStatus: CustomerLocationPermission;
  locationError: boolean;
  requestPermission: () => Promise<void>;
}

// 5 minutes — stale enough to be fast, fresh enough for food delivery.
const LAST_KNOWN_MAX_AGE_MS = 5 * 60 * 1000;

// On Android, getForegroundPermissionsAsync() returns 'undetermined' even after the
// user denies once (when canAskAgain=true), so we cannot distinguish "never asked"
// from "denied once" via status alone. This flag ensures the OS dialog fires at most
// once automatically per install — subsequent prompts are user-initiated only.
const FOOD_LOCATION_ASKED_KEY = 'food_location_asked';

async function resolveCoords(): Promise<CustomerCoords> {
  // Fast path: return a recent cached fix instantly so the restaurant query
  // fires without waiting for a cold GPS acquisition.
  const last = await Location.getLastKnownPositionAsync({ maxAge: LAST_KNOWN_MAX_AGE_MS });
  if (last) {
    return { latitude: last.coords.latitude, longitude: last.coords.longitude };
  }
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

export function useCustomerLocation(): UseCustomerLocationResult {
  const [permissionStatus, setPermissionStatus] = useState<CustomerLocationPermission>('loading');
  const [location, setLocation] = useState<CustomerCoords | null>(null);
  const [locationError, setLocationError] = useState(false);

  // Guards silentCheck() from running while initialFetch() or requestPermission()
  // is in flight. On Android the system permission dialog triggers an AppState
  // 'active' event before requestForegroundPermissionsAsync() resolves in JS,
  // so without this guard two concurrent GPS calls produce slightly different
  // coordinates → different rounded query keys → TanStack Query abandons the first
  // fetch, leaving the restaurant list blank until the second one completes.
  const isFetchingRef = useRef(false);

  const initialFetch = useCallback(async () => {
    isFetchingRef.current = true;
    setPermissionStatus('loading');
    try {
      // Always check the existing status WITHOUT prompting first.
      const { status: existing } = await Location.getForegroundPermissionsAsync();

      let granted = existing === 'granted';

      if (!granted) {
        // Only auto-prompt when this install has never triggered the OS dialog.
        // Prevents the dialog re-appearing on every FoodScreen mount after denial.
        const alreadyAsked = await SecureStore.getItemAsync(FOOD_LOCATION_ASKED_KEY);
        if (!alreadyAsked) {
          await SecureStore.setItemAsync(FOOD_LOCATION_ASKED_KEY, '1');
          const { status } = await Location.requestForegroundPermissionsAsync();
          granted = status === 'granted';
        }
      }

      if (!granted) {
        setPermissionStatus('denied');
        return;
      }

      // Permission confirmed — remain in 'loading' while GPS acquires so the screen
      // shows the spinner rather than flashing the empty list. GPS failure must NOT
      // revert to 'denied' — permission IS granted.
      try {
        const coords = await resolveCoords();
        setLocation(coords);
        setLocationError(false);
        setPermissionStatus('granted');
      } catch {
        // GPS unavailable after grant. silentCheck() retries on next AppState 'active'.
        setLocationError(true);
        setPermissionStatus('granted');
      }
    } catch {
      setPermissionStatus('denied');
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  const silentCheck = useCallback(async () => {
    if (isFetchingRef.current) return;
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const coords = await resolveCoords();
          setLocation(coords);
          setPermissionStatus('granted');
          setLocationError(false);
        } catch {
          // GPS still unavailable — update permission status to reflect reality
          // (user may have just enabled it in Settings) but keep locationError set.
          setPermissionStatus('granted');
          setLocationError(true);
        }
      } else {
        setPermissionStatus('denied');
      }
    } catch {
      // Don't overwrite state on a silent background check failure.
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

      if (status === 'granted') {
        // Permission already granted — retry GPS acquisition only.
        // Used by the "Retry" button when GPS failed after permission was granted.
        isFetchingRef.current = true;
        setPermissionStatus('loading');
        try {
          const coords = await resolveCoords();
          setLocation(coords);
          setLocationError(false);
        } catch {
          setLocationError(true);
        } finally {
          isFetchingRef.current = false;
          setPermissionStatus('granted');
        }
        return;
      }

      if (!canAskAgain) {
        await Linking.openSettings();
        return;
      }

      // 'denied' with canAskAgain=true — re-prompt natively.
      // Guard silentCheck for the same reason as initialFetch.
      isFetchingRef.current = true;
      setPermissionStatus('loading');
      try {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus === 'granted') {
          try {
            const coords = await resolveCoords();
            setLocation(coords);
            setLocationError(false);
            setPermissionStatus('granted');
          } catch {
            setLocationError(true);
            setPermissionStatus('granted');
          }
        } else {
          setPermissionStatus('denied');
        }
      } finally {
        isFetchingRef.current = false;
      }
    } catch {
      setPermissionStatus('denied');
    }
  }, []);

  useEffect(() => {
    void initialFetch();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void silentCheck();
      }
    });

    return () => { subscription.remove(); };
  }, [initialFetch, silentCheck]);

  return { location, permissionStatus, locationError, requestPermission };
}
