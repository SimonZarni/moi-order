import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, ShoppingCart, Star, Clock, Truck, Heart, Plus, Minus
} from 'lucide-react';
import { Restaurant, MenuItem, CartItem } from '../CustomerApp';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface RestaurantViewProps {
  restaurant: Restaurant;
  cartItems: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onUpdateCartItem: (itemId: string, customizations: string[] | undefined, newQuantity: number) => void;
  onBack: () => void;
  onNavigate: (view: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const RestaurantView = ({
  restaurant,
  cartItems,
  onAddToCart,
  onUpdateCartItem,
  onBack,
  onNavigate,
  isFavorite,
  onToggleFavorite
}: RestaurantViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const menuItems = restaurant.menu || [];
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  // Helper function to get cart item quantity
  const getCartItemQuantity = (itemId: string) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Restaurant Header */}
      <div className="relative">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('cart')}
          className="fixed top-4 right-4 bg-background/60 backdrop-blur-md hover:bg-background/70 z-50"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartItems.length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs text-white flex items-center justify-center">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          )}
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Restaurant Info */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFavorite}
            >
              <Heart className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
          </div>
          <p className="text-muted-foreground mb-4">{restaurant.cuisine} cuisine</p>
          
          <div className="flex items-center space-x-6 mb-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-1 text-yellow-500 fill-current" />
              <span className="font-medium">{restaurant.rating}</span>
              <span className="text-muted-foreground ml-1">(500+ ratings)</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Truck className="w-4 h-4 mr-1" />
              <span>฿{restaurant.deliveryFee} delivery</span>
            </div>
          </div>

          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3 mb-4">
            <p className="text-secondary font-medium text-sm">
              🎉 Free delivery on orders over $25
            </p>
          </div>

          {!restaurant.isOpen && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
              <p className="text-destructive font-medium text-sm">
                ⏰ Currently closed • Opens at 11:00 AM
              </p>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Menu</h3>
          {menuItems
            .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
            .map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-lg">{item.name}</h4>
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {item.description}
                    </p>
                    
                    {item.allergens && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.allergens.map((allergen) => (
                          <Badge key={allergen} variant="outline" className="text-xs">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-primary">฿{item.price}</p>
                      {getCartItemQuantity(item.id) > 0 ? (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => {
                              const currentQuantity = getCartItemQuantity(item.id);
                              onUpdateCartItem(item.id, undefined, currentQuantity - 1);
                            }}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold min-w-[20px] text-center">
                            {getCartItemQuantity(item.id)}
                          </span>
                          <Button
                            onClick={() => {
                              const currentQuantity = getCartItemQuantity(item.id);
                              onUpdateCartItem(item.id, undefined, currentQuantity + 1);
                            }}
                            size="sm"
                            className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => {
                            const cartItem: CartItem = {
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              quantity: 1,
                              restaurantId: restaurant.id,
                              restaurantName: restaurant.name,
                              image: item.image,
                              description: item.description
                            };
                            onAddToCart(cartItem);
                          }}
                          disabled={!item.available}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          {item.available ? (
                            <>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </>
                          ) : (
                            'Unavailable'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};