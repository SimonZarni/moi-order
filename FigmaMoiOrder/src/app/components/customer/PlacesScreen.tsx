import React, { useState } from 'react';
import { ArrowLeft, MapPin, Star, Navigation, Heart, Clock, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PlacesScreenProps {
  onBack: () => void;
}

export function PlacesScreen({ onBack }: PlacesScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState<typeof places[0] | null>(null);

  const categories = [
    { id: 'all', name: 'All', icon: '🌏' },
    { id: 'temples', name: 'Temples', icon: '🛕' },
    { id: 'markets', name: 'Markets', icon: '🏪' },
    { id: 'museums', name: 'Museums', icon: '🏛️' },
    { id: 'parks', name: 'Parks', icon: '🌳' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' }
  ];

  const places = [
    {
      id: '1',
      name: 'Grand Palace',
      nameMyanmar: 'နန်းတော်ကြီး',
      category: 'temples',
      image: 'https://images.unsplash.com/photo-1678915554115-a5e2de853191?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHcmFuZCUyMFBhbGFjZSUyMEJhbmdrb2slMjBUaGFpbGFuZHxlbnwxfHx8fDE3NjQ3NTM5NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      distance: '5.2 km',
      openingHours: '8:30 AM - 3:30 PM',
      entryFee: '500 THB',
      description: 'The official residence of the Kings of Siam since 1782',
      latitude: 13.7500,
      longitude: 100.4917,
      address: 'Na Phra Lan Rd, Phra Borom Maha Ratchawang, Phra Nakhon, Bangkok 10200',
      highlights: ['Temple of the Emerald Buddha', 'Thai Architecture', 'Royal Residence']
    },
    {
      id: '2',
      name: 'Wat Pho',
      nameMyanmar: 'ဝတ်ဖို ဘုရား',
      category: 'temples',
      image: 'https://images.unsplash.com/photo-1650021858406-3222764ea1f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNsaW5pbmclMjBCdWRkaGElMjBXYXQlMjBQaG98ZW58MXx8fHwxNzY0NzUzOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      distance: '5.5 km',
      openingHours: '8:00 AM - 6:30 PM',
      entryFee: '200 THB',
      description: 'Famous for the giant reclining Buddha statue',
      latitude: 13.7465,
      longitude: 100.4927,
      address: '2 Sanam Chai Rd, Phra Borom Maha Ratchawang, Phra Nakhon, Bangkok 10200',
      highlights: ['46m Reclining Buddha', 'Traditional Thai Massage', 'Ancient Murals']
    },
    {
      id: '3',
      name: 'Chatuchak Market',
      nameMyanmar: 'ချတူချက် ဈေးကွက်',
      category: 'markets',
      image: 'https://images.unsplash.com/photo-1696437492959-b9a8c37df4ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGF0dWNoYWslMjB3ZWVrZW5kJTIwbWFya2V0JTIwQmFuZ2tva3xlbnwxfHx8fDE3NjQ3NTM5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      distance: '12.3 km',
      openingHours: 'Sat-Sun: 9:00 AM - 6:00 PM',
      entryFee: 'Free',
      description: 'One of the world\'s largest weekend markets',
      latitude: 13.7991,
      longitude: 100.5498,
      address: '587 10 Kamphaeng Phet 2 Rd, Chatuchak, Bangkok 10900',
      highlights: ['15,000+ Stalls', 'Vintage & Antiques', 'Street Food']
    },
    {
      id: '4',
      name: 'Lumpini Park',
      nameMyanmar: 'လုမ်ပီနီ ပန်းခြံ',
      category: 'parks',
      image: 'https://images.unsplash.com/photo-1558237834-e9590f99de20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMdW1waW5pJTIwUGFyayUyMEJhbmdrb2t8ZW58MXx8fHwxNzY0NzUzOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.5,
      distance: '3.8 km',
      openingHours: '4:30 AM - 9:00 PM',
      entryFee: 'Free',
      description: 'Bangkok\'s premier public park and green space',
      latitude: 13.7308,
      longitude: 100.5420,
      address: 'Rama IV Rd, Lumphini, Pathum Wan, Bangkok 10330',
      highlights: ['Jogging Tracks', 'Lake & Boats', 'Monitor Lizards']
    },
    {
      id: '5',
      name: 'Asiatique',
      nameMyanmar: 'အေရှတိတ် စျေးဆိုင်',
      category: 'shopping',
      image: 'https://images.unsplash.com/photo-1698305545703-87f2175370e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBc2lhdGlxdWUlMjByaXZlcmZyb250JTIwQmFuZ2tva3xlbnwxfHx8fDE3NjQ3NTM5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.4,
      distance: '8.5 km',
      openingHours: '4:00 PM - 12:00 AM',
      entryFee: 'Free',
      description: 'Night market and mall on the riverside',
      latitude: 13.7052,
      longitude: 100.5085,
      address: '2194 Charoen Krung Rd, Wat Phraya Krai, Bang Kho Laem, Bangkok 10120',
      highlights: ['1,500+ Boutiques', 'Riverside Dining', 'Ferris Wheel']
    },
    {
      id: '6',
      name: 'Jim Thompson House',
      nameMyanmar: 'ဂျင်သွန်ဆင် အိမ်',
      category: 'museums',
      image: 'https://images.unsplash.com/photo-1762616076842-6e51c486b3f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMFRoYWklMjBob3VzZSUyMG11c2V1bXxlbnwxfHx8fDE3NjQ3NTM5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      distance: '4.2 km',
      openingHours: '9:00 AM - 6:00 PM',
      entryFee: '200 THB',
      description: 'Museum showcasing Thai silk and architecture',
      latitude: 13.7466,
      longitude: 100.5346,
      address: '6 Soi Kasem San 2, Rama 1 Rd, Wang Mai, Pathum Wan, Bangkok 10330',
      highlights: ['Thai Silk Collection', 'Traditional Houses', 'Art Gallery']
    },
    {
      id: '7',
      name: 'Wat Arun',
      nameMyanmar: 'ဝတ်အရုန်း ဘုရား',
      category: 'temples',
      image: 'https://images.unsplash.com/photo-1631609030728-9b0b525b60cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxXYXQlMjBBcnVuJTIwdGVtcGxlJTIwQmFuZ2tva3xlbnwxfHx8fDE3NjQ3NTM5NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      distance: '6.1 km',
      openingHours: '8:00 AM - 6:00 PM',
      entryFee: '100 THB',
      description: 'Temple of Dawn with stunning riverside views',
      latitude: 13.7437,
      longitude: 100.4889,
      address: '158 Thanon Wang Doem, Wat Arun, Bangkok Yai, Bangkok 10600',
      highlights: ['Iconic Spire', 'Riverside Location', 'Sunrise Views']
    },
    {
      id: '8',
      name: 'Siam Paragon',
      nameMyanmar: 'ဆိုင်ယံ ပါရာဂွန်',
      category: 'shopping',
      image: 'https://images.unsplash.com/photo-1677599098270-22fbcd7b3e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTaWFtJTIwUGFyYWdvbiUyMHNob3BwaW5nJTIwbWFsbHxlbnwxfHx8fDE3NjQ3NTM5NDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.5,
      distance: '2.5 km',
      openingHours: '10:00 AM - 10:00 PM',
      entryFee: 'Free',
      description: 'Luxury shopping mall with aquarium and cinema',
      latitude: 13.7466,
      longitude: 100.5347,
      address: '991 Rama I Rd, Pathum Wan, Bangkok 10330',
      highlights: ['SEA LIFE Aquarium', 'Luxury Brands', 'Gourmet Market']
    },
    {
      id: '9',
      name: 'Khao San Road',
      nameMyanmar: 'ခေါ်ဆန် လမ်း',
      category: 'markets',
      image: 'https://images.unsplash.com/photo-1691576259634-28d34508cb60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLaGFvJTIwU2FuJTIwUm9hZCUyMEJhbmdrb2slMjBuaWdodGxpZmV8ZW58MXx8fHwxNzY0NzUzOTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.3,
      distance: '7.2 km',
      openingHours: '24 Hours',
      entryFee: 'Free',
      description: 'Famous backpacker street with vibrant nightlife',
      latitude: 13.7589,
      longitude: 100.4975,
      address: 'Khaosan Rd, Talat Yot, Phra Nakhon, Bangkok 10200',
      highlights: ['Street Food', 'Bars & Clubs', 'Budget Shopping']
    },
    {
      id: '10',
      name: 'Terminal 21',
      nameMyanmar: 'တာမီနယ် ၂၁',
      category: 'shopping',
      image: 'https://images.unsplash.com/photo-1762432817854-aba97b18f4c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzaG9wcGluZyUyMG1hbGwlMjBCYW5na29rfGVufDF8fHx8MTc2NDc1Mzk1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      distance: '1.8 km',
      openingHours: '10:00 AM - 10:00 PM',
      entryFee: 'Free',
      description: 'Airport-themed mall with international food court',
      latitude: 13.7378,
      longitude: 100.5601,
      address: '88 Soi Sukhumvit 19, Khlong Toei Nuea, Watthana, Bangkok 10110',
      highlights: ['City-themed Floors', 'Pier 21 Food Court', 'Shopping Bargains']
    }
  ];

  const filteredPlaces = selectedCategory === 'all' 
    ? places 
    : places.filter(place => place.category === selectedCategory);

  const handleDirections = (latitude: number, longitude: number, name: string) => {
    // Open Google Maps with directions - no API key needed
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  if (selectedPlace) {
    return (
      <div className="min-h-screen bg-background">
        {/* Detail Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedPlace(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1>Place Details</h1>
          </div>
        </div>

        <div className="pb-20">
          {/* Image */}
          <div className="relative h-64">
            <ImageWithFallback 
              src={selectedPlace.image}
              alt={selectedPlace.name}
              className="w-full h-full object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Badge className="absolute bottom-4 right-4 bg-white text-foreground">
              <Star className="w-4 h-4 mr-1 fill-[#FF7A00] text-[#FF7A00]" />
              {selectedPlace.rating}
            </Badge>
          </div>

          <div className="p-4 space-y-6">
            {/* Title */}
            <div>
              <h2>{selectedPlace.name}</h2>
              <p className="text-muted-foreground">{selectedPlace.nameMyanmar}</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="bg-[#224e4a] hover:bg-[#1a3a37]"
                onClick={() => handleDirections(selectedPlace.latitude, selectedPlace.longitude, selectedPlace.name)}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              <Button variant="outline">
                <Heart className="w-4 h-4 mr-2" />
                Save Place
              </Button>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-2">About</h3>
                <p className="text-sm text-muted-foreground">{selectedPlace.description}</p>
              </CardContent>
            </Card>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <p className="text-xs">Opening Hours</p>
                  </div>
                  <p className="text-sm">{selectedPlace.openingHours}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <span className="text-sm">💰</span>
                    <p className="text-xs">Entry Fee</p>
                  </div>
                  <p className="text-sm">{selectedPlace.entryFee}</p>
                </CardContent>
              </Card>
            </div>

            {/* Address */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#224e4a] mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Address</p>
                    <p className="text-sm">{selectedPlace.address}</p>
                    <p className="text-xs text-[#FF7A00] mt-1">{selectedPlace.distance} from you</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-3">Highlights</h3>
                <div className="space-y-2">
                  {selectedPlace.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#224e4a]"></div>
                      <p className="text-sm">{highlight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>လည်ပတ်ရန် နေရာများ</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search places..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-[#224e4a] hover:bg-[#1a3a37]" : ""}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Info Card */}
        <Card className="border-[#224e4a]/20 bg-gradient-to-br from-[#224e4a]/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Navigation className="w-5 h-5 text-[#224e4a] mt-0.5" />
              <div className="text-sm">
                <p>Discover amazing places in Bangkok and nearby areas. Get directions, opening hours, and entry fees.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Places List */}
        <div className="space-y-4">
          {filteredPlaces.map((place) => (
            <Card key={place.id} className="overflow-hidden">
              <div className="relative h-40">
                <ImageWithFallback 
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Badge className="absolute bottom-2 right-2 bg-white text-foreground">
                  <Star className="w-3 h-3 mr-1 fill-[#FF7A00] text-[#FF7A00]" />
                  {place.rating}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div>
                    <h3>{place.name}</h3>
                    <p className="text-sm text-muted-foreground">{place.nameMyanmar}</p>
                  </div>
                  <p className="text-sm">{place.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {place.distance}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {place.openingHours}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>💰</span>
                      {place.entryFee}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 bg-[#224e4a] hover:bg-[#1a3a37]"
                      onClick={() => handleDirections(place.latitude, place.longitude, place.name)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedPlace(place)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}