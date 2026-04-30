/**
 * Principle: SRP — owns cart client state only. Zero API calls here.
 * Principle: Security — priceCents is read from API response (MenuItem), never from user input.
 */
import { Alert } from 'react-native';
import { create } from 'zustand';

export interface CartItem {
  menuItemId: number;
  name: string;
  priceCents: number;
  photoUrl: string | null;
  quantity: number;
}

interface CartState {
  restaurantId: number | null;
  restaurantName: string;
  items: CartItem[];
  // Derived
  totalCents: () => number;
  itemCount: () => number;
  getQuantity: (menuItemId: number) => number;
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, restaurantId: number, restaurantName: string) => void;
  increment: (menuItemId: number) => void;
  decrement: (menuItemId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  restaurantName: '',
  items: [],

  totalCents: () => get().items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
  itemCount:  () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  getQuantity: (menuItemId) => get().items.find((i) => i.menuItemId === menuItemId)?.quantity ?? 0,

  addItem: (item, restaurantId, restaurantName) => {
    const state = get();

    // If cart has items from a different restaurant, confirm before clearing.
    if (state.restaurantId !== null && state.restaurantId !== restaurantId && state.items.length > 0) {
      Alert.alert(
        'Start new order?',
        `Your cart has items from ${state.restaurantName}. Clear it to order from ${restaurantName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear & Add',
            style: 'destructive',
            onPress: () =>
              set({
                restaurantId,
                restaurantName,
                items: [{ ...item, quantity: 1 }],
              }),
          },
        ],
      );
      return;
    }

    set((prev) => {
      const exists = prev.items.find((i) => i.menuItemId === item.menuItemId);
      if (exists) {
        return {
          items: prev.items.map((i) =>
            i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }
      return {
        restaurantId,
        restaurantName,
        items: [...prev.items, { ...item, quantity: 1 }],
      };
    });
  },

  increment: (menuItemId) =>
    set((prev) => ({
      items: prev.items.map((i) =>
        i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    })),

  decrement: (menuItemId) =>
    set((prev) => {
      const item = prev.items.find((i) => i.menuItemId === menuItemId);
      if (!item) return prev;
      if (item.quantity === 1) {
        const next = prev.items.filter((i) => i.menuItemId !== menuItemId);
        return { items: next, restaurantId: next.length === 0 ? null : prev.restaurantId };
      }
      return {
        items: prev.items.map((i) =>
          i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i,
        ),
      };
    }),

  clearCart: () => set({ restaurantId: null, restaurantName: '', items: [] }),
}));
