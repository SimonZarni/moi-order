import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, ShoppingBag, Clock, CheckCircle, XCircle, ChefHat, Truck, Receipt
} from 'lucide-react';
import { Order } from '../CustomerApp';

interface OrdersScreenProps {
  orders: Order[];
  onViewReceipt: (order: Order) => void;
  onTrackOrder: (order: Order) => void;
  onNavigate: (view: string) => void;
}

export const OrdersScreen = ({ orders, onViewReceipt, onTrackOrder, onNavigate }: OrdersScreenProps) => {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');

  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'on-way'].includes(order.status)
  );
  const completedOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  const displayOrders = selectedTab === 'active' ? activeOrders : completedOrders;

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { 
          icon: Clock, 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          label: 'Pending'
        };
      case 'confirmed':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Confirmed'
        };
      case 'preparing':
        return { 
          icon: ChefHat, 
          color: 'text-[#FF7A00]',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          label: 'Preparing'
        };
      case 'on-way':
        return { 
          icon: Truck, 
          color: 'text-[#224e4a]',
          bgColor: 'bg-[#224e4a]/10',
          borderColor: 'border-[#224e4a]/20',
          label: 'On the Way'
        };
      case 'delivered':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Delivered'
        };
      case 'cancelled':
        return { 
          icon: XCircle, 
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Cancelled'
        };
      default:
        return { 
          icon: Clock, 
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Unknown'
        };
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-[#224e4a] text-white p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('main-home')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">My Orders</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setSelectedTab('active')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'active'
                ? 'text-[#224e4a]'
                : 'text-gray-500'
            }`}
          >
            Active
            {activeOrders.length > 0 && (
              <Badge className="ml-2 bg-[#FF7A00] text-white">{activeOrders.length}</Badge>
            )}
            {selectedTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'completed'
                ? 'text-[#224e4a]'
                : 'text-gray-500'
            }`}
          >
            Completed
            {selectedTab === 'completed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-4">
        {displayOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-semibold mb-2">No {selectedTab} orders</h3>
            <p className="text-muted-foreground text-center mb-4">
              {selectedTab === 'active' 
                ? 'You don\'t have any active orders at the moment'
                : 'Your completed orders will appear here'
              }
            </p>
            <Button 
              onClick={() => onNavigate('food-home')}
              className="bg-[#224e4a] hover:bg-[#1a3a37] text-white"
            >
              Browse Restaurants
            </Button>
          </div>
        ) : (
          displayOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={order.id} className="overflow-hidden">
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{order.restaurantName}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Order #{order.id} • {order.orderTime}
                      </p>
                    </div>
                    <Badge 
                      className={`${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>

                  {/* Order Items Summary */}
                  <div className="mb-3 py-3 border-t border-b">
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">
                          +{order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Total and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-semibold text-[#224e4a]">฿{order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewReceipt(order)}
                      >
                        <Receipt className="w-4 h-4 mr-1" />
                        Receipt
                      </Button>
                      {selectedTab === 'active' && (
                        <Button
                          size="sm"
                          className="bg-[#224e4a] hover:bg-[#1a3a37] text-white"
                          onClick={() => onTrackOrder(order)}
                        >
                          Track
                        </Button>
                      )}
                      {selectedTab === 'completed' && order.status === 'delivered' && (
                        <Button
                          size="sm"
                          className="bg-[#224e4a] hover:bg-[#1a3a37] text-white"
                          onClick={() => onNavigate('food-home')}
                        >
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
