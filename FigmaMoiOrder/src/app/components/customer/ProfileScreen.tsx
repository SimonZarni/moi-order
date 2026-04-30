import image_1589896b4fa930b22998f78d88ad56a6c78fdb97 from 'figma:asset/1589896b4fa930b22998f78d88ad56a6c78fdb97.png';
import image_2b86f331facdbad31dc5276746b2575c2a62e461 from 'figma:asset/2b86f331facdbad31dc5276746b2575c2a62e461.png';
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  User, History, Heart, MapPin, CreditCard, Bell, HelpCircle, Settings, LogOut,
  FileText, MessageSquare, Bookmark, Camera, Loader2
} from 'lucide-react';
import { Translations } from '../../utils/translations';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  profilePicture: string | null;
  createdAt: string;
  updatedAt?: string;
}

interface ProfileScreenProps {
  onViewChange: (view: string) => void;
  onLogout: () => void;
  t: Translations;
  userProfile: UserProfile | null;
  onProfileUpdate: () => void;
}

export const ProfileScreen = ({ 
  onViewChange, 
  onLogout,
  t,
  userProfile,
  onProfileUpdate
}: ProfileScreenProps) => {
  const memberSinceDate = 'Dec 2025';

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={image_1589896b4fa930b22998f78d88ad56a6c78fdb97} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className="text-xl">Hein Naung Htoot</h1>
            <p className="text-sm opacity-90">guest@moiorder.com</p>
            <p className="text-xs opacity-75">{t.profile.memberSince} {memberSinceDate}</p>
          </div>
        </div>
      </div>

    <div className="p-4 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center glass-card">
          <p className="text-2xl text-primary">47</p>
          <p className="text-xs text-muted-foreground">{t.profile.orders}</p>
        </Card>
        <Card className="p-4 text-center glass-card">
          <p className="text-2xl text-secondary">4.8</p>
          <p className="text-xs text-muted-foreground">{t.profile.avgRating}</p>
        </Card>
        <Card className="p-4 text-center glass-card">
          <p className="text-2xl text-primary">฿5.2K</p>
          <p className="text-xs text-muted-foreground">{t.profile.totalSpent}</p>
        </Card>
      </div>

      {/* Menu Options */}
      <div className="space-y-1">
        {[
          { icon: History, label: t.profile.orderHistory, screen: 'tracking' },
          { icon: Heart, label: t.profile.favoriteRestaurants, screen: 'favorite-restaurants' },
          { icon: MapPin, label: t.profile.savedAddresses, screen: 'saved-addresses' },
          { icon: CreditCard, label: t.profile.paymentMethods, screen: 'payment-methods' },
          { icon: FileText, label: t.profile.reports, screen: 'reports' },
          { icon: MessageSquare, label: t.profile.helpSupport, screen: 'support' },
          { icon: Settings, label: t.profile.settings, screen: 'settings' },
          { icon: Bookmark, label: t.profile.bookmarks, screen: 'bookmarks' },
        ].map((item, index) => (
          <Card key={index} className="p-4 cursor-pointer hover:bg-muted/50 transition-colors glass-card" onClick={() => onViewChange(item.screen)}>
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1">{item.label}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Logout */}
      <Card className="p-4 cursor-pointer hover:bg-destructive/5 transition-colors border-destructive/20 glass-card" onClick={onLogout}>
        <div className="flex items-center space-x-3 text-destructive">
          <LogOut className="w-5 h-5" />
          <span className="flex-1">{t.profile.logout}</span>
        </div>
      </Card>
    </div>
  </div>
  );
};