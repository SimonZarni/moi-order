import { create } from 'zustand';

interface MapStore {
  isFullscreen:       boolean;
  isBottomSheetOpen:  boolean;
  setFullscreen:      (val: boolean) => void;
  setBottomSheetOpen: (val: boolean) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  isFullscreen:       false,
  isBottomSheetOpen:  false,
  setFullscreen:      (val) => set({ isFullscreen: val }),
  setBottomSheetOpen: (val) => set({ isBottomSheetOpen: val }),
}));
