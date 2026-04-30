import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowLeft, Download, Share2, CheckCircle, Store, MapPin, Clock } from 'lucide-react';
import { Order } from '../CustomerApp';

interface OrderReceiptProps {
  order: Order;
  onBack: () => void;
}

export const OrderReceipt = ({ order, onBack }: OrderReceiptProps) => {
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08;

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert('Receipt download feature - In a real app, this would download a PDF receipt');
  };

  const handleShare = () => {
    // In a real app, this would open share dialog
    alert('Share receipt feature - In a real app, this would open share options');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-[#224e4a] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold">Order Receipt</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-white hover:bg-white/20"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Success Indicator */}
        <Card className="p-6 text-center bg-green-50 border-green-200">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-green-700 mb-1">Payment Successful</h2>
          <p className="text-sm text-green-600">Thank you for your order!</p>
        </Card>

        {/* Receipt Details */}
        <Card className="p-6">
          <div className="text-center mb-6 pb-6 border-b">
            <h3 className="text-2xl font-bold text-[#224e4a] mb-1">MoiOrder</h3>
            <p className="text-sm text-muted-foreground">Tax Invoice / Receipt</p>
          </div>

          {/* Order Info */}
          <div className="space-y-3 mb-6 pb-6 border-b">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="font-medium">{order.orderTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium capitalize text-green-600">{order.status}</span>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="mb-6 pb-6 border-b">
            <div className="flex items-start mb-3">
              <Store className="w-5 h-5 mr-3 text-[#224e4a] mt-0.5" />
              <div>
                <p className="font-semibold">{order.restaurantName}</p>
                <p className="text-sm text-muted-foreground">Restaurant Partner</p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-6 pb-6 border-b">
            <div className="flex items-start mb-3">
              <MapPin className="w-5 h-5 mr-3 text-[#224e4a] mt-0.5" />
              <div>
                <p className="text-sm font-medium">Delivery Address</p>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-5 h-5 mr-3 text-[#224e4a] mt-0.5" />
              <div>
                <p className="text-sm font-medium">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">{order.estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-semibold mb-4">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">฿{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">฿{item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>฿{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>฿{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>฿{tax.toFixed(2)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total Paid</span>
              <span className="text-2xl font-bold text-[#224e4a]">฿{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">Cash on Delivery</span>
            </div>
          </div>
        </Card>

        {/* Footer Note */}
        <Card className="p-4 bg-gray-50">
          <p className="text-xs text-center text-muted-foreground">
            This is a digital receipt for your order. For any queries, please contact our support team.
          </p>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Thank you for choosing MoiOrder!
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button
            className="flex-1 h-12 bg-[#224e4a] hover:bg-[#1a3a37] text-white"
            onClick={onBack}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
