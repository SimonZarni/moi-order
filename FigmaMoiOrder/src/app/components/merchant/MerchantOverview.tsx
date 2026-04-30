import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Package, DollarSign, Star, CheckCircle, Plus, Edit3, BarChart3 } from 'lucide-react';

export const MerchantOverview = () => {
  const orders = [
    { id: '#1234', customer: 'John Doe', items: '2x Margherita Pizza, 1x Caesar Salad', total: 50.97, status: 'preparing', time: '10:30 AM' },
    { id: '#1235', customer: 'Jane Smith', items: '1x Pepperoni Pizza', total: 21.99, status: 'ready', time: '10:45 AM' },
    { id: '#1236', customer: 'Mike Johnson', items: '3x Garlic Bread, 1x Margherita Pizza', total: 39.96, status: 'new', time: '11:00 AM' }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Today's Orders</p>
              <p className="text-3xl font-bold text-primary">24</p>
              <p className="text-xs text-green-600 mt-1">↗ +12% vs yesterday</p>
            </div>
            <Package className="w-10 h-10 text-primary" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Revenue</p>
              <p className="text-3xl font-bold text-secondary">$486.50</p>
              <p className="text-xs text-green-600 mt-1">↗ +8% vs yesterday</p>
            </div>
            <DollarSign className="w-10 h-10 text-secondary" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
              <p className="text-3xl font-bold text-green-600">4.8</p>
              <p className="text-xs text-green-600 mt-1">↗ +0.2 this week</p>
            </div>
            <Star className="w-10 h-10 text-green-600" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-blue-600">98%</p>
              <p className="text-xs text-green-600 mt-1">↗ +2% this week</p>
            </div>
            <CheckCircle className="w-10 h-10 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Orders</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="font-semibold">{order.id}</p>
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'default' : 
                        order.status === 'ready' ? 'secondary' : 
                        order.status === 'new' ? 'destructive' : 'outline'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                  <p className="text-sm">{order.items}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">${order.total}</p>
                  <p className="text-sm text-muted-foreground">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Edit3 className="w-4 h-4 mr-2" />
                Update Hours
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Opening Time</span>
                <span className="text-sm font-medium">11:00 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Closing Time</span>
                <span className="text-sm font-medium">10:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Status</span>
                <Badge className="bg-green-100 text-green-800">Open</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};