import React, { useState } from 'react';
import { ArrowLeft, Camera, Edit, MapPin, Clock, Phone, Mail, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

interface RestaurantProfileProps {
  onBack: () => void;
}

export function RestaurantProfile({ onBack }: RestaurantProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Tony's Pizzeria",
    description: "Authentic Italian pizza made with fresh ingredients and traditional recipes passed down through generations.",
    cuisine: "Italian",
    phone: "+1 (555) 123-4567",
    email: "contact@tonyspizzeria.com",
    address: "123 Main Street, Downtown",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    operatingHours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM"
    }
  });

  const stats = {
    rating: 4.8,
    totalReviews: 1247,
    totalOrders: 8439,
    avgDeliveryTime: "28 min"
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">Restaurant Profile</h1>
          </div>
          
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={isEditing ? "bg-primary text-primary-foreground" : ""}
            variant={isEditing ? "default" : "outline"}
          >
            {isEditing ? "Save Changes" : <><Edit className="h-4 w-4 mr-2" />Edit</>}
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Restaurant Hero */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                {isEditing && (
                  <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={restaurantInfo.name}
                      onChange={(e) => setRestaurantInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="font-semibold text-lg"
                    />
                    <Textarea
                      value={restaurantInfo.description}
                      onChange={(e) => setRestaurantInfo(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="font-bold text-xl mb-2">{restaurantInfo.name}</h2>
                    <p className="text-muted-foreground mb-3">{restaurantInfo.description}</p>
                    <div className="flex items-center space-x-4">
                      <Badge>{restaurantInfo.cuisine}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{stats.rating}</span>
                        <span className="text-muted-foreground">({stats.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">{stats.rating}</span>
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="font-bold text-lg">{stats.totalReviews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="font-bold text-lg">{stats.totalOrders.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="font-bold text-lg">{stats.avgDeliveryTime}</p>
              <p className="text-sm text-muted-foreground">Avg Delivery</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                {isEditing ? (
                  <Input
                    value={restaurantInfo.phone}
                    onChange={(e) => setRestaurantInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                ) : (
                  <p className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{restaurantInfo.phone}</span>
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={restaurantInfo.email}
                    onChange={(e) => setRestaurantInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                ) : (
                  <p className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{restaurantInfo.email}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Street Address</label>
                  <Input
                    value={restaurantInfo.address}
                    onChange={(e) => setRestaurantInfo(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input
                      value={restaurantInfo.city}
                      onChange={(e) => setRestaurantInfo(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Input
                      value={restaurantInfo.state}
                      onChange={(e) => setRestaurantInfo(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ZIP Code</label>
                    <Input
                      value={restaurantInfo.zipCode}
                      onChange={(e) => setRestaurantInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-medium">{restaurantInfo.address}</p>
                <p className="text-muted-foreground">
                  {restaurantInfo.city}, {restaurantInfo.state} {restaurantInfo.zipCode}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Operating Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(restaurantInfo.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="font-medium capitalize">{day}</span>
                  {isEditing ? (
                    <Input
                      value={hours}
                      onChange={(e) => setRestaurantInfo(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          [day]: e.target.value
                        }
                      }))}
                      className="w-48"
                    />
                  ) : (
                    <span className="text-muted-foreground">{hours}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex space-x-3">
            <Button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground">
              Save Changes
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}