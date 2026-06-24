import { useState, useEffect, useCallback } from 'react';
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

export function useCustomerLocation(): UseCustomerLocationResult {
  const [permissionStatus, setPermissionStatus] = useState<CustomerLocationPermission>('loading');
  const [location, setLocation] = useState<CustomerCoords | null>(null);

  // On mount: prompt the user if undecided; otherwise returns current status immediately.
  const initialFetch = useCallback(async () => {
    setPermissionStatus('loading');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionStatus('denied');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      setPermissionStatus('granted');
    } catch {
      setPermissionStatus('denied');
    }
  }, []);

  // Called when app returns to foreground: silently re-checks without prompting.
  // Needed so the UI updates automatically if the user enabled location in Settings.
  const silentCheck = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setPermissionStatus('granted');
      } else {
        setPermissionStatus('denied');
      }
    } catch {
      // Don't overwrite state on a silent background check failure.
    }
  }, []);

  // Called by the "Enable Location" button after denial.
  // iOS always sets canAskAgain=false after the first denial — the only recovery path
  // is Settings. Android sets it false only after "Don't ask again" is ticked.
  const requestPermission = useCallback(async () => {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

      if (status === 'granted') {
        setPermissionStatus('loading');
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setPermissionStatus('granted');
        return;
      }

      if (!canAskAgain) {
        await Linking.openSettings();
        return;
      }

      // Android first denial with canAskAgain=true: re-prompt natively.
      setPermissionStatus('loading');
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus === 'granted') {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setPermissionStatus('granted');
      } else {
        setPermissionStatus('denied');
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
