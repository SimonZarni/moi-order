import React, { useState } from 'react';
import { ArrowLeft, Bell, Package, Star, Gift, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Translations } from '../../utils/translations';

interface NotificationScreenProps {
  onBack: () => void;
  t: Translations;
}

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'review' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

export function NotificationScreen({ onBack, t }: NotificationScreenProps) {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Delivered!',
      message: 'Your order from Tony\'s Pizzeria has been delivered. Enjoy your meal!',
      time: '5 minutes ago',
      isRead: false,
      icon: Package,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Special Offer! 🎉',
      message: 'Get 20% off your next order at Burger Palace. Use code SAVE20',
      time: '1 hour ago',
      isRead: false,
      icon: Gift,
      color: 'text-secondary'
    },
    {
      id: '3',
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order from Sushi Master is being prepared. Estimated delivery: 30-40 min',
      time: '2 hours ago',
      isRead: true,
      icon: Package,
      color: 'text-primary'
    },
    {
      id: '4',
      type: 'review',
      title: 'Rate Your Recent Order',
      message: 'How was your experience with Spice Garden? Your feedback helps us improve.',
      time: '1 day ago',
      isRead: true,
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: '5',
      type: 'system',
      title: 'App Update Available',
      message: 'Update MoiOrder to get the latest features and improvements.',
      time: '2 days ago',
      isRead: true,
      icon: AlertCircle,
      color: 'text-blue-600'
    },
    {
      id: '6',
      type: 'promotion',
      title: 'Free Delivery Weekend!',
      message: 'Enjoy free delivery on all orders this weekend. No minimum order required.',
      time: '3 days ago',
      isRead: true,
      icon: Gift,
      color: 'text-secondary'
    }
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === activeTab);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order': return 'Orders';
      case 'promotion': return 'Offers';
      case 'review': return 'Reviews';
      case 'system': return 'System';
      default: return 'All';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread notifications
                </p>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              className="text-primary hover:text-primary"
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-gray-100">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="order" className="text-xs">Orders</TabsTrigger>
            <TabsTrigger value="promotion" className="text-xs">Offers</TabsTrigger>
            <TabsTrigger value="review" className="text-xs">Reviews</TabsTrigger>
            <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notifications List */}
      <div className="px-4 py-4">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer hover:shadow-sm transition-shadow ${
                    !notification.isRead ? 'border-l-4 border-l-primary bg-blue-50/30' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      <div className={`mt-1 ${notification.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                        
                        <p className={`text-sm mt-1 ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">
              <Bell className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground text-center">
              {activeTab === 'all' 
                ? "You're all caught up! New notifications will appear here."
                : `No ${getTypeLabel(activeTab).toLowerCase()} notifications yet.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="px-4 pb-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Notification Settings</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Manage how and when you receive notifications
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Configure Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}