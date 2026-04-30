import React from 'react';
import { ArrowLeft, Bookmark, Phone, Mail, Trash2, Share2, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { PartnerService } from './PartnershipScreen';

interface SavedPartnersProps {
  onBack: () => void;
  savedPartners: PartnerService[];
  onRemoveSaved: (partnerId: string) => void;
  onPartnerClick: (partner: PartnerService) => void;
  hideHeader?: boolean;
}

export function SavedPartners({ 
  onBack, 
  savedPartners, 
  onRemoveSaved,
  onPartnerClick,
  hideHeader = false
}: SavedPartnersProps) {
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
              <h1 className="font-semibold">Saved Partners</h1>
              <p className="text-xs text-muted-foreground">
                {savedPartners.length} {savedPartners.length === 1 ? 'partner' : 'partners'} saved
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`space-y-4 ${!hideHeader ? 'p-4 pb-20' : ''}`}>
        {savedPartners.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bookmark className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Saved Partners Yet</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Start saving partner services you're interested in. Your saved partners will appear here.
            </p>
            <Button 
              onClick={onBack}
              className="bg-[#224e4a] hover:bg-[#1a3a37]"
            >
              Browse Partners
            </Button>
          </div>
        ) : (
          /* Saved Partners List */
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
                        onClick={() => onRemoveSaved(partner.id)}
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
        )}

        {/* Info Card */}
        {savedPartners.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Bookmark className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">About Saved Partners</p>
                  <p className="text-xs">
                    Your saved partner services are stored locally and will be available until you clear them.
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