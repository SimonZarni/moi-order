/**
 * Principle: SRP — owns cart client state only. Zero API calls here.
 * Principle: Security — priceCents is read from API response (MenuItem), never from user input.
 */
import { Alert } from 'react-native';
import { create } from 'zustand';

export interface SelectedOption {
  optionGroupId: number;
  optionGroupName: string;
  optionId: number;
  optionName: string;
  additionalPriceCents: number;
}

export interface CartItem {
  /** Unique per (menuItemId + option combination). Format: `${menuItemId}:${sortedOptionIds}` */
  cartKey: string;
  menuItemId: number;
  name: string;
  basePriceCents: number;
  additionalPriceCents: number;
  photoUrl: string | null;
  quantity: number;
  selectedOptions: SelectedOption[];
}

interface CartState {
  restaurantId: number | null;
  restaurantName: string;
  items: CartItem[];
  // Derived
  totalCents: () => number;
  itemCount: () => number;
  /** Total quantity across all configurations for a given menuItemId. */
  getQuantity: (menuItemId: number) => number;
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, restaurantId: number, restaurantName: string) => void;
  increment: (cartKey: string) => void;
  decrement: (cartKey: string) => void;
  clearCart: () => void;
}

export function buildCartKey(menuItemId: number, selectedOptions: SelectedOption[]): string {
  const sorted = selectedOptions.map((o) => o.optionId).sort().join(',');
  return `${menuItemId}:${sorted}`;
}

export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  restaurantName: '',
  items: [],

  totalCents: () =>
    get().items.reduce((sum, i) => sum + (i.basePriceCents + i.additionalPriceCents) * i.quantity, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  getQuantity: (menuItemId) =>
    get().items
      .filter((i) => i.menuItemId === menuItemId)
      .reduce((sum, i) => sum + i.quantity, 0),

  addItem: (item, restaurantId, restaurantName) => {
    const state = get();

    if (state.restaurantId !== null && state.restaurantId !== restaurantId && state.items.length > 0) {
      Alert.alert(
        'Start new order?',
        `Your cart has items from ${state.restaurantName}. Clear it to order from ${restaurantName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear & Add',
            style: 'destructive',
            onPress: () => set({ restaurantId, restaurantName, items: [{ ...item, quantity: 1 }] }),
          },
        ],
      );
      return;
    }

    set((prev) => {
      const existing = prev.items.find((i) => i.cartKey === item.cartKey);
      if (existing) {
        return {
          items: prev.items.map((i) =>
            i.cartKey === item.cartKey ? { ...i, quantity: i.quantity + 1 } : i,
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

  increment: (cartKey) =>
    set((prev) => ({
      items: prev.items.map((i) =>
        i.cartKey === cartKey ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    })),

  decrement: (cartKey) =>
    set((prev) => {
      const item = prev.items.find((i) => i.cartKey === cartKey);
      if (!item) return prev;
      if (item.quantity === 1) {
        const next = prev.items.filter((i) => i.cartKey !== cartKey);
        return { items: next, restaurantId: next.length === 0 ? null : prev.restaurantId };
      }
      return {
        items: prev.items.map((i) =>
          i.cartKey === cartKey ? { ...i, quantity: i.quantity - 1 } : i,
        ),
      };
    }),

  clearCart: () => set({ restaurantId: null, restaurantName: '', items: [] }),
}));
