import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Eye, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';

export const DisputeCenter = () => {
  const disputes = [
    { 
      id: '#D001', 
      customer: 'John Doe', 
      merchant: "Giuseppe's Pizza", 
      orderId: '#12345',
      reason: 'Order never delivered', 
      amount: '$32.50',
      status: 'investigating',
      priority: 'high',
      created: '2 hours ago',
      description: 'Customer reports order was never delivered despite being marked as delivered by driver.'
    },
    { 
      id: '#D002', 
      customer: 'Jane Smith', 
      merchant: 'Sakura Sushi', 
      orderId: '#12346',
      reason: 'Food quality issue', 
      amount: '$45.80',
      status: 'open',
      priority: 'medium',
      created: '5 hours ago',
      description: 'Customer received spoiled sushi and is requesting full refund.'
    },
    { 
      id: '#D003', 
      customer: 'Mike Johnson', 
      merchant: 'Burger Palace', 
      orderId: '#12347',
      reason: 'Wrong order delivered', 
      amount: '$28.90',
      status: 'resolved',
      priority: 'low',
      created: '1 day ago',
      description: 'Customer received wrong order. Issue resolved with partial refund.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dispute Resolution Center</h2>
        <div className="flex items-center space-x-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Disputes</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="destructive">
            3 Urgent
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {disputes.map((dispute) => (
          <Card key={dispute.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold">{dispute.id}</h3>
                  <Badge variant={
                    dispute.status === 'resolved' ? 'default' : 
                    dispute.status === 'investigating' ? 'secondary' : 'destructive'
                  }>
                    {dispute.status}
                  </Badge>
                  <Badge variant={
                    dispute.priority === 'high' ? 'destructive' :
                    dispute.priority === 'medium' ? 'secondary' : 'outline'
                  }>
                    {dispute.priority} priority
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Customer:</span> {dispute.customer}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Merchant:</span> {dispute.merchant}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Order ID:</span> {dispute.orderId}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span> {dispute.amount}
                  </div>
                </div>
                <p className="text-sm mb-3"><strong>Reason:</strong> {dispute.reason}</p>
                <p className="text-sm text-muted-foreground mb-4">{dispute.description}</p>
                <p className="text-xs text-muted-foreground">Created {dispute.created}</p>
              </div>
            </div>
            
            {dispute.status !== 'resolved' && (
              <div className="border-t pt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Investigation Notes</label>
                  <Textarea 
                    placeholder="Add investigation notes or resolution details..."
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contact Customer
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contact Merchant
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Resolve
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};