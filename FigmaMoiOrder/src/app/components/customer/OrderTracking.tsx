import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { ArrowLeft, CheckCircle, Clock, ChefHat, Truck, MapPin, Phone } from 'lucide-react';
import { Order } from '../CustomerApp';

interface OrderTrackingProps {
  order: Order;
  onNavigate: (screen: string) => void;
}

export const OrderTracking = ({ order, onNavigate }: OrderTrackingProps) => {
  const [showSuccess, setShowSuccess] = useState(true);

  useEffect(() => {
    // Show success animation for 2 seconds only on initial load
    const successTimer = setTimeout(() => {
      setShowSuccess(false);
    }, 2000);

    return () => {
      clearTimeout(successTimer);
    };
  }, []);

  // Use the actual order status from props (synced with admin changes)
  const orderStatus = order.status;

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { 
          icon: Clock, 
          color: 'text-yellow-500', 
          bgColor: 'bg-yellow-50',
          message: 'Waiting for admin approval',
          step: 0
        };
      case 'confirmed':
        return { 
          icon: CheckCircle, 
          color: 'text-green-500',
          bgColor: 'bg-green-50', 
          message: 'Order confirmed',
          step: 0
        };
      case 'preparing':
        return { 
          icon: ChefHat, 
          color: 'text-[#FF7A00]',
          bgColor: 'bg-orange-50', 
          message: 'Your delicious food is being prepared',
          step: 1
        };
      case 'on-way':
        return { 
          icon: Truck, 
          color: 'text-[#224e4a]',
          bgColor: 'bg-[#224e4a]/10', 
          message: 'Driver is on the way to you',
          step: 2
        };
      case 'delivered':
        return { 
          icon: CheckCircle, 
          color: 'text-green-500',
          bgColor: 'bg-green-50', 
          message: 'Order delivered successfully!',
          step: 3
        };
      case 'cancelled':
        return { 
          icon: CheckCircle, 
          color: 'text-red-500',
          bgColor: 'bg-red-50', 
          message: 'Order cancelled',
          step: 0
        };
      default:
        return { 
          icon: Clock, 
          color: 'text-gray-500',
          bgColor: 'bg-gray-50', 
          message: 'Processing...',
          step: 0
        };
    }
  };

  const statusInfo = getStatusInfo(orderStatus);
  const StatusIcon = statusInfo.icon;

  // Success overlay screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-green-600">Order Placed!</h1>
          <p className="text-lg text-muted-foreground mb-2">Your order has been successfully placed</p>
          <p className="text-sm text-muted-foreground">Order ID: #{order.id}</p>
        </div>
      </div>
    );
  }

  const trackingSteps = [
    { status: 'preparing', label: 'Preparing', icon: ChefHat },
    { status: 'on-way', label: 'On the Way', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = statusInfo.step;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-[#224e4a] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('main-home')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Track Order</h1>
              <p className="text-sm opacity-90">Order #{order.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <Card className={`p-6 ${statusInfo.bgColor} border-2 ${statusInfo.color.replace('text-', 'border-')}`}>
          <div className="text-center">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${statusInfo.bgColor}`}>
              <StatusIcon className={`w-10 h-10 ${statusInfo.color}`} />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {orderStatus === 'delivered' ? '🎉 Delivered!' : statusInfo.message}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {orderStatus === 'delivered' 
                ? 'Hope you enjoyed your meal!' 
                : `Estimated delivery: ${order.estimatedDelivery}`
              }
            </p>
          </div>
        </Card>

        {/* Progress Steps */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Order Progress</h3>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.status} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted 
                      ? isCurrent 
                        ? 'bg-[#224e4a] text-white' 
                        : 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-[#224e4a]">In progress...</p>
                    )}
                  </div>
                  {isCompleted && !isCurrent && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Delivery Info */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Delivery Information</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 text-[#224e4a] mt-0.5" />
              <div>
                <p className="text-sm font-medium">Delivery Address</p>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-5 h-5 mr-3 text-[#224e4a] mt-0.5" />
              <div>
                <p className="text-sm font-medium">Order Time</p>
                <p className="text-sm text-muted-foreground">{order.orderTime}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Order Details</h3>
          <div className="space-y-2 mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                <span className="font-medium">฿{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-[#224e4a]">฿{order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        {orderStatus !== 'delivered' && (
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              className="h-12"
              onClick={() => onNavigate('support')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button 
              className="h-12 bg-[#224e4a] hover:bg-[#1a3a37] text-white"
              onClick={() => onNavigate('main-home')}
            >
              Back to Home
            </Button>
          </div>
        )}

        {orderStatus === 'delivered' && (
          <Button 
            className="w-full h-12 bg-[#224e4a] hover:bg-[#1a3a37] text-white"
            onClick={() => onNavigate('main-home')}
          >
            Order Again
          </Button>
        )}
      </div>
    </div>
  );
};
