import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { initializeRestaurants } from "./init-data.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase clients
const getServiceClient = () => {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!url || !key) {
    console.error('Missing Supabase credentials:', { 
      hasUrl: !!url, 
      hasKey: !!key 
    });
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
};

const getAnonClient = () => {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!url || !key) {
    console.error('Missing Supabase credentials:', { 
      hasUrl: !!url, 
      hasKey: !!key 
    });
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
};

// Initialize storage bucket on startup
const initializeStorage = async () => {
  const supabase = getServiceClient();
  const bucketName = 'make-e3052afd-user-profiles';
  
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
      console.log(`Created storage bucket: ${bucketName}`);
    }
  } catch (error) {
    console.error(`Error initializing storage: ${error}`);
  }
};

// Initialize storage
initializeStorage();

// Middleware to verify user authentication
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  const supabase = getServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    console.error('Auth error:', error);
    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }
  
  c.set('userId', user.id);
  c.set('user', user);
  await next();
};

// Health check endpoint
app.get("/make-server-e3052afd/health", (c) => {
  const hasUrl = !!Deno.env.get('SUPABASE_URL');
  const hasServiceKey = !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const hasAnonKey = !!Deno.env.get('SUPABASE_ANON_KEY');
  
  return c.json({ 
    status: "ok",
    env: {
      hasSupabaseUrl: hasUrl,
      hasServiceRoleKey: hasServiceKey,
      hasAnonKey: hasAnonKey
    }
  });
});

// Test endpoint to verify Supabase connection
app.get("/make-server-e3052afd/test-supabase", async (c) => {
  try {
    const supabase = getServiceClient();
    
    // Try a simple operation
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1
    });
    
    if (error) {
      return c.json({ 
        success: false, 
        error: error.message,
        details: error
      }, 500);
    }
    
    return c.json({ 
      success: true, 
      message: 'Supabase connection working',
      userCount: data.users.length
    });
  } catch (error) {
    console.error('Supabase test error:', error);
    return c.json({ 
      success: false, 
      error: String(error)
    }, 500);
  }
});

// Test endpoint to verify KV store
app.post("/make-server-e3052afd/test-kv", async (c) => {
  try {
    console.log('====== TESTING KV STORE ======');
    console.log('Environment:', {
      hasUrl: !!Deno.env.get('SUPABASE_URL'),
      hasServiceKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    });
    
    // Test write
    const testKey = 'test:key';
    const testValue = { message: 'Hello from KV store', timestamp: new Date().toISOString() };
    console.log('Writing to KV store:', testKey);
    await kv.set(testKey, testValue);
    console.log('Write successful');
    
    // Test read
    console.log('Reading from KV store:', testKey);
    const result = await kv.get(testKey);
    console.log('Read successful:', result);
    
    // Test delete
    console.log('Deleting from KV store:', testKey);
    await kv.del(testKey);
    console.log('Delete successful');
    
    console.log('====== KV STORE TEST PASSED ======');
    return c.json({ 
      success: true, 
      message: 'KV store working correctly',
      testData: result
    });
  } catch (error) {
    console.error('====== KV STORE TEST FAILED ======');
    console.error('KV store test error:', error);
    console.error('Error details:', {
      message: error?.message,
      name: error?.name,
      code: error?.code,
      details: error?.details,
      hint: error?.hint
    });
    
    return c.json({ 
      success: false, 
      error: String(error),
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      suggestion: 'If you see a 401 error, RLS might be enabled on kv_store_e3052afd table. Go to Supabase Dashboard → Database → Tables → kv_store_e3052afd → Disable RLS'
    }, 500);
  }
});

// Initialize data endpoint (for first-time setup) - NO AUTH REQUIRED
app.post("/make-server-e3052afd/init-data", async (c) => {
  try {
    console.log('====== INIT DATA ENDPOINT CALLED ======');
    console.log('Environment check:', {
      hasSupabaseUrl: !!Deno.env.get('SUPABASE_URL'),
      hasServiceKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      supabaseUrl: Deno.env.get('SUPABASE_URL')?.substring(0, 30) + '...'
    });
    
    // Test KV store access first
    console.log('Testing KV store access...');
    try {
      await kv.set('test:init', { test: true, timestamp: new Date().toISOString() });
      console.log('KV store write test: SUCCESS');
      
      const testRead = await kv.get('test:init');
      console.log('KV store read test:', testRead ? 'SUCCESS' : 'FAILED');
      
      await kv.del('test:init');
      console.log('KV store delete test: SUCCESS');
    } catch (kvError) {
      console.error('KV store test FAILED:', kvError);
      console.error('KV error details:', {
        message: kvError?.message,
        name: kvError?.name,
        code: kvError?.code,
        details: kvError?.details,
        hint: kvError?.hint
      });
      
      return c.json({ 
        error: 'Database access failed',
        message: 'Unable to access the database. Please check that Row Level Security (RLS) is disabled on the kv_store_e3052afd table.',
        details: kvError?.message || String(kvError),
        hint: 'Go to Supabase Dashboard → Database → Tables → kv_store_e3052afd → Disable RLS',
        kvError: {
          message: kvError?.message,
          code: kvError?.code,
          details: kvError?.details
        }
      }, 500);
    }
    
    console.log('KV store access verified. Starting restaurant initialization...');
    const result = await initializeRestaurants();
    console.log('Data initialization completed successfully');
    console.log('====== INIT DATA COMPLETE ======');
    
    return c.json({ 
      success: true, 
      message: 'Data initialized successfully',
      restaurantCount: result.length 
    });
  } catch (error) {
    console.error('====== INIT DATA ERROR ======');
    console.error('Init data error:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code
    });
    
    return c.json({ 
      error: `Failed to initialize data: ${error?.message || String(error)}`,
      details: error?.stack,
      errorType: error?.name,
      errorCode: error?.code
    }, 500);
  }
});

