import React from 'react';
import { Button } from '../ui/button';
import { Home, ClipboardList, Bell, User } from 'lucide-react';
import { Translations } from '../../utils/translations';

interface BottomNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  cartItemCount: number;
  t: Translations;
}

export function BottomNavigation({ currentView, onViewChange, cartItemCount, t }: BottomNavigationProps) {
  const tabs = [
    { id: 'main-home', icon: Home, label: t.nav.home },
    { id: 'orders', icon: ClipboardList, label: t.nav.orders },
    { id: 'notifications', icon: Bell, label: t.nav.notifications },
    { id: 'profile', icon: User, label: t.nav.profile },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="max-w-md mx-auto glass-card rounded-3xl shadow-2xl">
        <div className="flex items-center justify-around py-3 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id || 
                           (tab.id === 'main-home' && (currentView === 'main-home' || currentView === 'food-home')) ||
                           (tab.id === 'orders' && (currentView === 'orders' || currentView === 'tracking' || currentView === 'order-receipt'));
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center p-2 h-auto gap-1 rounded-2xl transition-all ${
                  isActive 
                    ? 'text-[#224e4a] bg-[#224e4a]/10 font-bold' 
                    : 'text-muted-foreground font-normal'
                }`}
                onClick={() => onViewChange(tab.id)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-xs">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}