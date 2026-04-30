import React, { useState } from 'react';
import { AdminLogin } from './admin/AdminLogin';
import { AdminMain } from './admin/AdminMain';
import { SystemOverview } from './admin/SystemOverview';
import { UserManagement } from './admin/UserManagement';
import { MerchantOnboarding } from './admin/MerchantOnboarding';
import { DisputeCenter } from './admin/DisputeCenter';

export type AdminView = 
  | 'login' 
  | 'dashboard' 
  | 'system' 
  | 'users' 
  | 'merchants' 
  | 'disputes';

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('login');
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
      <AdminLogin 
        onLogin={handleLogin}
        onBack={onBack}
      />
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <AdminMain 
            onViewChange={setCurrentView}
            onLogout={handleLogout}
          />
        );
      case 'system':
        return (
          <SystemOverview 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'users':
        return (
          <UserManagement 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'merchants':
        return (
          <MerchantOnboarding 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'disputes':
        return (
          <DisputeCenter 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return (
          <AdminMain 
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