import React, { useState } from 'react';
import { ArrowLeft, Newspaper, Clock, TrendingUp, Bookmark, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { NewsArticleDetail } from './NewsArticleDetail';

interface NewsScreenProps {
  onBack: () => void;
  savedArticleIds?: Set<string>;
  onToggleSave?: (articleId: string) => void;
  initialArticle?: NewsArticle | null;
}

// Export NewsArticle interface so it can be used by other components
export interface NewsArticle {
  id: string;
  title: string;
  titleMyanmar: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  source: string;
  trending: boolean;
}

export function NewsScreen({ onBack, savedArticleIds = new Set(), onToggleSave, initialArticle }: NewsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentView, setCurrentView] = useState<'list' | 'detail'>(initialArticle ? 'detail' : 'list');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(initialArticle || null);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'visa', name: 'Visa & Immigration' },
    { id: 'community', name: 'Community' },
    { id: 'events', name: 'Events' },
    { id: 'jobs', name: 'Jobs' },
    { id: 'business', name: 'Business' }
  ];

  const newsArticles: NewsArticle[] = getAllNewsArticles();

  const filteredNews = selectedCategory === 'all'
    ? newsArticles
    : newsArticles.filter(article => article.category === selectedCategory);

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedArticle(null);
  };

  const handleSaveArticle = (articleId: string) => {
    if (onToggleSave) {
      onToggleSave(articleId);
    }
  };

  const handleShareArticle = () => {
    // Share functionality - could integrate with native share or copy link
    alert('Share functionality - Article link copied!');
  };

  // Show detail view if an article is selected
  if (currentView === 'detail' && selectedArticle) {
    return (
      <NewsArticleDetail
        article={selectedArticle}
        isSaved={savedArticleIds.has(selectedArticle.id)}
        onBack={handleBackToList}
        onToggleSave={() => handleSaveArticle(selectedArticle.id)}
        onShare={handleShareArticle}
      />
    );
  }

  // Show list view
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>သတင်း အချက်အလက်</h1>
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
              className={selectedCategory === category.id ? "bg-[#224e4a] hover:bg-[#1a3a37] whitespace-nowrap" : "whitespace-nowrap"}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Trending Section */}
        <Card className="border-[#FF7A00]/20 bg-gradient-to-br from-[#FF7A00]/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#FF7A00]" />
              <span className="text-sm">Trending Now</span>
            </div>
            <div className="space-y-2">
              {newsArticles.filter(article => article.trending).map((article) => (
                <div key={article.id} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]"></div>
                  <span className="line-clamp-1">{article.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* News Articles */}
        <div className="space-y-4">
          {filteredNews.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <div className="flex gap-3 p-3">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  {article.trending && (
                    <Badge className="absolute top-1 left-1 bg-[#FF7A00] text-white text-xs py-0 px-1">
                      <TrendingUp className="w-2.5 h-2.5" />
                    </Badge>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {article.category}
                  </Badge>
                  <h3 className="text-sm line-clamp-2 mb-1">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {article.titleMyanmar}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                    <span>{article.date}</span>
                  </div>
                </div>
              </div>
              <CardContent className="pt-0 px-3 pb-3">
                <p className="text-sm text-muted-foreground mb-3">
                  {article.summary}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-[#224e4a] hover:bg-[#1a3a37]" onClick={() => handleArticleClick(article)}>
                    Read More
                  </Button>
                  <Button 
                    size="sm" 
                    variant={savedArticleIds.has(article.id) ? "default" : "outline"}
                    onClick={() => handleSaveArticle(article.id)}
                    className={savedArticleIds.has(article.id) ? "bg-[#224e4a] hover:bg-[#1a3a37]" : ""}
                  >
                    <Bookmark className={`w-4 h-4 ${savedArticleIds.has(article.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <Card className="bg-gradient-to-br from-[#224e4a]/5 to-transparent border-[#224e4a]/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Newspaper className="w-6 h-6 text-[#224e4a] mt-0.5" />
              <div>
                <h3 className="mb-1">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Subscribe to our newsletter for the latest news and updates
                </p>
                <Button className="w-full bg-[#224e4a] hover:bg-[#1a3a37]">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function getAllNewsArticles(): NewsArticle[] {
  return [
    {
      id: '1',
      title: 'New Visa Regulations for Myanmar Citizens in Thailand 2025',
      titleMyanmar: '2025 ခုနှစ် ထိုင်းနိုင်ငံတွင် မြန်မာနိုင်ငံသားများအတွက် ဗီဇာစည်းမျဉ်းအသစ်',
      category: 'visa',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
      date: '2024-11-28',
      readTime: '5 min read',
      summary: 'Important updates on visa requirements and application procedures for Myanmar nationals.',
      content: 'The Thai Immigration Bureau has announced new visa regulations for Myanmar citizens effective January 1, 2025. These changes aim to streamline the application process and provide clearer guidelines for various visa categories.\n\nKey updates include simplified documentation requirements for tourist visas, extended validity periods for business visas, and new digital application options. Myanmar nationals can now apply online for certain visa categories, reducing processing times from 5-7 days to 2-3 days.\n\nFor work permits, the new regulations introduce a points-based system considering education, work experience, and Thai language proficiency. This change is expected to benefit skilled workers and professionals seeking employment in Thailand.\n\nApplicants are advised to check the official Thai Immigration website for detailed requirements and to prepare necessary documents in advance. The embassy in Yangon will hold information sessions throughout December to help applicants understand the new procedures.',
      source: 'Thailand Immigration Bureau',
      trending: true
    },
    {
      id: '2',
      title: 'Myanmar Community New Year Celebration 2025',
      titleMyanmar: '2025 မြန်မာအသိုင်းအဝိုင်း နှစ်သစ်ကူးပွဲတော်',
      category: 'community',
      image: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?w=400&h=300&fit=crop',
      date: '2024-11-25',
      readTime: '3 min read',
      summary: 'Join us for the annual Myanmar New Year celebration at Lumpini Park.',
      content: 'The Myanmar community in Bangkok is preparing for the grandest New Year celebration yet at Lumpini Park on April 13-15, 2025. This three-day festival will feature traditional performances, authentic Myanmar cuisine, and cultural activities for all ages.\n\nHighlights include traditional dance performances by renowned Myanmar artists, a street food market with over 50 vendors, and cultural workshops teaching traditional crafts. Children can enjoy games, face painting, and storytelling sessions in both Myanmar and Thai languages.\n\nThe event is organized by the Myanmar Community Association of Thailand in collaboration with the Bangkok Metropolitan Administration. Entry is free for all attendees. Volunteers are still needed for event management - interested individuals can register at the community center.\n\nTransportation will be available from major Myanmar community areas in Bangkok. Special shuttle services will run throughout the event days.',
      source: 'Myanmar Community Association Thailand',
      trending: false
    },
    {
      id: '3',
      title: 'Job Fair for Myanmar Workers - December 15',
      titleMyanmar: 'မြန်မာအလုပ်သမားများအတွက် အလုပ်အကိုင်ပြပွဲ - ဒီဇင်ဘာ 15',
      category: 'jobs',
      image: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=400&h=300&fit=crop',
      date: '2024-11-22',
      readTime: '4 min read',
      summary: 'Over 50 companies seeking skilled workers. Free entry, bring your CV.',
      content: 'A major job fair targeting Myanmar workers will be held on December 15, 2024, at the Bangkok International Trade & Exhibition Centre (BITEC). Over 50 leading Thai and international companies will participate, offering positions across various sectors.\n\nIndustries represented include hospitality, manufacturing, logistics, retail, and technology. Positions range from entry-level to management roles, with salaries starting from 15,000 THB to over 80,000 THB per month. Companies are specifically seeking bilingual candidates fluent in Myanmar and Thai.\n\nThe event will feature: On-site interviews, CV review services, career counseling sessions, and workshops on Thai workplace culture and labor law. Translation services will be available throughout the day.\n\nAttendees should bring multiple copies of their CV in both Myanmar and Thai, work permits (if applicable), and educational certificates. Professional dress code is required. Registration opens at 9:00 AM, with the fair running until 5:00 PM.\n\nFree shuttle buses will operate from major Myanmar community areas. For more information and to pre-register, visit the event website.',
      source: 'Thailand Ministry of Labor',
      trending: true
    },
    {
      id: '4',
      title: '90-Day Report Can Now Be Done Online',
      titleMyanmar: '90 ရက် အစီရင်ခံစာကို အွန်လိုင်းမှ တင်နိုင်ပြီ',
      category: 'visa',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      date: '2024-11-20',
      readTime: '6 min read',
      summary: 'Step-by-step guide to submit your 90-day report through the new online system.',
      content: 'The Thai Immigration Bureau has upgraded its online 90-day reporting system, making it easier than ever for foreign residents to comply with reporting requirements. The new system features improved user interface, mobile compatibility, and faster processing.\n\nTo use the online system, you will need: A valid passport, current visa or extension stamp, TM.30 receipt or notification, and a registered email address. First-time users must create an account on the immigration website.\n\nStep-by-step process:\n1. Visit immigration.go.th and log in to your account\n2. Select "90-Day Report" from the menu\n3. Fill in your personal information and current address\n4. Upload required documents (passport photo page, visa page, TM.30)\n5. Submit the form and wait for email confirmation\n\nProcessing typically takes 1-2 business days. You will receive a confirmation email with a PDF receipt that you should save and print. This receipt serves as proof of compliance.\n\nImportant notes: The online system is available 24/7, but submissions made after 4:30 PM on Friday will be processed on the following Monday. If your online submission is rejected, you must report in person at your local immigration office.\n\nFor those who prefer in-person reporting, immigration offices remain open during regular business hours.',
      source: 'Thailand Immigration Bureau',
      trending: false
    },
    {
      id: '5',
      title: 'Myanmar Restaurant Week in Bangkok',
      titleMyanmar: 'ဘန်ကောက်မြို့တွင် မြန်မာစားသောက်ဆိုင်များ အပတ်',
      category: 'events',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      date: '2024-11-18',
      readTime: '3 min read',
      summary: 'Special discounts and promotions at Myanmar restaurants across Bangkok.',
      content: 'From December 1-7, 2024, over 30 Myanmar restaurants across Bangkok will participate in the first-ever Myanmar Restaurant Week, offering special menus and discounts to celebrate Myanmar cuisine.\n\nParticipating restaurants will offer prix-fixe menus at three price points: 299 THB, 499 THB, and 699 THB. Each menu features traditional Myanmar dishes with modern presentation, showcasing the diversity of regional cuisines from Yangon to Mandalay.\n\nFeatured dishes include Mohinga, Shan noodles, tea leaf salad, coconut chicken curry, and traditional Myanmar desserts. Several restaurants will also host cooking demonstrations and cultural performances during the week.\n\nReservations are recommended as participating restaurants expect high demand. Bookings can be made through the MoiOrder app, which is offering an additional 10% discount for orders placed through the platform.\n\nThis event is organized by the Myanmar Restaurant Association of Thailand in partnership with the Tourism Authority of Thailand. It aims to promote Myanmar culinary heritage and support local Myanmar-owned businesses.\n\nVisit the official website for the full list of participating restaurants and menu details.',
      source: 'Myanmar Restaurant Association Thailand',
      trending: false
    },
    {
      id: '6',
      title: 'Starting a Business in Thailand: Guide for Myanmar Entrepreneurs',
      titleMyanmar: 'ထိုင်းတွင် စီးပွားရေး စတင်ခြင်း - မြန်မာ စီးပွားရေးသမားများအတွက်',
      category: 'business',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
      date: '2024-11-15',
      readTime: '8 min read',
      summary: 'Comprehensive guide on requirements, regulations, and opportunities.',
      content: 'Starting a business in Thailand as a Myanmar entrepreneur requires careful planning and understanding of Thai business regulations. This comprehensive guide covers the essential steps and requirements.\n\nBusiness Structure Options:\n- Sole Proprietorship: Simplest form, suitable for small businesses\n- Limited Company: Most common for foreign entrepreneurs, requires minimum 3 shareholders\n- Regional Office: For companies with headquarters outside Thailand\n\nKey Requirements:\n1. Minimum registered capital of 2 million THB for most businesses\n2. Thai majority shareholding (51% Thai, 49% foreign) unless qualified under special investment programs\n3. Work permit and appropriate visa status\n4. Business license from relevant government departments\n\nForeign Business Act Considerations:\nCertain businesses are restricted or prohibited for foreign ownership. However, Myanmar entrepreneurs can qualify for exemptions through:\n- Board of Investment (BOI) privileges\n- ASEAN treaties\n- Treaty of Amity (for US citizens)\n\nRecommended Steps:\n1. Conduct market research and develop business plan\n2. Consult with Thai business lawyer\n3. Register company with Department of Business Development\n4. Obtain necessary licenses and permits\n5. Open corporate bank account\n6. Register for taxes and social security\n\nSupport Resources:\nThe Myanmar Entrepreneurs Association of Thailand offers mentorship programs, networking events, and legal clinics. Free consultation sessions are held monthly at their Bangkok office.\n\nMany successful Myanmar-owned businesses in Thailand include restaurants, import-export, trading, and professional services. The bilateral trade relationship between Thailand and Myanmar creates unique opportunities for entrepreneurs familiar with both markets.',
      source: 'Thailand Board of Investment',
      trending: true
    }
  ];
}