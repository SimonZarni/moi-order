import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Calendar, TrendingUp, Download, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface PayoutManagementProps {
  onBack: () => void;
}

export function PayoutManagement({ onBack }: PayoutManagementProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock payout data
  const payoutSummary = {
    availableBalance: 2847.50,
    pendingBalance: 456.25,
    totalEarnings: 8934.75,
    nextPayoutDate: "Friday, March 15, 2024"
  };

  const recentPayouts = [
    {
      id: 'PAY-001',
      date: '2024-03-08',
      amount: 1245.67,
      status: 'completed',
      period: 'Feb 26 - Mar 4, 2024',
      orders: 89
    },
    {
      id: 'PAY-002',
      date: '2024-03-01',
      amount: 1089.34,
      status: 'completed',
      period: 'Feb 19 - Feb 25, 2024',
      orders: 76
    },
    {
      id: 'PAY-003',
      date: '2024-02-23',
      amount: 956.78,
      status: 'completed',
      period: 'Feb 12 - Feb 18, 2024',
      orders: 68
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Payout Management</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="font-bold text-xl text-green-600">
                    ${payoutSummary.availableBalance.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Balance</p>
                  <p className="font-bold text-xl text-yellow-600">
                    ${payoutSummary.pendingBalance.toFixed(2)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="font-bold text-xl">
                    ${payoutSummary.totalEarnings.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Next Payout</p>
                <p className="font-semibold">{payoutSummary.nextPayoutDate}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-primary text-primary-foreground">
              Request Instant Payout
              <DollarSign className="h-4 w-4 ml-2" />
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Statement
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Tax Documents
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payout History</CardTitle>
              <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">Payout #{payout.id}</h3>
                      <Badge className={getStatusColor(payout.status)}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{payout.period}</span>
                      <span>•</span>
                      <span>{payout.orders} orders</span>
                      <span>•</span>
                      <span>Paid on {new Date(payout.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg">${payout.amount.toFixed(2)}</p>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payout Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Bank Account</h4>
              <p className="text-sm text-blue-700">
                Wells Fargo Bank •••• 4567
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Update Bank Account
              </Button>
            </div>
            
            <div className="p-4 bg-gray-50 border rounded-lg">
              <h4 className="font-semibold mb-2">Payout Schedule</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Automatic weekly payouts every Friday
              </p>
              <Button variant="outline" size="sm">
                Change Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fee Information */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Commission per order</span>
                <span className="font-semibold">15%</span>
              </div>
              <div className="flex justify-between">
                <span>Payment processing fee</span>
                <span className="font-semibold">2.9% + $0.30</span>
              </div>
              <div className="flex justify-between">
                <span>Instant payout fee</span>
                <span className="font-semibold">$1.50</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Standard payout</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}