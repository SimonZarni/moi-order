import React, { useState } from 'react';
import { ArrowLeft, Users, Phone, Mail, Building, Briefcase, Car, Home, GraduationCap, Heart, Newspaper, Clock, TrendingUp, Bookmark, ExternalLink, Share2, MapPin, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { getAllNewsArticles, NewsArticle } from './NewsScreen';

interface PartnershipScreenProps {
  onBack: () => void;
  savedPartnerIds?: Set<string>;
  onToggleSavePartner?: (partnerId: string) => void;
  onNewsArticleClick?: (article: NewsArticle) => void;
  initialPartner?: PartnerService | null;
}

export interface PartnerService {
  id: string;
  name: string;
  nameMyanmar: string;
  category: string;
  icon: any;
  image: string;
  services: string[];
  contact: string;
  email: string;
  discount: string;
  description: string;
  descriptionMyanmar: string;
  website?: string;
  address?: string;
  hours?: string;
}

export function PartnershipScreen({ onBack, savedPartnerIds = new Set(), onToggleSavePartner, onNewsArticleClick, initialPartner }: PartnershipScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentView, setCurrentView] = useState<'list' | 'detail'>(initialPartner ? 'detail' : 'list');
  const [selectedPartner, setSelectedPartner] = useState<PartnerService | null>(initialPartner || null);
  
  // Get news articles
  const newsArticles = getAllNewsArticles().slice(0, 5); // Show top 5 news

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'legal', name: 'Legal' },
    { id: 'transport', name: 'Transport' },
    { id: 'housing', name: 'Housing' },
    { id: 'education', name: 'Education' },
    { id: 'health', name: 'Healthcare' }
  ];

  const partners: PartnerService[] = [
    {
      id: '1',
      name: 'Legal Advisory Services',
      nameMyanmar: 'ဥပဒေ အကြံပေး ဝန်ဆောင်မှု',
      category: 'legal',
      icon: Briefcase,
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
      services: ['Visa Assistance', 'Work Permit', 'Legal Consultation', 'Document Translation'],
      contact: '+66 2 123 4567',
      email: 'legal@partners.com',
      discount: '10% Off',
      description: 'Professional legal advisory services specializing in immigration and work permits for Myanmar nationals in Thailand. Our experienced team provides comprehensive support for all your legal needs.',
      descriptionMyanmar: 'ထိုင်းနိုင်ငံရှိ မြန်မာနိုင်ငံသားများအတွက် လူဝင်မှုကြီးကြပ်ရေးနှင့် အလုပ်ခွင့်လိုင်စင်တို့အတွက် အထူးပြုသည့် ပရော်ဖက်ရှင်နယ် ဥပဒေအကြံပေးဝန်ဆောင်မှုများ။',
      website: 'https://legal-advisory.com',
      address: '123 Silom Road, Bangkok 10500',
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM'
    },
    {
      id: '2',
      name: 'Bangkok Transport Solutions',
      nameMyanmar: 'ဘန်ကောက် ပို့ဆောင်ရေး',
      category: 'transport',
      icon: Car,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
      services: ['Airport Transfer', 'Daily Commute', 'Long Distance', 'Moving Services'],
      contact: '+66 2 234 5678',
      email: 'transport@partners.com',
      discount: '15% Off First Ride',
      description: 'Reliable and affordable transportation services throughout Bangkok and surrounding areas. We offer airport transfers, daily commutes, and long-distance travel with professional drivers.',
      descriptionMyanmar: 'ဘန်ကောက်နှင့် အနီးတစ်ဝိုက်ရှိ ယုံကြည်စိတ်ချရပြီး တတ်နိုင်သော ပို့ဆောင်ရေးဝန်ဆောင်မှုများ။',
      website: 'https://bangkok-transport.com',
      address: '456 Sukhumvit Road, Bangkok 10110',
      hours: '24/7 Available'
    },
    {
      id: '3',
      name: 'Myanmar Housing Agency',
      nameMyanmar: 'မြန်မာ အိမ်ရှာဖွေပေးရေး',
      category: 'housing',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      services: ['Apartment Rental', 'House Hunting', 'Contract Assistance', 'Property Management'],
      contact: '+66 2 345 6789',
      email: 'housing@partners.com',
      discount: 'Free Consultation',
      description: 'Specialized housing agency helping Myanmar nationals find suitable accommodation in Thailand. We provide end-to-end support from property search to contract signing.',
      descriptionMyanmar: 'ထိုင်းနိုင်ငံတွင် သင့်တော်သော နေထိုင်ရာ ရှာဖွေရာတွင် မြန်မာနိုင်ငံသားများကို ကူညီပေးသော အထူးပြု အိမ်ခြံမြေအေဂျင်စီ။',
      website: 'https://myanmar-housing.com',
      address: '789 Ramkhamhaeng Road, Bangkok 10240',
      hours: 'Mon-Sun: 9:00 AM - 7:00 PM'
    },
    {
      id: '4',
      name: 'Thai Language School',
      nameMyanmar: 'ထိုင်းဘာသာ သင်တန်းကျောင်း',
      category: 'education',
      icon: GraduationCap,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
      services: ['Beginner Courses', 'Business Thai', 'Private Tutoring', 'Online Classes'],
      contact: '+66 2 456 7890',
      email: 'education@partners.com',
      discount: '20% Off First Month',
      description: 'Premier Thai language school offering courses for all levels. Our experienced instructors provide personalized learning experiences for Myanmar students.',
      descriptionMyanmar: 'အဆင့်အားလုံးအတွက် သင်တန်းများ ပေးသော ထိပ်တန်း ထိုင်းဘာသာစကား ကျောင်း။',
      website: 'https://thai-language-school.com',
      address: '321 Phayathai Road, Bangkok 10400',
      hours: 'Mon-Sat: 8:00 AM - 8:00 PM'
    },
    {
      id: '5',
      name: 'International Healthcare Clinic',
      nameMyanmar: 'နိုင်ငံတကာ ကျန်းမာရေး ဆေးခန်း',
      category: 'health',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
      services: ['General Checkup', 'Dental Care', 'Emergency Service', 'Health Insurance'],
      contact: '+66 2 567 8901',
      email: 'health@partners.com',
      discount: 'Special Package Rates',
      description: 'International healthcare clinic with Myanmar-speaking staff. We provide comprehensive medical services including general checkups, dental care, and emergency services.',
      descriptionMyanmar: 'မြန်မာဘာသာပြောဆိုနိုင်သော ဝန်ထမ်းများရှိသည့် နိုင်ငံတကာ ကျန်းမာရေးဆေးခန်း။',
      website: 'https://international-healthcare.com',
      address: '654 Wireless Road, Bangkok 10330',
      hours: '24/7 Emergency Services'
    },
    {
      id: '6',
      name: 'Business Consultancy',
      nameMyanmar: 'စီးပွားရေး အကြံပေး',
      category: 'legal',
      icon: Building,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
      services: ['Company Registration', 'Tax Planning', 'Accounting', 'Business Licensing'],
      contact: '+66 2 678 9012',
      email: 'business@partners.com',
      discount: 'Free Initial Assessment',
      description: 'Expert business consultancy services for Myanmar entrepreneurs in Thailand. We help with company registration, tax planning, accounting, and all business licensing needs.',
      descriptionMyanmar: 'ထိုင်းနိုင်ငံရှိ မြန်မာစီးပွားရေးလုပ်ငန်းရှင်များအတွက် ကျွမ်းကျင်သော စီးပွားရေးအကြံပေးဝန်ဆောင်မှုများ။',
      website: 'https://business-consultancy.com',
      address: '987 Asoke Road, Bangkok 10110',
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM'
    }
  ];

  const filteredPartners = selectedCategory === 'all'
    ? partners
    : partners.filter(partner => partner.category === selectedCategory);

  const handlePartnerClick = (partner: PartnerService) => {
    setSelectedPartner(partner);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPartner(null);
  };

  const handleSavePartner = (partnerId: string) => {
    if (onToggleSavePartner) {
      onToggleSavePartner(partnerId);
    }
  };

  // Detail View
  if (currentView === 'detail' && selectedPartner) {
    const Icon = selectedPartner.icon;
    const isSaved = savedPartnerIds.has(selectedPartner.id);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 pt-12 pb-4 shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToList}
              className="p-0 hover:bg-transparent"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={isSaved ? "default" : "outline"}
                onClick={() => handleSavePartner(selectedPartner.id)}
                className={isSaved ? "bg-[#224e4a] hover:bg-[#1a3a37]" : ""}
              >
                <Bookmark className={`w-4 h-4 mr-1 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Partner Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Featured Image */}
          <div className="rounded-lg overflow-hidden">
            <ImageWithFallback
              src={selectedPartner.image}
              alt={selectedPartner.name}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Header Info */}
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-[#224e4a]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-8 h-8 text-[#224e4a]" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{selectedPartner.name}</h1>
                <p className="text-muted-foreground">{selectedPartner.nameMyanmar}</p>
              </div>
            </div>

            {selectedPartner.discount && (
              <Badge className="bg-[#FF7A00] text-white text-base px-3 py-1">
                {selectedPartner.discount}
              </Badge>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg">About This Service</h2>
            <p className="text-gray-700 leading-relaxed">{selectedPartner.description}</p>
            <p className="text-gray-700 leading-relaxed">{selectedPartner.descriptionMyanmar}</p>
          </div>

          {/* Services Offered */}
          <div className="bg-white rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg">Services Offered</h2>
            <div className="grid grid-cols-2 gap-3">
              {selectedPartner.services.map((service, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#224e4a]"></div>
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#224e4a]" />
                <a href={`tel:${selectedPartner.contact}`} className="text-blue-600 hover:underline">
                  {selectedPartner.contact}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#224e4a]" />
                <a href={`mailto:${selectedPartner.email}`} className="text-blue-600 hover:underline">
                  {selectedPartner.email}
                </a>
              </div>
              {selectedPartner.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#224e4a]" />
                  <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Visit Website
                  </a>
                </div>
              )}
              {selectedPartner.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#224e4a] mt-0.5" />
                  <span className="text-gray-700">{selectedPartner.address}</span>
                </div>
              )}
              {selectedPartner.hours && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#224e4a]" />
                  <span className="text-gray-700">{selectedPartner.hours}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg p-4 flex gap-2">
            <Button 
              className="flex-1 bg-[#224e4a] hover:bg-[#1a3a37]"
              onClick={() => window.open(`tel:${selectedPartner.contact}`)}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
            <Button 
              className="flex-1 bg-[#FF7A00] hover:bg-[#E66D00]"
              onClick={() => window.open(`mailto:${selectedPartner.email}`)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>မိတ်ဖက် ဝန်ဆောင်မှုများ</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Latest News Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#224e4a]" />
              သတင်းအချက်အလက် (Latest News)
            </h2>
          </div>
          
          <div className="space-y-3">
            {newsArticles.map((article) => (
              <Card 
                key={article.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onNewsArticleClick && onNewsArticleClick(article)}
              >
                <div className="relative h-40">
                  <ImageWithFallback 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  {article.trending && (
                    <Badge className="absolute top-2 left-2 bg-[#FF7A00] text-white flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {article.category}
                  </Badge>
                  <h3 className="mb-2 line-clamp-2">{article.titleMyanmar}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {article.summary}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-[#224e4a]/20 bg-gradient-to-br from-[#224e4a]/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#224e4a]">
              <Users className="w-5 h-5" />
              Partner Services
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>Access trusted services from our verified partners</p>
            <p>✓ Special discounts for MoiOrder users</p>
            <p>✓ Quality guaranteed services</p>
            <p>✓ Myanmar language support available</p>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-[#224e4a] hover:bg-[#1a3a37] whitespace-nowrap" : "whitespace-nowrap"}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Partners List */}
        <div className="space-y-4">
          {filteredPartners.map((partner) => {
            const Icon = partner.icon;
            const isSaved = savedPartnerIds.has(partner.id);
            return (
              <Card key={partner.id} className="overflow-hidden">
                <div className="relative h-32">
                  <ImageWithFallback 
                    src={partner.image}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                  {partner.discount && (
                    <Badge className="absolute top-2 right-2 bg-[#FF7A00] text-white">
                      {partner.discount}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#224e4a]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-[#224e4a]" />
                      </div>
                      <div className="flex-1">
                        <h3>{partner.name}</h3>
                        <p className="text-sm text-muted-foreground">{partner.nameMyanmar}</p>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <p className="text-sm mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {partner.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{partner.contact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span>{partner.email}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1 bg-[#224e4a] hover:bg-[#1a3a37]"
                        onClick={() => window.open(`tel:${partner.contact}`)}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handlePartnerClick(partner)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Learn More
                      </Button>
                      <Button 
                        size="sm" 
                        variant={isSaved ? "default" : "outline"}
                        onClick={() => handleSavePartner(partner.id)}
                        className={isSaved ? "bg-[#224e4a] hover:bg-[#1a3a37]" : ""}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Become Partner CTA */}
        <Card className="bg-gradient-to-br from-[#FF7A00]/5 to-transparent border-[#FF7A00]/20">
          <CardContent className="p-4 text-center">
            <Building className="w-12 h-12 text-[#FF7A00] mx-auto mb-3" />
            <h3 className="mb-2">Become a Partner</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join our network and reach thousands of Myanmar users in Thailand
            </p>
            <Button className="bg-[#FF7A00] hover:bg-[#E66D00]">
              Apply Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Export function to get all partners for saved posts
export function getAllPartners(): PartnerService[] {
  return [
    {
      id: '1',
      name: 'Legal Advisory Services',
      nameMyanmar: 'ဥပဒေ အကြံပေး ဝန်ဆောင်မှု',
      category: 'legal',
      icon: Briefcase,
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
      services: ['Visa Assistance', 'Work Permit', 'Legal Consultation', 'Document Translation'],
      contact: '+66 2 123 4567',
      email: 'legal@partners.com',
      discount: '10% Off',
      description: 'Professional legal advisory services specializing in immigration and work permits for Myanmar nationals in Thailand.',
      descriptionMyanmar: 'ထိုင်းနိုင်ငံရှိ မြန်မာနိုင်ငံသားများအတွက် ပရော်ဖက်ရှင်နယ် ဥပဒေအကြံပေးဝန်ဆောင်မှုများ။',
      website: 'https://legal-advisory.com',
      address: '123 Silom Road, Bangkok 10500',
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM'
    },
    {
      id: '2',
      name: 'Bangkok Transport Solutions',
      nameMyanmar: 'ဘန်ကောက် ပို့ဆောင်ရေး',
      category: 'transport',
      icon: Car,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
      services: ['Airport Transfer', 'Daily Commute', 'Long Distance', 'Moving Services'],
      contact: '+66 2 234 5678',
      email: 'transport@partners.com',
      discount: '15% Off First Ride',
      description: 'Reliable and affordable transportation services throughout Bangkok.',
      descriptionMyanmar: 'ဘန်ကောက်တွင် ယုံကြည်စိတ်ချရသော ပို့ဆောင်ရေးဝန်ဆောင်မှုများ။',
      website: 'https://bangkok-transport.com',
      address: '456 Sukhumvit Road, Bangkok 10110',
      hours: '24/7 Available'
    },
    {
      id: '3',
      name: 'Myanmar Housing Agency',
      nameMyanmar: 'မြန်မာ အိမ်ရှာဖွေပေးရေး',
      category: 'housing',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      services: ['Apartment Rental', 'House Hunting', 'Contract Assistance', 'Property Management'],
      contact: '+66 2 345 6789',
      email: 'housing@partners.com',
      discount: 'Free Consultation',
      description: 'Specialized housing agency helping Myanmar nationals find accommodation.',
      descriptionMyanmar: 'မြန်မာနိုင်ငံသားများအတွက် အထူးပြု အိမ်ခြံမြေအေဂျင်စီ။',
      website: 'https://myanmar-housing.com',
      address: '789 Ramkhamhaeng Road, Bangkok 10240',
      hours: 'Mon-Sun: 9:00 AM - 7:00 PM'
    },
    {
      id: '4',
      name: 'Thai Language School',
      nameMyanmar: 'ထိုင်းဘာသာ သင်တန်းကျောင်း',
      category: 'education',
      icon: GraduationCap,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
      services: ['Beginner Courses', 'Business Thai', 'Private Tutoring', 'Online Classes'],
      contact: '+66 2 456 7890',
      email: 'education@partners.com',
      discount: '20% Off First Month',
      description: 'Premier Thai language school for all levels.',
      descriptionMyanmar: 'ထိပ်တန်း ထိုင်းဘာသာစကား ကျောင်း။',
      website: 'https://thai-language-school.com',
      address: '321 Phayathai Road, Bangkok 10400',
      hours: 'Mon-Sat: 8:00 AM - 8:00 PM'
    },
    {
      id: '5',
      name: 'International Healthcare Clinic',
      nameMyanmar: 'နိုင်ငံတကာ ကျန်းမာရေး ဆေးခန်း',
      category: 'health',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
      services: ['General Checkup', 'Dental Care', 'Emergency Service', 'Health Insurance'],
      contact: '+66 2 567 8901',
      email: 'health@partners.com',
      discount: 'Special Package Rates',
      description: 'International healthcare clinic with Myanmar-speaking staff.',
      descriptionMyanmar: 'မြန်မာဘာသာပြောဆိုနိုင်သော နိုင်ငံတကာ ကျန်းမာရေးဆေးခန်း။',
      website: 'https://international-healthcare.com',
      address: '654 Wireless Road, Bangkok 10330',
      hours: '24/7 Emergency Services'
    },
    {
      id: '6',
      name: 'Business Consultancy',
      nameMyanmar: 'စီးပွားရေး အကြံပေး',
      category: 'legal',
      icon: Building,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
      services: ['Company Registration', 'Tax Planning', 'Accounting', 'Business Licensing'],
      contact: '+66 2 678 9012',
      email: 'business@partners.com',
      discount: 'Free Initial Assessment',
      description: 'Expert business consultancy for Myanmar entrepreneurs.',
      descriptionMyanmar: 'မြန်မာစီးပွားရေးလုပ်ငန်းရှင်များအတွက် ကျွမ်းကျင်သော စီးပွားရေးအကြံပေး။',
      website: 'https://business-consultancy.com',
      address: '987 Asoke Road, Bangkok 10110',
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM'
    }
  ];
}