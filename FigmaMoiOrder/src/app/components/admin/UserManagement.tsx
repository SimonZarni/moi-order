import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Eye, MessageSquare, Ban, CheckCircle } from 'lucide-react';

export const UserManagement = () => {
  const users = [
    { 
      name: 'John Doe', 
      email: 'john.doe@email.com', 
      orders: 47, 
      spent: '$1,247.50',
      status: 'active',
      joinDate: 'Jan 15, 2024',
      lastOrder: '2 days ago'
    },
    { 
      name: 'Jane Smith', 
      email: 'jane.smith@email.com', 
      orders: 23, 
      spent: '$567.80',
      status: 'active',
      joinDate: 'Feb 3, 2024',
      lastOrder: '1 week ago'
    },
    { 
      name: 'Mike Johnson', 
      email: 'mike.johnson@email.com', 
      orders: 89, 
      spent: '$2,156.75',
      status: 'suspended',
      joinDate: 'Dec 20, 2023',
      lastOrder: '1 month ago'
    },
    { 
      name: 'Sarah Wilson', 
      email: 'sarah.wilson@email.com', 
      orders: 156, 
      spent: '$3,892.40',
      status: 'active',
      joinDate: 'Nov 8, 2023',
      lastOrder: 'Yesterday'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex items-center space-x-3">
          <Input placeholder="Search users..." className="w-64" />
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {users.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold">{user.name}</h4>
                  <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                    {user.status}
                  </Badge>
                  {user.orders > 100 && (
                    <Badge className="bg-yellow-100 text-yellow-800">VIP</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span>{user.orders} orders</span>
                  <span>{user.spent} spent</span>
                  <span>Joined {user.joinDate}</span>
                  <span>Last order: {user.lastOrder}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View Profile
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contact
                </Button>
                {user.status === 'active' ? (
                  <Button size="sm" variant="outline">
                    <Ban className="w-4 h-4 mr-1" />
                    Suspend
                  </Button>
                ) : (
                  <Button size="sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};