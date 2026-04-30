import React from 'react';
import { ArrowLeft, Clock, Bookmark, Share2, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  source: string;
}

interface NewsArticleDetailProps {
  article: NewsArticle;
  isSaved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onShare: () => void;
}

export function NewsArticleDetail({ 
  article, 
  isSaved, 
  onBack, 
  onToggleSave,
  onShare 
}: NewsArticleDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-0 hover:bg-transparent"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={isSaved ? "default" : "outline"}
              onClick={onToggleSave}
              className={isSaved ? "bg-[#224e4a] hover:bg-[#1a3a37]" : ""}
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={onShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Category Badge */}
        <Badge className="bg-[#224e4a] text-white">
          {article.category}
        </Badge>

        {/* Title */}
        <h1 className="text-2xl font-bold leading-tight">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{article.readTime}</span>
          </div>
          <span>•</span>
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.source}</span>
        </div>

        {/* Featured Image */}
        <div className="rounded-lg overflow-hidden">
          <ImageWithFallback
            src={article.image}
            alt={article.title}
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border-l-4 border-[#224e4a] p-4 rounded">
          <p className="text-sm font-medium text-gray-800">
            {article.summary}
          </p>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg p-6 space-y-4">
          <div className="prose prose-sm max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white rounded-lg p-4 flex gap-2">
          <Button 
            className="flex-1 bg-[#224e4a] hover:bg-[#1a3a37]"
            onClick={onToggleSave}
          >
            {isSaved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved to My News
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 mr-2" />
                Save for Later
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
