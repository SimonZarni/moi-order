export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  description: string;
  isOpen: boolean;
  promotions?: string[];
  categories?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  customizations?: string[];
  allergens?: string[];
  restaurantId: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  customizations?: string[];
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerId: string;
  merchantId: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total: number;
  deliveryAddress: string;
  estimatedTime: string;
  timestamp: Date;
  paymentMethod: string;
  notes?: string;
}