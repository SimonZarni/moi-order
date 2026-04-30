import { supabaseClient, API_URL } from './supabase/client';
import { Order, Restaurant } from '../components/CustomerApp';

// Get access token from current session
export const getAccessToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session?.access_token || null;
};

// ============================================
// AUTH APIs
// ============================================

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  profilePicture: string | null;
  createdAt: string;
  updatedAt?: string;
}

export const signup = async (data: SignupData) => {
  try {
    console.log('Attempting signup with:', { ...data, password: '***' });
    
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Signup response status:', response.status);
    
    let result;
    try {
      result = await response.json();
      console.log('Signup result:', result);
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      throw new Error('Server returned invalid response');
    }
    
    if (!response.ok) {
      const errorMessage = result.error || `Signup failed with status ${response.status}`;
      console.error('Signup failed:', errorMessage);
      throw new Error(errorMessage);
    }

    return result;
  } catch (error) {
    console.error('Signup API error:', error);
    throw error;
  }
};

export const signin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};

export const signout = async () => {
  try {
    const { error } = await supabaseClient.auth.signOut();
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Signout error:', error);
    throw error;
  }
};

export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error) {
      throw error;
    }

    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get profile');
    }

    return result.user;
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
};

export const updateUserProfile = async (name: string, phone: string) => {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update profile');
    }

    return result.user;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const uploadProfilePicture = async (file: File): Promise<string> => {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/profile-picture/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload profile picture');
    }

    return result.profilePicture;
  } catch (error) {
    console.error('Upload profile picture error:', error);
    throw error;
  }
};

// ============================================
// RESTAURANT APIs
// ============================================

export const getRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await fetch(`${API_URL}/restaurants`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get restaurants');
    }

    return result.restaurants;
  } catch (error) {
    console.error('Get restaurants error:', error);
    return [];
  }
};

export const getRestaurantById = async (id: string): Promise<Restaurant | null> => {
  try {
    const response = await fetch(`${API_URL}/restaurants/${id}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get restaurant');
    }

    return result.restaurant;
  } catch (error) {
    console.error('Get restaurant error:', error);
    return null;
  }
};

// ============================================
// ORDER APIs
// ============================================

export interface CreateOrderData {
  restaurantId: string;
  restaurantName: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    restaurantId: string;
    restaurantName: string;
    image?: string;
    description?: string;
    customizations?: string[];
  }>;
  total: number;
  deliveryAddress: string;
  phoneNumber: string;
  note?: string;
  paymentMethod?: string;
  paymentProof?: string;
  estimatedDelivery: string;
}

export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create order');
    }

    return result.order;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get orders');
    }

    return result.orders;
  } catch (error) {
    console.error('Get orders error:', error);
    return [];
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get order');
    }

    return result.order;
  } catch (error) {
    console.error('Get order error:', error);
    return null;
  }
};

// ============================================
// ADMIN APIs
// ============================================

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get all orders');
    }

    return result.orders;
  } catch (error) {
    console.error('Get all orders error:', error);
    return [];
  }
};

export const updateOrderStatus = async (
  orderId: string, 
  status: 'pending' | 'confirmed' | 'preparing' | 'on-way' | 'delivered' | 'cancelled'
): Promise<Order> => {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update order status');
    }

    return result.order;
  } catch (error) {
    console.error('Update order status error:', error);
    throw error;
  }
};

export const makeUserAdmin = async () => {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/admin/make-admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to make admin');
    }

    return result.user;
  } catch (error) {
    console.error('Make admin error:', error);
    throw error;
  }
};

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  preparingOrders: number;
  onWayOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

export const getDashboardStats = async (): Promise<DashboardStats | null> => {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get stats');
    }

    return result.stats;
  } catch (error) {
    console.error('Get stats error:', error);
    return null;
  }
};

// ============================================
// INITIALIZATION API
// ============================================

export const initializeData = async () => {
  try {
    console.log('Initializing restaurant data...');
    
    const response = await fetch(`${API_URL}/init-data`, {
      method: 'POST',
    });

    console.log('Init data response status:', response.status);

    let result;
    try {
      result = await response.json();
      console.log('Init data result:', result);
    } catch (parseError) {
      console.error('Failed to parse init data response:', parseError);
      throw new Error('Server returned invalid response');
    }
    
    if (!response.ok) {
      const errorMessage = result.error || `Failed to initialize data (status ${response.status})`;
      console.error('Init data failed:', errorMessage);
      if (result.details) {
        console.error('Error details:', result.details);
      }
      throw new Error(errorMessage);
    }

    console.log('Restaurant data initialized successfully');
    return result;
  } catch (error) {
    console.error('Initialize data error:', error);
    throw error;
  }
};
