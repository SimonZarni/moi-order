import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Plus, Edit, Trash2, Shield, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface PaymentMethodsProps {
  onBack: () => void;
}

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'paypal' | 'apple-pay';
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  holderName: string;
}

export function PaymentMethods({ onBack }: PaymentMethodsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      lastFour: '1234',
      expiryMonth: '12',
      expiryYear: '25',
      isDefault: true,
      holderName: 'John Smith'
    },
    {
      id: '2',
      type: 'mastercard',
      lastFour: '5678',
      expiryMonth: '08',
      expiryYear: '26',
      isDefault: false,
      holderName: 'John Smith'
    }
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: ''
  });

  const getCardIcon = (type: string) => {
    const icons: Record<string, string> = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      paypal: '🟦',
      'apple-pay': '🍎'
    };
    return icons[type] || '💳';
  };

  const getCardName = (type: string) => {
    const names: Record<string, string> = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      paypal: 'PayPal',
      'apple-pay': 'Apple Pay'
    };
    return names[type] || 'Card';
  };

  const setAsDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleAddCard = () => {
    const cardType = getCardType(newCard.cardNumber);
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: cardType,
      lastFour: newCard.cardNumber.slice(-4),
      expiryMonth: newCard.expiryMonth,
      expiryYear: newCard.expiryYear,
      isDefault: paymentMethods.length === 0,
      holderName: newCard.holderName
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    setNewCard({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      holderName: ''
    });
    setShowAddCard(false);
  };

  const getCardType = (cardNumber: string): 'visa' | 'mastercard' | 'amex' => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'visa';
    if (firstDigit === '5') return 'mastercard';
    return 'visa'; // default
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return year.toString().slice(-2);
  });

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return month;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Payment Methods</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Security Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-primary">Secure Payment</h3>
                <p className="text-sm text-primary/80 mt-1">
                  Your payment information is encrypted and secure. We never store your full card details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Saved Payment Methods</h2>
            <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cardholder Name</label>
                    <Input
                      placeholder="John Smith"
                      value={newCard.holderName}
                      onChange={(e) => setNewCard(prev => ({ ...prev, holderName: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card Number</label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(newCard.cardNumber)}
                      onChange={(e) => setNewCard(prev => ({ ...prev, cardNumber: e.target.value.replace(/\s/g, '') }))}
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Month</label>
                      <Select
                        value={newCard.expiryMonth}
                        onValueChange={(value) => setNewCard(prev => ({ ...prev, expiryMonth: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map(month => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Year</label>
                      <Select
                        value={newCard.expiryYear}
                        onValueChange={(value) => setNewCard(prev => ({ ...prev, expiryYear: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="YY" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVV</label>
                      <Input
                        placeholder="123"
                        value={newCard.cvv}
                        onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value }))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleAddCard}
                    className="w-full"
                    disabled={!newCard.cardNumber || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv || !newCard.holderName}
                  >
                    Add Payment Method
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {paymentMethods.map((method) => (
            <Card key={method.id} className={method.isDefault ? 'border-primary' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getCardIcon(method.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">
                          {getCardName(method.type)} •••• {method.lastFour}
                        </p>
                        {method.isDefault && (
                          <Badge className="bg-primary text-primary-foreground">
                            <Check className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.holderName} • Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAsDefault(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePaymentMethod(method.id)}
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {paymentMethods.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Payment Methods</h3>
                <p className="text-muted-foreground mb-4">
                  Add a payment method to start ordering food
                </p>
                <Button onClick={() => setShowAddCard(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Card
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
