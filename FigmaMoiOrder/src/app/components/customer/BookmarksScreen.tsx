import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Newspaper, Users, Trash2, Share2, ExternalLink, Clock, Phone, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { NewsArticle } from './NewsScreen';
import { PartnerService } from './PartnershipScreen';

interface BookmarksScreenProps {
  onBack: () => void;
  savedArticles: NewsArticle[];
  savedPartners: PartnerService[];
  onRemoveSavedArticle: (articleId: string) => void;
  onRemoveSavedPartner: (partnerId: string) => void;
  onArticleClick: (article: NewsArticle) => void;
  onPartnerClick: (partner: PartnerService) => void;
}

export function BookmarksScreen({ 
  onBack, 
  savedArticles,
  savedPartners,
  onRemoveSavedArticle,
  onRemoveSavedPartner,
  onArticleClick,
  onPartnerClick
}: BookmarksScreenProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'partners'>('news');

  const totalSaved = savedArticles.length + savedPartners.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold">Bookmarks</h1>
              <p className="text-xs text-muted-foreground">
                {totalSaved} {totalSaved === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-border">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'news' 
                ? 'text-[#224e4a]' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Newspaper className="w-4 h-4" />
              News ({savedArticles.length})
            </div>
            {activeTab === 'news' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'partners' 
                ? 'text-[#224e4a]' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Partners ({savedPartners.length})
            </div>
            {activeTab === 'partners' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-20">
        {activeTab === 'news' ? (
          savedArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Newspaper className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Saved News Yet</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Start saving news articles you want to read later. Your saved posts will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <div 
                      className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => onArticleClick(article)}
                    >
                      <ImageWithFallback 
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {article.category}
                      </Badge>
                      <h3 
                        className="text-sm line-clamp-2 mb-1 cursor-pointer hover:text-[#224e4a]"
                        onClick={() => onArticleClick(article)}
                      >
                        {article.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                        {article.titleMyanmar}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </div>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-0 px-3 pb-3">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-[#224e4a] hover:bg-[#1a3a37]"
                        onClick={() => onArticleClick(article)}
                      >
                        Read Article
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onRemoveSavedArticle(article.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          savedPartners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Saved Partners Yet</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Start saving partner services you're interested in. Your saved partners will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedPartners.map((partner) => {
                const Icon = partner.icon;
                return (
                  <Card key={partner.id} className="overflow-hidden">
                    <div className="flex gap-3 p-3">
                      <div 
                        className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => onPartnerClick(partner)}
                      >
                        <ImageWithFallback 
                          src={partner.image}
                          alt={partner.name}
                          className="w-full h-full object-cover"
                        />
                        {partner.discount && (
                          <Badge className="absolute bottom-1 left-1 bg-[#FF7A00] text-white text-xs px-1 py-0">
                            {partner.discount}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-8 h-8 rounded bg-[#224e4a]/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-[#224e4a]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 
                              className="text-sm line-clamp-1 cursor-pointer hover:text-[#224e4a]"
                              onClick={() => onPartnerClick(partner)}
                            >
                              {partner.name}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {partner.nameMyanmar}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs mb-2">
                          {partner.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span className="truncate">{partner.contact}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-0 px-3 pb-3">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {partner.description}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-[#224e4a] hover:bg-[#1a3a37]"
                          onClick={() => onPartnerClick(partner)}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onRemoveSavedPartner(partner.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )
        )}

        {/* Info Card */}
        {(activeTab === 'news' && savedArticles.length > 0) || (activeTab === 'partners' && savedPartners.length > 0) ? (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Bookmark className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">About Saved Items</p>
                  <p className="text-xs">
                    Your saved {activeTab === 'news' ? 'articles' : 'partners'} are stored locally and will be available until you clear them.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
