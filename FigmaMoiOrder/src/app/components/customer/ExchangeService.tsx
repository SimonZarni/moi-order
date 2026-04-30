import React from 'react';
import { ArrowLeft, ArrowLeftRight, Info, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ExchangeServiceProps {
  onBack: () => void;
}

export function ExchangeService({ onBack }: ExchangeServiceProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-0 hover:bg-transparent"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Currency Exchange</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {/* Info Banner */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900">
                  This service is provided by our trusted third-party exchange partner.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Exchange Rate</span>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground">MMK</p>
                    <p className="text-3xl font-bold">100,000</p>
                  </div>
                  <ArrowLeftRight className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">THB</p>
                    <p className="text-3xl font-bold text-primary">796</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last updated: 2 hours ago
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Rate</p>
                  <p className="font-medium">1 THB = 125.63 MMK</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Spread</p>
                  <p className="font-medium text-green-600">0.5%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Conversions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Conversions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { mmk: '50,000', thb: '398' },
              { mmk: '100,000', thb: '796' },
              { mmk: '200,000', thb: '1,592' },
              { mmk: '500,000', thb: '3,980' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium">{item.mmk} MMK</span>
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-primary">{item.thb} THB</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA Button */}
        <div className="pt-4">
          <Button className="w-full h-12 bg-primary text-primary-foreground">
            Go to Exchange Partner
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            You will be redirected to our trusted partner's platform
          </p>
        </div>

        {/* Disclaimer */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> Exchange rates are provided by third-party services 
              and may vary. MoiOrder is not responsible for the accuracy of rates or any 
              transactions made through external partners. Please verify all details before 
              proceeding with any exchange.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
