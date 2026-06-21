import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface UseRestaurantLocationResult {
  isLocating: boolean;
  locationError: string | null;
  getLocation: (onSuccess: (coords: LocationCoords) => void) => void;
}

export function useRestaurantLocation(): UseRestaurantLocationResult {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getLocation = useCallback((onSuccess: (coords: LocationCoords) => void) => {
    setLocationError(null);
    setIsLocating(true);
    void (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Location permission denied. Please enable it in your browser or device settings.');
          return;
        }
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        onSuccess({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      } catch {
        setLocationError('Could not get your location. Please try again.');
      } finally {
        setIsLocating(false);
      }
    })();
  }, []);

  return { isLocating, locationError, getLocation };
}
