import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Download, Eye, CheckCircle, XCircle, MessageSquare, Ban } from 'lucide-react';

export const MerchantOnboarding = () => {
  const pendingApplications = [
    { 
      name: 'Dragon Palace Chinese', 
      email: 'owner@dragonpalace.com', 
      location: 'Downtown District',
      appliedDate: '2 days ago',
      cuisine: 'Chinese',
      status: 'pending' 
    },
    { 
      name: 'Fresh Sushi Bar', 
      email: 'contact@freshsushi.com', 
      location: 'Midtown Area',
      appliedDate: '1 day ago',
      cuisine: 'Japanese',
      status: 'pending' 
    }
  ];

  const activeMerchants = [
    { 
      name: "Giuseppe's Pizza", 
      email: 'owner@giuseppes.com', 
      status: 'active',
      orders: 1247,
      rating: 4.8,
      revenue: '$12,450',
      joinDate: 'Jan 2024'
    },
    { 
      name: 'Sakura Sushi', 
      email: 'admin@sakurasushi.com', 
      status: 'active',
      orders: 892,
      rating: 4.7,
      revenue: '$8,920',
      joinDate: 'Feb 2024'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Merchant Management</h2>
        <div className="flex items-center space-x-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Merchants</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Pending Applications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Pending Applications</h3>
        <div className="space-y-4">
          {pendingApplications.map((merchant, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold">{merchant.name}</h4>
                  <Badge variant="secondary">{merchant.cuisine}</Badge>
                  <Badge variant="outline">New</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{merchant.email}</p>
                <p className="text-sm text-muted-foreground">{merchant.location} • Applied {merchant.appliedDate}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  Review
                </Button>
                <Button size="sm" variant="outline">
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Merchants */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Merchants</h3>
        <div className="space-y-4">
          {activeMerchants.map((merchant, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold">{merchant.name}</h4>
                  <Badge variant="default">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{merchant.email}</p>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span>{merchant.orders} orders</span>
                  <span>⭐ {merchant.rating}</span>
                  <span>{merchant.revenue} revenue</span>
                  <span>Since {merchant.joinDate}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contact
                </Button>
                <Button size="sm" variant="outline">
                  <Ban className="w-4 h-4 mr-1" />
                  Suspend
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};