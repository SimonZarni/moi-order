import React, { useState } from 'react';
import { ArrowLeft, Search, Clock, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface SearchScreenProps {
  onSearch: (query: string) => void;
  onBack: () => void;
}

export function SearchScreen({ onSearch, onBack }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock recent searches
  const [recentSearches, setRecentSearches] = useState([
    'Pizza',
    'Burger',
    'Sushi',
    'Chinese food',
    'Italian restaurant'
  ]);

  // Mock popular searches
  const popularSearches = [
    'Pizza near me',
    'Fast food',
    'Healthy options',
    'Desserts',
    'Coffee',
    'Indian food',
    'Mexican cuisine',
    'Breakfast'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches(prev => [searchQuery.trim(), ...prev].slice(0, 5));
      }
      onSearch(searchQuery.trim());
    }
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const removeRecentSearch = (queryToRemove: string) => {
    setRecentSearches(prev => prev.filter(query => query !== queryToRemove));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Search</h1>
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
            autoFocus
          />
        </form>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent Searches</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRecentSearches}
                className="text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            <div className="space-y-2">
              {recentSearches.map((query, index) => (
                <Card key={index} className="hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4">
                      <div 
                        className="flex items-center space-x-3 flex-1"
                        onClick={() => handleRecentSearch(query)}
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{query}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecentSearch(query)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        <div>
          <h2 className="font-semibold mb-4">Popular Searches</h2>
          <div className="grid grid-cols-2 gap-3">
            {popularSearches.map((query, index) => (
              <Card 
                key={index} 
                className="hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => handleRecentSearch(query)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{query}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search Categories */}
        <div>
          <h2 className="font-semibold mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Fast Food', emoji: '🍔', color: 'bg-red-50 border-red-200' },
              { name: 'Pizza', emoji: '🍕', color: 'bg-orange-50 border-orange-200' },
              { name: 'Asian', emoji: '🍜', color: 'bg-yellow-50 border-yellow-200' },
              { name: 'Healthy', emoji: '🥗', color: 'bg-green-50 border-green-200' },
              { name: 'Desserts', emoji: '🍰', color: 'bg-pink-50 border-pink-200' },
              { name: 'Coffee', emoji: '☕', color: 'bg-brown-50 border-brown-200' },
            ].map((category, index) => (
              <Card 
                key={index}
                className={`hover:shadow-sm transition-shadow cursor-pointer ${category.color}`}
                onClick={() => handleRecentSearch(category.name)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.emoji}</div>
                  <span className="text-sm font-medium">{category.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}