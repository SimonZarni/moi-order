import React, { useState } from 'react';
import { Search, MapPin, Bell, Star, Clock, DollarSign } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Restaurant } from '../CustomerApp';
import { CustomerView } from '../CustomerApp';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import logoImage from 'figma:asset/d9b396be573d50c630b38a68131d7e1630c854e7.png';
import { restaurants as restaurantsData } from '../../utils/restaurantsData';

interface HomeDashboardProps {
  onSearch: (query: string) => void;
  onRestaurantSelect: (restaurant: Restaurant) => void;
  onViewChange: (view: CustomerView) => void;
}

export function HomeDashboard({ onSearch, onRestaurantSelect, onViewChange }: HomeDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restaurants] = useState<Restaurant[]>(restaurantsData);

  // Mock data for categories
  const categories = [
    { id: 'all', name: 'All', emoji: '🍽️' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'burger', name: 'Burgers', emoji: '🍔' },
    { id: 'sushi', name: 'Sushi', emoji: '🍣' },
    { id: 'indian', name: 'Indian', emoji: '🍛' },
    { id: 'chinese', name: 'Chinese', emoji: '🥡' },
    { id: 'mexican', name: 'Mexican', emoji: '🌮' },
    { id: 'dessert', name: 'Desserts', emoji: '🍰' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const filteredRestaurants = selectedCategory === 'All' 
    ? restaurants 
    : restaurants.filter(restaurant => 
        restaurant.cuisine.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        categories.find(cat => cat.name === selectedCategory)?.name.toLowerCase().includes(restaurant.cuisine.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="MoiOrder" 
              className="h-10 w-auto"
            />
            <div className="border-l border-gray-300 h-10" />
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Deliver to</p>
                <p className="text-sm font-medium">123 Main St</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('notifications')}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for restaurants or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input-background border-0 h-12"
            onFocus={() => onViewChange('search')}
          />
        </form>
      </div>

      {/* Categories - Horizontal Scroll */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              size="sm"
              className={`flex-shrink-0 px-4 py-2 rounded-full ${
                selectedCategory === category.name 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Restaurants List */}
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">
            {selectedCategory === 'All' ? 'All Restaurants' : `${selectedCategory} Restaurants`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredRestaurants.length} restaurants
          </p>
        </div>

        {filteredRestaurants.map((restaurant) => (
          <Card 
            key={restaurant.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onRestaurantSelect(restaurant)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <ImageWithFallback
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-36 object-cover"
                />
                {!restaurant.isOpen && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="secondary" className="bg-white text-black">
                      Closed
                    </Badge>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white text-black">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {restaurant.rating}
                  </Badge>
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground">{restaurant.distance}</p>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{restaurant.cuisine}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>฿{restaurant.deliveryFee}</span>
                    </div>
                  </div>
                  
                  {restaurant.isOpen ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Open
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Closed
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="font-semibold mb-2">No restaurants found</h3>
          <p className="text-muted-foreground text-center">
            Try selecting a different category or search for something else.
          </p>
        </div>
      )}
    </div>
  );
}
