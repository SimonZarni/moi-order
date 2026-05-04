import { create } from 'zustand';

interface MapStore {
  isFullscreen: boolean;
  setFullscreen: (val: boolean) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  isFullscreen: false,
  setFullscreen: (val) => set({ isFullscreen: val }),
}));
