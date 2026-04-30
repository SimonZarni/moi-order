import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { 
  ArrowLeft, Plus, Minus, Trash2
} from 'lucide-react';
import { CartItem } from '../CustomerApp';
import { Translations } from '../../utils/translations';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onNavigate: (screen: string) => void;
  t: Translations;
}

export const CartView = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  t
}: CartViewProps) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleBack = () => {
    onNavigate('home');
  };

  return (
    <>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">{t.cart.title}</h1>
        </div>
      </div>

      <div className="min-h-screen bg-gray-100 pb-32">
        <div className="p-4 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🛒</div>
              <h3 className="text-xl font-semibold mb-2">{t.cart.empty}</h3>
              <p className="text-muted-foreground mb-8">
                {t.cart.emptyMessage}
              </p>
              <Button onClick={() => onNavigate('home')} className="bg-primary hover:bg-primary/90">
                {t.cart.browseCatalog}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <Card key={`${item.id}-${index}`} className="p-4 glass-card">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">🍽️</div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description ? item.description.split(',')[0] + '...' : 'Delicious item from ' + item.restaurantName}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-primary">${item.price}</p>
                          <div className="flex items-center space-x-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Add More Items */}
              <Card className="p-4 glass-card">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate('home')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add more items
                </Button>
              </Card>

              {/* Order Summary */}
              <Card className="p-6 glass-card">
                <h3 className="font-semibold mb-4">{t.checkout.orderSummary}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{t.cart.subtotal} ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} {t.cart.items})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.cart.deliveryFee}</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{t.cart.total}</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              {/* Remark Input */}
              <Card className="p-4 glass-card">
                <Input
                  placeholder={t.checkout.deliveryInstructions}
                  className="w-full"
                />
              </Card>

              {/* Checkout Button */}
              <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
                onClick={() => onNavigate('checkout')}
              >
                {t.cart.checkout} • ${total.toFixed(2)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};