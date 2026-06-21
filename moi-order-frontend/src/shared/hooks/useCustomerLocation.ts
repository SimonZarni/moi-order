import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

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

  const fetchLocation = useCallback(async () => {
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

  useEffect(() => {
    void fetchLocation();
  }, [fetchLocation]);

  return { location, permissionStatus, requestPermission: fetchLocation };
}
