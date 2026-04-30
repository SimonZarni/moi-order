import React, { useState } from 'react';
import { ArrowLeft, Bell, Clock, DollarSign, Users, Shield, HelpCircle, LogOut, Settings, Store, Smartphone } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

interface SettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function SettingsPage({ onBack, onLogout }: SettingsPageProps) {
  // Notification settings state
  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    promotions: false,
    reviews: true,
    payouts: true,
    systemUpdates: false
  });

  // Restaurant operation settings
  const [operationSettings, setOperationSettings] = useState({
    autoAcceptOrders: false,
    tempClosed: false,
    maxOrdersPerHour: '20',
    avgPreparationTime: '25'
  });

  // Delivery settings
  const [deliverySettings, setDeliverySettings] = useState({
    deliveryRadius: '5',
    minimumOrder: '15',
    deliveryFee: '2.99',
    freeDeliveryThreshold: '25'
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleOperationSetting = (key: string) => {
    setOperationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingsSections = [
    {
      title: 'Notification Preferences',
      icon: Bell,
      items: [
        {
          key: 'newOrders',
          label: 'New Orders',
          description: 'Get notified when new orders are placed',
          value: notifications.newOrders
        },
        {
          key: 'orderUpdates',
          label: 'Order Status Updates',
          description: 'Updates on order preparation and delivery',
          value: notifications.orderUpdates
        },
        {
          key: 'reviews',
          label: 'Customer Reviews',
          description: 'New reviews and ratings from customers',
          value: notifications.reviews
        },
        {
          key: 'payouts',
          label: 'Payout Notifications',
          description: 'Payment transfers and financial updates',
          value: notifications.payouts
        },
        {
          key: 'promotions',
          label: 'Marketing Opportunities',
          description: 'Promotional campaigns and marketing tips',
          value: notifications.promotions
        },
        {
          key: 'systemUpdates',
          label: 'System Updates',
          description: 'App updates and maintenance notifications',
          value: notifications.systemUpdates
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Settings</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Restaurant Operations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Restaurant Operations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Accept Orders</p>
                <p className="text-sm text-muted-foreground">
                  Automatically accept orders within capacity
                </p>
              </div>
              <Switch
                checked={operationSettings.autoAcceptOrders}
                onCheckedChange={() => toggleOperationSetting('autoAcceptOrders')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Temporarily Closed</p>
                <p className="text-sm text-muted-foreground">
                  Stop accepting new orders temporarily
                </p>
              </div>
              <Switch
                checked={operationSettings.tempClosed}
                onCheckedChange={() => toggleOperationSetting('tempClosed')}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <label className="font-medium">Max Orders Per Hour</label>
              <Input
                type="number"
                value={operationSettings.maxOrdersPerHour}
                onChange={(e) => setOperationSettings(prev => ({
                  ...prev,
                  maxOrdersPerHour: e.target.value
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-medium">Average Preparation Time (minutes)</label>
              <Input
                type="number"
                value={operationSettings.avgPreparationTime}
                onChange={(e) => setOperationSettings(prev => ({
                  ...prev,
                  avgPreparationTime: e.target.value
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Delivery Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="font-medium">Delivery Radius (km)</label>
              <Input
                type="number"
                value={deliverySettings.deliveryRadius}
                onChange={(e) => setDeliverySettings(prev => ({
                  ...prev,
                  deliveryRadius: e.target.value
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-medium">Minimum Order Amount ($)</label>
              <Input
                type="number"
                value={deliverySettings.minimumOrder}
                onChange={(e) => setDeliverySettings(prev => ({
                  ...prev,
                  minimumOrder: e.target.value
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-medium">Delivery Fee ($)</label>
              <Input
                type="number"
                step="0.01"
                value={deliverySettings.deliveryFee}
                onChange={(e) => setDeliverySettings(prev => ({
                  ...prev,
                  deliveryFee: e.target.value
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-medium">Free Delivery Threshold ($)</label>
              <Input
                type="number"
                value={deliverySettings.freeDeliveryThreshold}
                onChange={(e) => setDeliverySettings(prev => ({
                  ...prev,
                  freeDeliveryThreshold: e.target.value
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        {settingsSections.map((section, index) => {
          const SectionIcon = section.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SectionIcon className="h-5 w-5" />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        checked={item.value}
                        onCheckedChange={() => toggleNotification(item.key)}
                      />
                    </div>
                    {itemIndex < section.items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>App Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-3" />
              Privacy & Security
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & Support
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-3" />
              Account Settings
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Button 
              variant="outline" 
              className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
            
            <p className="text-center text-xs text-muted-foreground">
              MoiOrder Merchant v1.0.0
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full bg-primary text-primary-foreground">
          Save Settings
        </Button>
      </div>
    </div>
  );
}