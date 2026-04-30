import image_1589896b4fa930b22998f78d88ad56a6c78fdb97 from 'figma:asset/1589896b4fa930b22998f78d88ad56a6c78fdb97.png';
import image_2b86f331facdbad31dc5276746b2575c2a62e461 from 'figma:asset/2b86f331facdbad31dc5276746b2575c2a62e461.png';
import React, { useState } from 'react';
import { ChevronDown, Search, MapPin, ShoppingCart, Bell, UtensilsCrossed, FileText, Building, Newspaper, Grid3x3, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Translations } from '../../utils/translations';
import { Restaurant } from '../CustomerApp';
import { restaurants, getBestSellingItems } from '../../utils/restaurantsData';

interface MainHomeProps {
  onViewChange: (view: string) => void;
  cartItemCount: number;
  t: Translations;
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

export function MainHome({ onViewChange, cartItemCount, t, onRestaurantSelect }: MainHomeProps) {
  const [currentAddress, setCurrentAddress] = useState({
    name: 'မောင်တောထိတ်',
    address: '18/7 Soi Sukhumvit 23..'
  });

  const mainMenuItems = [
    {
      id: 'foods',
      title: t.services.foodOrder,
      subtitle: '693 Dishes',
      emoji: '🍔',
      view: 'food-home'
    },
    {
      id: 'attractions',
      title: t.services.places,
      subtitle: '120 Locations',
      emoji: '📍',
      view: 'places'
    },
    {
      id: '90-days',
      title: t.services.ninetyDaysReport,
      subtitle: 'Report Service',
      emoji: '📄',
      view: '90-days-report'
    },
    {
      id: 'embassy',
      title: t.services.embassyLetter,
      subtitle: 'Letter Service',
      emoji: '🏛️',
      view: 'embassy-letter'
    },
    {
      id: 'work permit',
      title: t.services.news,
      subtitle: 'Latest Updates',
      emoji: '📰',
      view: 'work-permit'
    },
    {
      id: 'news & others',
      title: t.services.otherServices,
      subtitle: 'More Options',
      emoji: '⚡',
      view: 'partnership'
    }
  ];

  const bestSellers = getBestSellingItems();

  const handleBestSellerClick = (itemId: string, restaurantId: string) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      onRestaurantSelect(restaurant);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 sticky top-0 z-10 border-b">
        {/* Address Section */}
        <div className="flex items-center justify-between mb-3">
          <div 
            className="flex items-center gap-2 flex-1 cursor-pointer"
            onClick={() => onViewChange('settings')}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="w-10 h-10 rounded-full bg-[#224e4a] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs">Bangkok</p>
              <p className="text-sm">{currentAddress.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => onViewChange('cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF7A00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Button>
            <div 
              className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 cursor-pointer border-2 border-[#FF7A00]"
              onClick={() => onViewChange('profile')}
            >
              <ImageWithFallback 
                src={image_1589896b4fa930b22998f78d88ad56a6c78fdb97}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search..."
            className="pl-10 rounded-full bg-muted/50 border-0"
            onClick={() => onViewChange('search')}
            readOnly
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Main Menu */}
        <div>
          <h2 className="mb-4">Main Menu</h2>
          <div className="grid grid-cols-2 gap-3">
            {mainMenuItems.map((item) => (
              <Card 
                key={item.id}
                className="cursor-pointer hover:shadow-lg transition-all glass-card"
                onClick={() => onViewChange(item.view)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="text-5xl mb-3">{item.emoji}</div>
                  <h3 className="mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advertisement Banner */}
        <Card 
          className="overflow-hidden border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => onViewChange('partnership')}
        >
          <div className="relative bg-gradient-to-r from-gray-100 to-gray-200">
            <div className="relative w-full aspect-[16/10] overflow-hidden">
              <ImageWithFallback 
                src={image_2b86f331facdbad31dc5276746b2575c2a62e461}
                alt="Advertisement"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </Card>

        {/* Best Sellers */}
        <div>
          <h2 className="mb-4">Best Sellers</h2>
          <div className="grid grid-cols-2 gap-3">
            {bestSellers.map((seller) => (
              <Card 
                key={seller.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleBestSellerClick(seller.id, seller.restaurantId)}
              >
                <div className="relative h-28">
                  <ImageWithFallback 
                    src={seller.image}
                    alt={seller.mealName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="font-medium line-clamp-1">{seller.mealName}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{seller.restaurant}</p>
                  <p className="text-xs text-[#FF7A00] mt-1">🔥 {seller.sold}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Exchange Rate Banner */}
        <Card 
          className="overflow-hidden border-0 bg-[#FFC107] text-black shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => onViewChange('exchange-service')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">MMK / THB</span>
              <span className="font-medium">796 THB = 100,000 Kyats</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
