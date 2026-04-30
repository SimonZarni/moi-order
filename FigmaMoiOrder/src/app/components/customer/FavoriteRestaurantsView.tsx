import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowLeft, Trash2, Star } from 'lucide-react';
import { Restaurant } from '../CustomerApp';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface FavoriteRestaurantsViewProps {
  favoriteRestaurants: Restaurant[];
  onRemoveFavorite: (restaurantId: string) => void;
  onRestaurantSelect: (restaurant: Restaurant) => void;
  onBack: () => void;
}

export const FavoriteRestaurantsView = ({
  favoriteRestaurants,
  onRemoveFavorite,
  onRestaurantSelect,
  onBack
}: FavoriteRestaurantsViewProps) => {
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Favorite Restaurants</h1>
        </div>
      </div>

      <div className="p-4">
        {favoriteRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">❤️</div>
            <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
            <p className="text-muted-foreground mb-8">
              Save your favorite restaurants to easily find them later
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="p-4 glass-card">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="font-medium cursor-pointer hover:text-primary transition-colors"
                      onClick={() => onRestaurantSelect(restaurant)}
                    >
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{restaurant.cuisine} cuisine</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                        {restaurant.rating}
                      </div>
                      <span>•</span>
                      <span>{restaurant.deliveryTime}</span>
                      <span>•</span>
                      <span>${restaurant.deliveryFee} delivery</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFavorite(restaurant.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};