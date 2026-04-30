import React, { useState } from 'react';
import { MerchantLogin } from './merchant/MerchantLogin';
import { MerchantMain } from './merchant/MerchantMain';
import { OrderManagement } from './merchant/OrderManagement';
import { MenuManagement } from './merchant/MenuManagement';
import { AnalyticsDashboard } from './merchant/AnalyticsDashboard';
import { SettingsPage } from './merchant/SettingsPage';
import { RestaurantProfile } from './merchant/RestaurantProfile';
import { PayoutManagement } from './merchant/PayoutManagement';

export type MerchantView = 
  | 'login' 
  | 'dashboard' 
  | 'orders' 
  | 'menu' 
  | 'analytics' 
  | 'settings'
  | 'profile'
  | 'payouts';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

export interface MerchantOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'new' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderTime: string;
  deliveryAddress: string;
  estimatedDeliveryTime?: string;
  paymentMethod: string;
  notes?: string;
}

interface MerchantDashboardProps {
  onBack: () => void;
}

export function MerchantDashboard({ onBack }: MerchantDashboardProps) {
  const [currentView, setCurrentView] = useState<MerchantView>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('login');
  };

  if (!isLoggedIn) {
    return (
      <MerchantLogin 
        onLogin={handleLogin}
        onBack={onBack}
      />
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <MerchantMain 
            onViewChange={setCurrentView}
            onLogout={handleLogout}
          />
        );
      case 'orders':
        return (
          <OrderManagement 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'menu':
        return (
          <MenuManagement 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'analytics':
        return (
          <AnalyticsDashboard 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'settings':
        return (
          <SettingsPage 
            onBack={() => setCurrentView('dashboard')}
            onLogout={handleLogout}
          />
        );
      case 'profile':
        return (
          <RestaurantProfile 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'payouts':
        return (
          <PayoutManagement 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return (
          <MerchantMain 
            onViewChange={setCurrentView}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentView()}
    </div>
  );
}