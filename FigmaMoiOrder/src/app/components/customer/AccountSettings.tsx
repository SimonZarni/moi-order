import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Bell, Shield, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Language, Translations } from '../../utils/translations';

interface AccountSettingsProps {
  onBack: () => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
  t: Translations;
}

export function AccountSettings({ onBack, language, onLanguageChange, t }: AccountSettingsProps) {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567'
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newRestaurants: true,
    recommendations: true
  });

  const [preferences, setPreferences] = useState({
    language: 'my',
    currency: 'THB',
    darkMode: false
  });

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (field: string, value: string | boolean) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">{t.settings.title}</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{t.settings.accountInformation}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.settings.fullName}</label>
                <Input
                  value={personalInfo.firstName}
                  onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={personalInfo.lastName}
                  onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.settings.email}</label>
              <Input
                type="email"
                value={personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.settings.phone}</label>
              <Input
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>{t.settings.notifications}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about your order status
                </p>
              </div>
              <Switch
                checked={notifications.orderUpdates}
                onCheckedChange={() => toggleNotification('orderUpdates')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotions & Offers</p>
                <p className="text-sm text-muted-foreground">
                  Receive special deals and discounts
                </p>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={() => toggleNotification('promotions')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Restaurants</p>
                <p className="text-sm text-muted-foreground">
                  Be the first to know about new restaurants
                </p>
              </div>
              <Switch
                checked={notifications.newRestaurants}
                onCheckedChange={() => toggleNotification('newRestaurants')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Recommendations</p>
                <p className="text-sm text-muted-foreground">
                  Get personalized food recommendations
                </p>
              </div>
              <Switch
                checked={notifications.recommendations}
                onCheckedChange={() => toggleNotification('recommendations')}
              />
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>{t.settings.preferences}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.settings.language}</label>
              <Select 
                value={language || 'en'} 
                onValueChange={(value) => {
                  if (onLanguageChange) {
                    onLanguageChange(value as Language);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="my">မြန်မာဘာသာ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select 
                value={preferences.currency} 
                onValueChange={(value) => handlePreferenceChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THB">THB (฿)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Use dark theme for the app
                </p>
              </div>
              <Switch
                checked={preferences.darkMode}
                onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>{t.settings.security}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              {t.settings.changePassword}
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              {t.settings.twoFactor}
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              Login Activity
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full bg-primary text-primary-foreground">
          {t.settings.saveChanges}
        </Button>

        {/* Account Actions */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Button 
              variant="outline" 
              className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              {t.delete} Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}