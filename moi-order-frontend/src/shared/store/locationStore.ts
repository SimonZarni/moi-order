/**
 * Principle: SRP — owns client-side location state only.
 * Why a store: userCoords must survive navigation (screen unmount/remount) so the
 * OS permission dialog and GPS fetch fire at most once per app session.
 */
import { create } from 'zustand';

export interface UserCoords {
  latitude: number;
  longitude: number;
}

/**
 * 'dismissed' — user tapped "No thanks" in the in-app prompt.
 * We never call requestForegroundPermissionsAsync() for dismissed, so
 * the OS dialog is never shown and there is no double-dialog issue.
 */
type PermissionStatus = 'undetermined' | 'requesting' | 'granted' | 'denied' | 'dismissed';

interface LocationState {
  coords: UserCoords | null;
  status: PermissionStatus;
  setCoords: (coords: UserCoords) => void;
  setStatus: (status: PermissionStatus) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  coords: null,
  status: 'undetermined',
  setCoords: (coords): void => set({ coords }),
  setStatus: (status): void => set({ status }),
}));
