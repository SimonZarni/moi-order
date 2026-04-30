import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Phone, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { MerchantOrder, OrderItem } from '../MerchantDashboard';

interface OrderManagementProps {
  onBack: () => void;
}

export function OrderManagement({ onBack }: OrderManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState<MerchantOrder | null>(null);
  const [estimatedTime, setEstimatedTime] = useState('');
  
  // Mock orders data
  const [orders, setOrders] = useState<MerchantOrder[]>([
    {
      id: 'ORD-001',
      customerName: 'John Smith',
      customerPhone: '+1 (555) 123-4567',
      items: [
        { id: '1', name: 'Margherita Pizza', quantity: 2, price: 12.99, customizations: ['Extra cheese'] },
        { id: '2', name: 'Garlic Bread', quantity: 1, price: 6.99 }
      ],
      total: 32.97,
      status: 'new',
      orderTime: '10:30 AM',
      deliveryAddress: '123 Main St, Apt 4B',
      paymentMethod: 'Credit Card',
      notes: 'Please ring the doorbell'
    },
    {
      id: 'ORD-002',
      customerName: 'Sarah Johnson',
      customerPhone: '+1 (555) 987-6543',
      items: [
        { id: '3', name: 'Pepperoni Pizza', quantity: 1, price: 14.99 },
        { id: '4', name: 'Caesar Salad', quantity: 1, price: 8.99 }
      ],
      total: 23.98,
      status: 'confirmed',
      orderTime: '11:15 AM',
      deliveryAddress: '456 Oak Avenue',
      paymentMethod: 'Cash',
      estimatedDeliveryTime: '30-40 minutes'
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Wilson',
      customerPhone: '+1 (555) 456-7890',
      items: [
        { id: '5', name: 'Vegetarian Pizza', quantity: 1, price: 13.99 }
      ],
      total: 13.99,
      status: 'preparing',
      orderTime: '11:45 AM',
      deliveryAddress: '789 Pine Street',
      paymentMethod: 'Credit Card',
      estimatedDeliveryTime: '25-35 minutes'
    }
  ]);

  const updateOrderStatus = (orderId: string, newStatus: MerchantOrder['status'], deliveryTime?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, estimatedDeliveryTime: deliveryTime }
        : order
    ));
  };

  const getStatusColor = (status: MerchantOrder['status']) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800 border-red-200';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: MerchantOrder['status']) => {
    switch (status) {
      case 'new': return AlertCircle;
      case 'confirmed': return Clock;
      case 'preparing': return Clock;
      case 'ready': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const handleConfirmOrder = (order: MerchantOrder) => {
    if (!estimatedTime) {
      alert('Please set an estimated delivery time');
      return;
    }
    updateOrderStatus(order.id, 'confirmed', estimatedTime);
    setEstimatedTime('');
    setSelectedOrder(null);
  };

  const orderCounts = {
    all: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Order Management</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all" className="relative">
              All
              {orderCounts.all > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {orderCounts.all}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="new" className="relative">
              New
              {orderCounts.new > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                  {orderCounts.new}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {['all', 'new', 'confirmed', 'preparing', 'ready', 'completed'].map(status => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filterOrdersByStatus(status).map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(order.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <CardTitle className="text-base">Order #{order.id}</CardTitle>
                        </div>
                        <span className="text-sm text-muted-foreground">{order.orderTime}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Customer Info */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{order.customerPhone}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{order.paymentMethod}</p>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm">{order.deliveryAddress}</p>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <div>
                              <span>{item.quantity}x {item.name}</span>
                              {item.customizations && (
                                <p className="text-xs text-muted-foreground">
                                  {item.customizations.join(', ')}
                                </p>
                              )}
                            </div>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                          <MessageSquare className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <p className="text-sm text-yellow-800">{order.notes}</p>
                        </div>
                      )}

                      {/* Estimated Delivery Time */}
                      {order.estimatedDeliveryTime && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>Estimated delivery: {order.estimatedDeliveryTime}</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        {order.status === 'new' && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  className="flex-1 bg-primary text-primary-foreground"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  Accept Order
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Set Estimated Delivery Time</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-sm text-muted-foreground">
                                    Set the estimated delivery time for Order #{order.id}
                                  </p>
                                  <Input
                                    placeholder="e.g., 30-40 minutes"
                                    value={estimatedTime}
                                    onChange={(e) => setEstimatedTime(e.target.value)}
                                  />
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => setEstimatedTime('25-35 minutes')}
                                    >
                                      25-35 min
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => setEstimatedTime('30-40 minutes')}
                                    >
                                      30-40 min
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => setEstimatedTime('45-55 minutes')}
                                    >
                                      45-55 min
                                    </Button>
                                  </div>
                                  <Button 
                                    className="w-full"
                                    onClick={() => handleConfirmOrder(order)}
                                  >
                                    Confirm Order
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        
                        {order.status === 'confirmed' && (
                          <Button 
                            className="flex-1"
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                          >
                            Start Preparing
                          </Button>
                        )}
                        
                        {order.status === 'preparing' && (
                          <Button 
                            className="flex-1"
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                          >
                            Mark as Ready
                          </Button>
                        )}
                        
                        {order.status === 'ready' && (
                          <Button 
                            className="flex-1"
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                          >
                            Complete Order
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {filterOrdersByStatus(status).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No {status === 'all' ? '' : status} orders found
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}