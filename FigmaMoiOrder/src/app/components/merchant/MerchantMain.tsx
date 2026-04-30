import React from 'react';
import { 
  BarChart3, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Settings, 
  Menu as MenuIcon, 
  Bell, 
  TrendingUp,
  Clock,
  Star,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { MerchantView } from '../MerchantDashboard';

interface MerchantMainProps {
  onViewChange: (view: MerchantView) => void;
  onLogout: () => void;
}

export function MerchantMain({ onViewChange, onLogout }: MerchantMainProps) {
  // Mock data
  const stats = [
    {
      title: 'Today\'s Revenue',
      value: '$1,248',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Orders Today',
      value: '34',
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'text-blue-600'
    },
    {
      title: 'New Customers',
      value: '12',
      change: '+15.3%',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Avg Order Value',
      value: '$36.71',
      change: '+4.1%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      title: 'Order Management',
      description: 'View and manage incoming orders',
      icon: ShoppingBag,
      action: () => onViewChange('orders'),
      color: 'bg-blue-100 text-blue-700',
      badge: '3 new'
    },
    {
      title: 'Menu Management',
      description: 'Update your menu and pricing',
      icon: MenuIcon,
      action: () => onViewChange('menu'),
      color: 'bg-green-100 text-green-700'
    },
    {
      title: 'Analytics',
      description: 'View sales and performance data',
      icon: BarChart3,
      action: () => onViewChange('analytics'),
      color: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'Settings',
      description: 'Configure restaurant settings',
      icon: Settings,
      action: () => onViewChange('settings'),
      color: 'bg-gray-100 text-gray-700'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'John Smith',
      items: 2,
      total: 32.97,
      time: '10:30 AM',
      status: 'preparing'
    },
    {
      id: 'ORD-002',
      customer: 'Sarah Johnson',
      items: 1,
      total: 23.98,
      time: '11:15 AM',
      status: 'ready'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Wilson',
      items: 3,
      total: 45.67,
      time: '11:45 AM',
      status: 'new'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl">Tony's Pizzeria</h1>
            <p className="text-sm text-muted-foreground">Dashboard Overview</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Restaurant Status */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-green-800">Restaurant is Open</p>
                  <p className="text-sm text-green-600">Accepting orders • Closes at 10:00 PM</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-green-300 text-green-700">
                Manage Hours
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="font-bold text-lg">{stat.value}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <TrendingUp className={`h-3 w-3 ${stat.color}`} />
                        <span className={`text-xs ${stat.color}`}>{stat.change}</span>
                      </div>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-start space-x-3 p-4 border rounded-lg hover:shadow-sm transition-all text-left"
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{action.title}</h3>
                        {action.badge && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm" onClick={() => onViewChange('orders')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer} • {order.items} items • {order.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">${order.total}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Important Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Peak Hours Approaching</p>
                <p className="text-sm text-yellow-700">
                  Lunch rush starts in 30 minutes. Make sure you're ready for increased orders.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Star className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">New Review</p>
                <p className="text-sm text-blue-700">
                  You received a 5-star review! "Amazing pizza and fast delivery."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Orders Completed</span>
                <span className="font-semibold">31/34</span>
              </div>
              <div className="flex justify-between">
                <span>Average Prep Time</span>
                <span className="font-semibold">18 min</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Menu Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Most Ordered</span>
                <span className="font-semibold">Margherita Pizza</span>
              </div>
              <div className="flex justify-between">
                <span>Trending Item</span>
                <span className="font-semibold">Caesar Salad</span>
              </div>
              <div className="flex justify-between">
                <span>Out of Stock</span>
                <span className="font-semibold text-red-600">0 items</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}