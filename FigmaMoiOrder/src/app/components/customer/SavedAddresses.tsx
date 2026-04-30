import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface SavedAddressesProps {
  onBack: () => void;
}

export function SavedAddresses({ onBack }: SavedAddressesProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Saved Addresses</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Delivery Addresses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Delivery Addresses</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Home</p>
                  <p className="text-sm text-muted-foreground">
                    123 Main Street, Apt 4B, City, State 12345
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Work</p>
                  <p className="text-sm text-muted-foreground">
                    456 Business Ave, Suite 200, City, State 67890
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Add New Address
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