// ============================================
// AUTH ENDPOINTS
// ============================================

// Sign up new user
app.post("/make-server-e3052afd/auth/signup", async (c) => {
  try {
    console.log('Received signup request');
    
    let requestBody;
    try {
      requestBody = await c.req.json();
      console.log('Signup request data:', { ...requestBody, password: '***' });
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return c.json({ error: 'Invalid request body' }, 400);
    }
    
    const { email, password, name, phone } = requestBody;
    
    if (!email || !password || !name) {
      console.log('Missing required fields');
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    console.log('Creating Supabase client...');
    const supabase = getServiceClient();
    
    console.log('Attempting to create user in Supabase...');
    // Create user with admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server is not configured
      user_metadata: {
        name,
        phone: phone || '',
        role: 'customer', // Default role
        created_at: new Date().toISOString(),
      },
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return c.json({ error: `Failed to create user: ${error.message}` }, 400);
    }

    console.log('User created successfully:', data.user.id);

    // Store additional user data in KV store
    console.log('Storing user data in KV store...');
    try {
      await kv.set(`user:${data.user.id}`, {
        id: data.user.id,
        email,
        name,
        phone: phone || '',
        role: 'customer',
        profilePicture: null,
        createdAt: new Date().toISOString(),
      });
      console.log('User data stored successfully');
    } catch (kvError) {
      console.error('KV store error:', kvError);
      // Don't fail the signup if KV storage fails
    }

    return c.json({ 
      success: true, 
      userId: data.user.id,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.error('Unexpected signup error:', error);
    return c.json({ error: `Server error during signup: ${String(error)}` }, 500);
  }
});

// Get current user profile
app.get("/make-server-e3052afd/auth/profile", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ success: true, user: userData });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: `Failed to get profile: ${error}` }, 500);
  }
});

// Update user profile
app.put("/make-server-e3052afd/auth/profile", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { name, phone } = await c.req.json();
    
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedUser = {
      ...userData,
      name: name || userData.name,
      phone: phone || userData.phone,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, updatedUser);

    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: `Failed to update profile: ${error}` }, 500);
  }
});

// ============================================
// PROFILE PICTURE ENDPOINTS
// ============================================

// Upload profile picture
app.post("/make-server-e3052afd/profile-picture/upload", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5242880) {
      return c.json({ error: 'File size exceeds 5MB limit' }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Only JPEG, PNG, and WebP images are allowed' }, 400);
    }

    const supabase = getServiceClient();
    const bucketName = 'make-e3052afd-user-profiles';
    const fileName = `${userId}/${Date.now()}-${file.name}`;

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: `Failed to upload file: ${uploadError.message}` }, 500);
    }

    // Get signed URL (valid for 1 year)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 year in seconds

    if (urlError) {
      console.error('URL generation error:', urlError);
      return c.json({ error: `Failed to generate URL: ${urlError.message}` }, 500);
    }

    // Update user profile with picture URL
    const userData = await kv.get(`user:${userId}`);
    const updatedUser = {
      ...userData,
      profilePicture: urlData.signedUrl,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, updatedUser);

    return c.json({ 
      success: true, 
      profilePicture: urlData.signedUrl,
      message: 'Profile picture uploaded successfully'
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    return c.json({ error: `Server error during upload: ${error}` }, 500);
  }
});

// ============================================
// RESTAURANT ENDPOINTS
// ============================================

// Get all restaurants
app.get("/make-server-e3052afd/restaurants", async (c) => {
  try {
    const restaurants = await kv.getByPrefix('restaurant:');
    return c.json({ success: true, restaurants });
  } catch (error) {
    console.error('Get restaurants error:', error);
    return c.json({ error: `Failed to get restaurants: ${error}` }, 500);
  }
});

