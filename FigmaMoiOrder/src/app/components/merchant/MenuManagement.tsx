import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit, Eye, EyeOff, Trash2, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';

interface MenuManagementProps {
  onBack: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  image?: string;
}

export function MenuManagement({ onBack }: MenuManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddItem, setShowAddItem] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: '',
    isAvailable: true
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Fresh tomatoes, mozzarella cheese, fresh basil, and olive oil',
      price: 12.99,
      category: 'Pizza',
      isAvailable: true,
      preparationTime: 15
    },
    {
      id: '2',
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni with mozzarella cheese and tomato sauce',
      price: 14.99,
      category: 'Pizza',
      isAvailable: true,
      preparationTime: 15
    },
    {
      id: '3',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce, parmesan cheese, croutons, caesar dressing',
      price: 8.99,
      category: 'Salads',
      isAvailable: false,
      preparationTime: 8
    },
    {
      id: '4',
      name: 'Garlic Bread',
      description: 'Fresh baked bread with garlic butter and herbs',
      price: 6.99,
      category: 'Appetizers',
      isAvailable: true,
      preparationTime: 10
    },
    {
      id: '5',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
      price: 7.99,
      category: 'Desserts',
      isAvailable: true,
      preparationTime: 5
    }
  ]);

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.category) return;

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      category: newItem.category,
      preparationTime: parseInt(newItem.preparationTime) || 10,
      isAvailable: newItem.isAvailable
    };

    setMenuItems(prev => [...prev, item]);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: '',
      preparationTime: '',
      isAvailable: true
    });
    setShowAddItem(false);
  };

  const deleteItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">Menu Management</h1>
          </div>
          
          <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Item Name</label>
                  <Input
                    placeholder="e.g., Margherita Pizza"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe the dish..."
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="12.99"
                      value={newItem.price}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prep Time (min)</label>
                    <Input
                      type="number"
                      placeholder="15"
                      value={newItem.preparationTime}
                      onChange={(e) => setNewItem(prev => ({ ...prev, preparationTime: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    placeholder="e.g., Pizza, Salads, Appetizers"
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Available</label>
                  <Switch
                    checked={newItem.isAvailable}
                    onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isAvailable: checked }))}
                  />
                </div>
                
                <Button onClick={handleAddItem} className="w-full">
                  Add Menu Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                className={`flex-shrink-0 ${
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Menu Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{menuItems.length}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {menuItems.filter(item => item.isAvailable).length}
              </p>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {menuItems.filter(item => !item.isAvailable).length}
              </p>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant="outline">{item.category}</Badge>
                      {item.isAvailable ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Eye className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                      <span className="text-muted-foreground">
                        Prep time: {item.preparationTime} min
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={() => toggleAvailability(item.id)}
                    />
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="font-semibold mb-2">No menu items found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search terms' : 'Add your first menu item to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}