import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, Star, Clock, Truck, Filter
} from 'lucide-react';
import { Restaurant } from '../CustomerApp';

interface SearchResultsProps {
  query: string;
  onRestaurantSelect: (restaurant: Restaurant) => void;
  onBack: () => void;
}

// Mock search results data - in a real app, this would come from an API
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    cuisine: 'Italian, Pizza',
    rating: 4.5,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    image: '🍕',
    distance: '1.2 km',
    isOpen: true,
    menu: []
  },
  {
    id: '2',
    name: 'Sushi World',
    cuisine: 'Japanese, Sushi, Asian',
    rating: 4.7,
    deliveryTime: '30-40 min',
    deliveryFee: 3.99,
    image: '🍣',
    distance: '2.1 km',
    isOpen: true,
    menu: []
  },
  {
    id: '3',
    name: 'Burger House',
    cuisine: 'American, Burgers, Fast Food',
    rating: 4.3,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    image: '🍔',
    distance: '0.8 km',
    isOpen: true,
    menu: []
  },
  {
    id: '4',
    name: 'Thai Spice',
    cuisine: 'Thai, Asian',
    rating: 4.6,
    deliveryTime: '35-45 min',
    deliveryFee: 2.49,
    image: '🍜',
    distance: '1.5 km',
    isOpen: false,
    menu: []
  },
  {
    id: '5',
    name: 'Taco Fiesta',
    cuisine: 'Mexican, Tacos',
    rating: 4.4,
    deliveryTime: '25-35 min',
    deliveryFee: 2.49,
    image: '🌮',
    distance: '1.8 km',
    isOpen: true,
    menu: []
  },
  {
    id: '6',
    name: 'Sweet Treats',
    cuisine: 'Desserts, Bakery',
    rating: 4.8,
    deliveryTime: '15-25 min',
    deliveryFee: 1.49,
    image: '🍰',
    distance: '0.5 km',
    isOpen: true,
    menu: []
  },
  {
    id: '7',
    name: 'Coffee Corner',
    cuisine: 'Coffee, Cafe',
    rating: 4.6,
    deliveryTime: '10-20 min',
    deliveryFee: 0.99,
    image: '☕',
    distance: '0.3 km',
    isOpen: true,
    menu: []
  },
  {
    id: '8',
    name: 'Green Bowl',
    cuisine: 'Healthy, Salads, Vegan',
    rating: 4.5,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    image: '🥗',
    distance: '1.1 km',
    isOpen: true,
    menu: []
  },
  {
    id: '9',
    name: 'Fast Bites',
    cuisine: 'Fast Food, Burgers',
    rating: 4.2,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    image: '🍟',
    distance: '0.9 km',
    isOpen: true,
    menu: []
  },
  {
    id: '10',
    name: 'Pizza Express',
    cuisine: 'Pizza, Italian',
    rating: 4.4,
    deliveryTime: '20-30 min',
    deliveryFee: 2.49,
    image: '🍕',
    distance: '1.3 km',
    isOpen: true,
    menu: []
  }
];

export const SearchResults = ({
  query,
  onRestaurantSelect,
  onBack
}: SearchResultsProps) => {
  // Filter restaurants based on search query
  const searchResults = mockRestaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-40">
        <div className="flex items-center space-x-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg">Search Results</h1>
            <p className="text-sm opacity-90">
              {searchResults.length} results for "{query}"
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {searchResults.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-xl mb-2">No restaurants found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any restaurants matching "{query}"
            </p>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Pizza', 'Sushi', 'Burgers', 'Thai', 'Tacos'].map((suggestion) => (
                  <Badge 
                    key={suggestion} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-white"
                    onClick={onBack}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((restaurant) => (
              <Card 
                key={restaurant.id} 
                className="glass-card p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary"
                onClick={() => onRestaurantSelect(restaurant)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {restaurant.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="truncate">{restaurant.name}</h4>
                      <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                        {!restaurant.isOpen && <Badge variant="secondary">Closed</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                          <span>{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{restaurant.deliveryTime}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Truck className="w-4 h-4 mr-1" />
                          <span>${restaurant.deliveryFee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};