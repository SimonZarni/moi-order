import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Package, Building, Users, DollarSign, CheckCircle, AlertTriangle, Plus, Download, Shield, Bell } from 'lucide-react';

export const SystemOverview = () => {
  const recentActivity = [
    { 
      icon: CheckCircle, 
      message: 'New merchant approved: Burger Palace', 
      time: '10 minutes ago',
      type: 'success'
    },
    { 
      icon: AlertTriangle, 
      message: 'Dispute escalated: Order #12345', 
      time: '25 minutes ago',
      type: 'warning'
    },
    { 
      icon: Users, 
      message: '127 new users registered today', 
      time: '1 hour ago',
      type: 'info'
    },
    { 
      icon: DollarSign, 
      message: 'Daily revenue milestone reached: $15K', 
      time: '3 hours ago',
      type: 'success'
    }
  ];

  return (
    <div className="space-y-6">
      {/* System KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-primary">12,487</p>
              <p className="text-xs text-green-600 mt-1">↗ +15% this month</p>
            </div>
            <Package className="w-10 h-10 text-primary" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Merchants</p>
              <p className="text-3xl font-bold text-secondary">287</p>
              <p className="text-xs text-green-600 mt-1">↗ +23% this month</p>
            </div>
            <Building className="w-10 h-10 text-secondary" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="text-3xl font-bold text-green-600">34,567</p>
              <p className="text-xs text-green-600 mt-1">↗ +18% this month</p>
            </div>
            <Users className="w-10 h-10 text-green-600" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Platform Revenue</p>
              <p className="text-3xl font-bold text-blue-600">$245.2K</p>
              <p className="text-xs text-green-600 mt-1">↗ +12% this month</p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-xl font-semibold mb-6">Recent Platform Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'success' ? 'bg-green-100 text-green-600' :
                  activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  activity.type === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          {/* System Health */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">System Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Server Uptime</span>
                  <span className="text-sm font-medium text-green-600">99.97%</span>
                </div>
                <Progress value={99.97} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">API Response Time</span>
                  <span className="text-sm font-medium text-green-600">145ms</span>
                </div>
                <Progress value={85} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Error Rate</span>
                  <span className="text-sm font-medium text-green-600">0.03%</span>
                </div>
                <Progress value={99.97} />
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add New Admin
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Reports
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Security Audit
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Send Announcement
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};