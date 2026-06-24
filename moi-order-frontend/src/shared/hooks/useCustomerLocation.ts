import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { AppState, Linking } from 'react-native';

export type CustomerLocationPermission = 'loading' | 'granted' | 'denied';

interface CustomerCoords {
  latitude: number;
  longitude: number;
}

export interface UseCustomerLocationResult {
  location: CustomerCoords | null;
  permissionStatus: CustomerLocationPermission;
  requestPermission: () => Promise<void>;
}

// 5 minutes — stale enough to be fast, fresh enough for food delivery.
const LAST_KNOWN_MAX_AGE_MS = 5 * 60 * 1000;

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

  // Guards silentCheck() from running while initialFetch() or the requestPermission
  // re-prompt is in flight. On Android the system permission dialog triggers an
  // AppState 'active' event before requestForegroundPermissionsAsync() resolves in
  // JS, so without this guard two concurrent GPS calls produce slightly different
  // coordinates → different rounded query keys → TanStack Query abandons the first
  // fetch, leaving the restaurant list blank until the second one completes.
  const isFetchingRef = useRef(false);

  const initialFetch = useCallback(async () => {
    isFetchingRef.current = true;
    setPermissionStatus('loading');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionStatus('denied');
        return;
      }
      const coords = await resolveCoords();
      setLocation(coords);
      setPermissionStatus('granted');
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
        const coords = await resolveCoords();
        setLocation(coords);
        setPermissionStatus('granted');
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
        setPermissionStatus('loading');
        const coords = await resolveCoords();
        setLocation(coords);
        setPermissionStatus('granted');
        return;
      }

      if (!canAskAgain) {
        await Linking.openSettings();
        return;
      }

      // Android first denial with canAskAgain=true: re-prompt natively.
      // Guard silentCheck for the same reason as initialFetch.
      isFetchingRef.current = true;
      setPermissionStatus('loading');
      try {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus === 'granted') {
          const coords = await resolveCoords();
          setLocation(coords);
          setPermissionStatus('granted');
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

  return { location, permissionStatus, requestPermission };
}
