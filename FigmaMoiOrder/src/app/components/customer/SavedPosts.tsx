import React from 'react';
import { ArrowLeft, Bookmark, Clock, Trash2, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface NewsArticle {
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

interface SavedPostsProps {
  onBack: () => void;
  savedArticles: NewsArticle[];
  onRemoveSaved: (articleId: string) => void;
  onArticleClick: (article: NewsArticle) => void;
  hideHeader?: boolean;
}

export function SavedPosts({ 
  onBack, 
  savedArticles, 
  onRemoveSaved,
  onArticleClick,
  hideHeader = false
}: SavedPostsProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header - Only show if hideHeader is false */}
      {!hideHeader && (
        <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold">Saved Posts</h1>
              <p className="text-xs text-muted-foreground">
                {savedArticles.length} {savedArticles.length === 1 ? 'article' : 'articles'} saved
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`space-y-4 ${!hideHeader ? 'p-4 pb-20' : ''}`}>
        {savedArticles.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bookmark className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Saved Posts Yet</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Start saving news articles you want to read later. Your saved posts will appear here.
            </p>
            <Button 
              onClick={onBack}
              className="bg-[#224e4a] hover:bg-[#1a3a37]"
            >
              Browse News
            </Button>
          </div>
        ) : (
          /* Saved Articles List */
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
                      onClick={() => onRemoveSaved(article.id)}
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
        )}

        {/* Info Card */}
        {savedArticles.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Bookmark className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">About Saved Posts</p>
                  <p className="text-xs">
                    Your saved articles are stored locally and will be available until you clear them or log out.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}