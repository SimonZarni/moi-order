import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { ArrowLeft, MapPin, CreditCard, Wallet, Banknote, Check, QrCode, Upload, X } from 'lucide-react';
import { CartItem, Order } from '../CustomerApp';

interface CheckoutViewProps {
  cartItems: CartItem[];
  onPlaceOrder: (order: Order) => void;
  onNavigate: (screen: string) => void;
}

export const CheckoutView = ({ cartItems, onPlaceOrder, onNavigate }: CheckoutViewProps) => {
  const [deliveryAddress, setDeliveryAddress] = useState('123 Main Street, Apt 4B');
  const [phoneNumber, setPhoneNumber] = useState('+66 123 456 789');
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'card' | 'wallet' | 'promptpay'>('promptpay');
  const [note, setNote] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProof = () => {
    setPaymentProof(null);
    setPaymentProofPreview(null);
  };

  const canPlaceOrder = () => {
    if (selectedPayment === 'promptpay') {
      return paymentProof !== null;
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      onNavigate('cart');
      return;
    }

    if (!canPlaceOrder()) {
      alert('Please upload payment proof before placing order');
      return;
    }

    const order: Order = {
      id: Date.now().toString(),
      restaurantName: cartItems[0].restaurantName,
      items: cartItems,
      total,
      status: 'pending',
      estimatedDelivery: '30-45 min',
      orderTime: new Date().toLocaleString(),
      deliveryAddress,
      phoneNumber,
      paymentMethod: selectedPayment,
      paymentProof: paymentProofPreview || undefined,
      note: note || undefined
    };
    onPlaceOrder(order);
  };

  const paymentMethods = [
    { id: 'promptpay', name: 'PromptPay', icon: QrCode },
    { id: 'cash', name: 'Cash on Delivery', icon: Banknote },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-[#224e4a] text-white p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('cart')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Checkout</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button 
              onClick={() => onNavigate('home')}
              className="mt-4 bg-[#224e4a] hover:bg-[#1a3a37] text-white"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Delivery Address */}
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <MapPin className="w-5 h-5 mr-2 text-[#224e4a]" />
                <h3 className="font-semibold">Delivery Address</h3>
              </div>
              <Input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery address"
                className="mb-2"
              />
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
              />
            </Card>

            {/* Order Summary */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                    <span className="font-medium">฿{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>฿{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>฿{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>฿{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[#224e4a]">฿{total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Payment Method</h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id as any)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      selectedPayment === method.id
                        ? 'border-[#224e4a] bg-[#224e4a]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <method.icon className={`w-5 h-5 mr-3 ${
                        selectedPayment === method.id ? 'text-[#224e4a]' : 'text-gray-400'
                      }`} />
                      <span className={selectedPayment === method.id ? 'font-medium' : ''}>
                        {method.name}
                      </span>
                    </div>
                    {selectedPayment === method.id && (
                      <Check className="w-5 h-5 text-[#224e4a]" />
                    )}
                  </button>
                ))}
              </div>

              {/* PromptPay QR Code and Upload */}
              {selectedPayment === 'promptpay' && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  {/* QR Code */}
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-48 h-48 mx-auto bg-white rounded-lg p-4 shadow-sm mb-3">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021129370016A000000677010111011300669876543215802TH5303764540${total.toFixed(2)}5802TH6304`}
                        alt="PromptPay QR Code" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-sm font-medium text-[#224e4a] mb-1">Scan to Pay</p>
                    <p className="text-sm text-muted-foreground">Amount: ฿{total.toFixed(2)}</p>
                  </div>

                  {/* Payment Proof Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Upload Payment Screenshot <span className="text-red-500">*</span>
                    </label>
                    {!paymentProofPreview ? (
                      <label className="block">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#224e4a] transition-colors">
                          <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700">Click to upload</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      </label>
                    ) : (
                      <div className="relative">
                        <img 
                          src={paymentProofPreview} 
                          alt="Payment Proof" 
                          className="w-full h-48 object-cover rounded-lg border-2 border-green-500"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveProof}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Uploaded
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> Please complete the payment and upload your payment screenshot to proceed with your order.
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Order Note */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Add Note (Optional)</h3>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any special instructions?"
                className="w-full"
              />
            </Card>

            {/* Place Order Button */}
            <Button 
              className="w-full h-12 bg-[#224e4a] hover:bg-[#1a3a37] text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handlePlaceOrder}
              disabled={!canPlaceOrder()}
            >
              {selectedPayment === 'promptpay' && !paymentProof 
                ? 'Upload Payment Proof to Continue'
                : `Place Order • ฿${total.toFixed(2)}`
              }
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