// Get restaurant by ID
app.get("/make-server-e3052afd/restaurants/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const restaurant = await kv.get(`restaurant:${id}`);
    
    if (!restaurant) {
      return c.json({ error: 'Restaurant not found' }, 404);
    }

    return c.json({ success: true, restaurant });
  } catch (error) {
    console.error('Get restaurant error:', error);
    return c.json({ error: `Failed to get restaurant: ${error}` }, 500);
  }
});

// ============================================
// ORDER ENDPOINTS
// ============================================

// Create new order
app.post("/make-server-e3052afd/orders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const orderData = await c.req.json();
    
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const order = {
      id: orderId,
      userId,
      restaurantId: orderData.restaurantId,
      restaurantName: orderData.restaurantName,
      items: orderData.items,
      total: orderData.total,
      status: 'pending',
      deliveryAddress: orderData.deliveryAddress,
      phoneNumber: orderData.phoneNumber,
      note: orderData.note || '',
      paymentMethod: orderData.paymentMethod || 'PromptPay',
      paymentProof: orderData.paymentProof,
      orderTime: new Date().toISOString(),
      estimatedDelivery: orderData.estimatedDelivery,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, order);
    
    // Add to user's orders list
    const userOrders = await kv.get(`user:${userId}:orders`) || [];
    userOrders.push(orderId);
    await kv.set(`user:${userId}:orders`, userOrders);

    // Add to all orders list
    const allOrders = await kv.get('orders:all') || [];
    allOrders.push(orderId);
    await kv.set('orders:all', allOrders);

    return c.json({ 
      success: true, 
      orderId,
      order,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('Create order error:', error);
    return c.json({ error: `Failed to create order: ${error}` }, 500);
  }
});

// Get user's orders
app.get("/make-server-e3052afd/orders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userOrders = await kv.get(`user:${userId}:orders`) || [];
    
    const orders = [];
    for (const orderId of userOrders) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        orders.push(order);
      }
    }

    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return c.json({ error: `Failed to get orders: ${error}` }, 500);
  }
});

// Get all orders (admin only)
app.get("/make-server-e3052afd/admin/orders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userData = await kv.get(`user:${userId}`);
    
    // Check if user is admin
    if (userData?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const allOrderIds = await kv.get('orders:all') || [];
    
    const orders = [];
    for (const orderId of allOrderIds) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        orders.push(order);
      }
    }

    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    return c.json({ error: `Failed to get orders: ${error}` }, 500);
  }
});

// Update order status (admin only)
app.put("/make-server-e3052afd/admin/orders/:id/status", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userData = await kv.get(`user:${userId}`);
    
    // Check if user is admin
    if (userData?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const orderId = c.req.param('id');
    const { status } = await c.req.json();
    
    const order = await kv.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, updatedOrder);

    return c.json({ 
      success: true, 
      order: updatedOrder,
      message: 'Order status updated successfully' 
    });
  } catch (error) {
    console.error('Update order status error:', error);
    return c.json({ error: `Failed to update order status: ${error}` }, 500);
  }
});

// Get single order
app.get("/make-server-e3052afd/orders/:id", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const orderId = c.req.param('id');
    
    const order = await kv.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Check if user owns this order or is admin
    const userData = await kv.get(`user:${userId}`);
    if (order.userId !== userId && userData?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - You can only view your own orders' }, 403);
    }

    return c.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    return c.json({ error: `Failed to get order: ${error}` }, 500);
  }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Make user admin (for testing - in production, this should be more secure)
app.post("/make-server-e3052afd/admin/make-admin", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedUser = {
      ...userData,
      role: 'admin',
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, updatedUser);

    return c.json({ 
      success: true, 
      user: updatedUser,
      message: 'User promoted to admin' 
    });
  } catch (error) {
    console.error('Make admin error:', error);
    return c.json({ error: `Failed to make admin: ${error}` }, 500);
  }
});

// Get dashboard stats (admin only)
app.get("/make-server-e3052afd/admin/stats", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userData = await kv.get(`user:${userId}`);
    
    // Check if user is admin
    if (userData?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    const allOrderIds = await kv.get('orders:all') || [];
    
    let totalOrders = 0;
    let pendingOrders = 0;
    let confirmedOrders = 0;
    let preparingOrders = 0;
    let onWayOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;
    let totalRevenue = 0;

    for (const orderId of allOrderIds) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        totalOrders++;
        
        switch (order.status) {
          case 'pending': pendingOrders++; break;
          case 'confirmed': confirmedOrders++; break;
          case 'preparing': preparingOrders++; break;
          case 'on-way': onWayOrders++; break;
          case 'delivered': 
            deliveredOrders++;
            totalRevenue += order.total;
            break;
          case 'cancelled': cancelledOrders++; break;
        }
      }
    }

    return c.json({ 
      success: true, 
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        preparingOrders,
        onWayOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return c.json({ error: `Failed to get stats: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);
