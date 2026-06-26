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
  locationError: boolean;
  requestPermission: () => Promise<void>;
}

// 30 minutes — generous window for restaurant discovery; avoids cold GPS on fresh grant.
const LAST_KNOWN_MAX_AGE_MS = 30 * 60 * 1000;

async function resolveCoords(): Promise<CustomerCoords> {
  const last = await Location.getLastKnownPositionAsync({ maxAge: LAST_KNOWN_MAX_AGE_MS });
  if (last) {
    return { latitude: last.coords.latitude, longitude: last.coords.longitude };
  }
  // Accuracy.Low (network/wifi-based) resolves in ~1 s even on a cold device.
  // When services are off, getCurrentPositionAsync triggers the OS "Enable Location
  // Services" dialog — callers that should NOT trigger it (silentCheck) guard with
  // hasServicesEnabledAsync() before calling here.
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
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
      const { status: existing } = await Location.getForegroundPermissionsAsync();
      let granted = existing === 'granted';

      if (!granted) {
        // Always ask — Android's own canAskAgain=false handles permanent denial.
        const { status } = await Location.requestForegroundPermissionsAsync();
        granted = status === 'granted';
      }

      if (!granted) {
        setPermissionStatus('denied');
        return;
      }

      try {
        const coords = await resolveCoords();
        setLocation(coords);
        setLocationError(false);
        setPermissionStatus('granted');
      } catch {
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
        // Guard against the infinite-loop: AppState 'active' fires after the OS
        // "Enable Location Services" dialog is dismissed. Without this check,
        // resolveCoords() would call getCurrentPositionAsync() → show the dialog
        // again → loop. We surface locationError and let the user retry explicitly.
        const servicesOn = await Location.hasServicesEnabledAsync();
        if (!servicesOn) {
          setPermissionStatus('granted');
          setLocationError(true);
          return;
        }
        try {
          const coords = await resolveCoords();
          setLocation(coords);
          setPermissionStatus('granted');
          setLocationError(false);
        } catch {
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
        // Retry GPS — used by the "Retry" button when GPS failed after permission was granted.
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
        // Android permanently denied — only Settings can undo this.
        await Linking.openSettings();
        return;
      }

      // Show the OS permission dialog. Android tracks its own "don't ask again"
      // threshold via canAskAgain; we let it handle loop prevention naturally.
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
