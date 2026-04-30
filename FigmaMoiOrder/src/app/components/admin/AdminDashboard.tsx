import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, ShoppingBag, Clock, CheckCircle, XCircle, 
  Eye, Image as ImageIcon, ChefHat, Users, TrendingUp,
  LayoutDashboard, FileText, DollarSign, Bell, Settings,
  Truck, Package, Calendar, Filter, Search, Download,
  BarChart3, PieChart, Activity, UserCheck, MapPin, Briefcase, Building, CreditCard, Menu, X
} from 'lucide-react';
import { Order } from '../CustomerApp';
import { Input } from '../ui/input';
import { WorkPermitSubmission } from '../../types/submissions';
import { NinetyDaysReportAdmin } from './NinetyDaysReportAdmin';
import { EmbassyLetterAdmin } from './EmbassyLetterAdmin';
import { WorkPermitAdmin } from './WorkPermitAdmin';

interface AdminDashboardProps {
  orders: Order[];
  workPermitSubmissions: WorkPermitSubmission[];
  onAcceptOrder: (orderId: string) => void;
  onDeclineOrder: (orderId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateWorkPermitStatus: (submissionId: string, status: 'pending' | 'approved' | 'rejected') => void;
  onBack: () => void;
}

type AdminView = 'dashboard' | 'orders' | '90-days-report' | 'embassy-letter' | 'work-permit' | 'reports' | 'revenue' | 'notifications' | 'settings';

export const AdminDashboard = ({ 
  orders, 
  workPermitSubmissions,
  onAcceptOrder, 
  onDeclineOrder, 
  onUpdateOrderStatus,
  onUpdateWorkPermitStatus,
  onBack 
}: AdminDashboardProps) => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'active' | 'completed'>('pending');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const activeOrders = orders.filter(order => 
    ['confirmed', 'preparing', 'on-way'].includes(order.status)
  );
  const completedOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.orderTime).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const totalRevenue = completedOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const todayRevenue = todayOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const displayOrders = 
    selectedTab === 'pending' ? pendingOrders :
    selectedTab === 'active' ? activeOrders :
    completedOrders;

  const filteredOrders = displayOrders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Payment</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
      case 'preparing':
        return <Badge className="bg-orange-50 text-[#FF7A00] border-orange-200">Preparing</Badge>;
      case 'on-way':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Delivering</Badge>;
      case 'delivered':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const handleAccept = (order: Order) => {
    if (window.confirm(`Accept order #${order.id}?`)) {
      onAcceptOrder(order.id);
      setShowOrderModal(false);
      setSelectedOrder(null);
    }
  };

  const handleDecline = (order: Order) => {
    if (window.confirm(`Decline order #${order.id}? This action cannot be undone.`)) {
      onDeclineOrder(order.id);
      setShowOrderModal(false);
      setSelectedOrder(null);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    if (window.confirm(`Change order status to ${newStatus}?`)) {
      onUpdateOrderStatus(orderId, newStatus);
      setShowOrderModal(false);
      setSelectedOrder(null);
    }
  };

  // Sidebar Navigation
  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders', badge: pendingOrders.length },
    { id: 'work-permit', icon: Briefcase, label: 'Work Permits', badge: workPermitSubmissions.filter(sub => sub.status === 'pending').length },
    { id: '90-days-report', icon: FileText, label: '90 Days Report' },
    { id: 'embassy-letter', icon: FileText, label: 'Embassy Letter' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'revenue', icon: DollarSign, label: 'Revenue' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: 3 },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
            <Badge className="bg-yellow-600 text-white">{pendingOrders.length}</Badge>
          </div>
          <p className="text-2xl font-bold text-yellow-900">{pendingOrders.length}</p>
          <p className="text-sm text-yellow-700">Pending Orders</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <ChefHat className="w-8 h-8 text-[#FF7A00]" />
            <Badge className="bg-[#FF7A00] text-white">{activeOrders.length}</Badge>
          </div>
          <p className="text-2xl font-bold text-orange-900">{activeOrders.length}</p>
          <p className="text-sm text-orange-700">Active Orders</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{completedOrders.filter(o => o.status === 'delivered').length}</p>
          <p className="text-sm text-green-700">Completed Today</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#224e4a] to-[#1a3a37] text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
          </div>
          <p className="text-2xl font-bold">฿{todayRevenue.toFixed(2)}</p>
          <p className="text-sm opacity-80">Today's Revenue</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-[#224e4a]" />
              Revenue Overview
            </h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-xl font-bold text-[#224e4a]">฿{totalRevenue.toFixed(2)}</p>
                </div>
              </div>
              <Badge className="bg-green-50 text-green-700">+12.5%</Badge>
            </div>
            <div className="h-32 bg-gradient-to-r from-[#224e4a]/10 to-green-100 rounded-lg flex items-end justify-around p-4">
              <div className="w-12 bg-[#224e4a] rounded-t" style={{ height: '60%' }}></div>
              <div className="w-12 bg-[#224e4a] rounded-t" style={{ height: '80%' }}></div>
              <div className="w-12 bg-green-500 rounded-t" style={{ height: '100%' }}></div>
              <div className="w-12 bg-[#224e4a] rounded-t" style={{ height: '70%' }}></div>
              <div className="w-12 bg-[#224e4a] rounded-t" style={{ height: '85%' }}></div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Avg Order</p>
                <p className="font-semibold">฿{orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="font-semibold">{orders.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="font-semibold">{orders.length > 0 ? ((completedOrders.filter(o => o.status === 'delivered').length / orders.length) * 100).toFixed(1) : '0'}%</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <Activity className="w-5 h-5 mr-2 text-[#224e4a]" />
              Order Statistics
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm">Pending Payment</span>
              </div>
              <span className="font-bold text-yellow-700">{pendingOrders.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ChefHat className="w-5 h-5 text-[#FF7A00]" />
                <span className="text-sm">Preparing</span>
              </div>
              <span className="font-bold text-[#FF7A00]">{orders.filter(o => o.status === 'preparing').length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Out for Delivery</span>
              </div>
              <span className="font-bold text-blue-700">{orders.filter(o => o.status === 'on-way').length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Delivered</span>
              </div>
              <span className="font-bold text-green-700">{orders.filter(o => o.status === 'delivered').length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm">Cancelled</span>
              </div>
              <span className="font-bold text-red-700">{orders.filter(o => o.status === 'cancelled').length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-[#224e4a]" />
            Recent Orders
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentView('orders')}>
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#224e4a] text-white flex items-center justify-center font-bold">
                  {order.id.slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.restaurantName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(order.status)}
                <p className="font-bold text-[#224e4a]">฿{order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-1" />
              Today
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="bg-white border rounded-lg">
        <div className="flex border-b">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'pending' ? 'text-[#224e4a]' : 'text-gray-500'
            }`}
          >
            Pending
            {pendingOrders.length > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-white">{pendingOrders.length}</Badge>
            )}
            {selectedTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('active')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'active' ? 'text-[#224e4a]' : 'text-gray-500'
            }`}
          >
            Active
            {activeOrders.length > 0 && (
              <Badge className="ml-2 bg-[#FF7A00] text-white">{activeOrders.length}</Badge>
            )}
            {selectedTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'completed' ? 'text-[#224e4a]' : 'text-gray-500'
            }`}
          >
            Completed
            {selectedTab === 'completed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
        </div>

        {/* Orders List */}
        <div className="p-4 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2">No {selectedTab} orders</h3>
              <p className="text-muted-foreground text-center">
                {searchQuery ? 'No orders match your search' : 
                  selectedTab === 'pending' 
                    ? 'No pending orders at the moment'
                    : selectedTab === 'active'
                    ? 'No active orders at the moment'
                    : 'No completed orders yet'
                }
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.restaurantName} • {order.orderTime}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-[#224e4a]">฿{order.total.toFixed(2)}</p>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2 mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span className="font-medium">{order.items.length} items</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment:</span>
                      <span className="font-medium capitalize">{order.paymentMethod || 'Cash'}</span>
                    </div>
                    <div className="flex items-start justify-between text-sm">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-medium text-right max-w-[200px]">{order.deliveryAddress}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    
                    {order.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleAccept(order)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleDecline(order)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </>
                    )}

                    {order.status === 'preparing' && (
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleStatusChange(order.id, 'on-way')}
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        Mark as Delivering
                      </Button>
                    )}

                    {order.status === 'on-way' && (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderWorkPermits = () => (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search work permits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-1" />
              Today
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="bg-white border rounded-lg">
        <div className="flex border-b">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'pending' ? 'text-[#224e4a]' : 'text-gray-500'
            }`}
          >
            Pending
            {workPermitSubmissions.filter(sub => sub.status === 'pending').length > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-white">{workPermitSubmissions.filter(sub => sub.status === 'pending').length}</Badge>
            )}
            {selectedTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('active')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'active' ? 'text-[#224e4a]' : 'text-gray-500'
            }`}
          >
            Active
            {workPermitSubmissions.filter(sub => sub.status === 'approved').length > 0 && (
              <Badge className="ml-2 bg-[#FF7A00] text-white">{workPermitSubmissions.filter(sub => sub.status === 'approved').length}</Badge>
            )}
            {selectedTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'completed' ? 'text-[#224e4a]' : 'text-gray-500'
            }`}
          >
            Completed
            {selectedTab === 'completed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
        </div>

        {/* Work Permits List */}
        <div className="p-4 space-y-4">
          {workPermitSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2">No {selectedTab} work permits</h3>
              <p className="text-muted-foreground text-center">
                {searchQuery ? 'No work permits match your search' : 
                  selectedTab === 'pending' 
                    ? 'No pending work permits at the moment'
                    : selectedTab === 'active'
                    ? 'No active work permits at the moment'
                    : 'No completed work permits yet'
                }
              </p>
            </div>
          ) : (
            workPermitSubmissions.map((submission) => (
              <Card key={submission.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  {/* Work Permit Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">Work Permit #{submission.id}</h3>
                        {submission.status === 'pending' && <Badge className="bg-yellow-500 text-white">Pending</Badge>}
                        {submission.status === 'approved' && <Badge className="bg-green-500 text-white">Approved</Badge>}
                        {submission.status === 'rejected' && <Badge className="bg-red-500 text-white">Rejected</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {submission.restaurantName} • {submission.submissionTime}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-[#224e4a]">฿{submission.total.toFixed(2)}</p>
                  </div>

                  {/* Work Permit Details */}
                  <div className="space-y-2 mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span className="font-medium">{submission.items.length} items</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment:</span>
                      <span className="font-medium capitalize">{submission.paymentMethod || 'Cash'}</span>
                    </div>
                    <div className="flex items-start justify-between text-sm">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-medium text-right max-w-[200px]">{submission.deliveryAddress}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(submission);
                        setShowOrderModal(true);
                      }}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    
                    {submission.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => onUpdateWorkPermitStatus(submission.id, 'approved')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => onUpdateWorkPermitStatus(submission.id, 'rejected')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {submission.status === 'approved' && (
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleStatusChange(submission.id, 'on-way')}
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        Mark as Delivering
                      </Button>
                    )}

                    {submission.status === 'on-way' && (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusChange(submission.id, 'delivered')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-[#224e4a]" />
          Order Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-700 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
            <p className="text-xs text-blue-600 mt-1">All time</p>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <p className="text-sm text-green-700 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-900">{completedOrders.filter(o => o.status === 'delivered').length}</p>
            <p className="text-xs text-green-600 mt-1">Success rate: {orders.length > 0 ? ((completedOrders.filter(o => o.status === 'delivered').length / orders.length) * 100).toFixed(1) : '0'}%</p>
          </Card>
          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-sm text-red-700 mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-900">{orders.filter(o => o.status === 'cancelled').length}</p>
            <p className="text-xs text-red-600 mt-1">{orders.length > 0 ? ((orders.filter(o => o.status === 'cancelled').length / orders.length) * 100).toFixed(1) : '0'}% of total</p>
          </Card>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Download Reports</h3>
          <Button className="bg-[#224e4a] hover:bg-[#1a3a37] text-white">
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Daily Orders Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Monthly Revenue Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Customer Analytics
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderRevenue = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <DollarSign className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-900">฿{totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-green-700">Total Revenue</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-blue-900">฿{todayRevenue.toFixed(2)}</p>
          <p className="text-sm text-blue-700">Today's Revenue</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-purple-900">฿{orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}</p>
          <p className="text-sm text-purple-700">Average Order Value</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Food Orders</p>
              <p className="text-sm text-muted-foreground">{orders.filter(o => o.status === 'delivered').length} orders</p>
            </div>
            <p className="text-lg font-bold text-[#224e4a]">฿{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Delivery Fees</p>
              <p className="text-sm text-muted-foreground">{orders.length} deliveries</p>
            </div>
            <p className="text-lg font-bold text-[#224e4a]">฿{(orders.length * 2.99).toFixed(2)}</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      {[
        { type: 'order', message: 'New order #' + (orders[0]?.id || '12345'), time: '2 min ago', unread: true },
        { type: 'payment', message: 'Payment verified for order #' + (orders[1]?.id || '12344'), time: '15 min ago', unread: true },
        { type: 'delivery', message: 'Order delivered successfully', time: '1 hour ago', unread: false },
      ].map((notif, index) => (
        <Card key={index} className={`p-4 ${notif.unread ? 'bg-blue-50 border-blue-200' : ''}`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              notif.type === 'order' ? 'bg-yellow-100' :
              notif.type === 'payment' ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              <Bell className={`w-5 h-5 ${
                notif.type === 'order' ? 'text-yellow-600' :
                notif.type === 'payment' ? 'text-green-600' : 'text-blue-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className="font-medium">{notif.message}</p>
              <p className="text-sm text-muted-foreground">{notif.time}</p>
            </div>
            {notif.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Enable Email Notifications</span>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Auto-accept Orders</span>
            <input type="checkbox" className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Enable Sound Alerts</span>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Account</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <UserCheck className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            <XCircle className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#224e4a] text-white p-6 flex flex-col transform transition-transform duration-300 lg:transform-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">MoiOrder</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="text-white hover:bg-white/20 lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-white/70">Admin Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as AdminView);
                  setIsSidebarOpen(false); // Close sidebar on mobile after selecting
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white/20 text-white font-medium' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge className="bg-[#FF7A00] text-white">{item.badge}</Badge>
                )}
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/20">
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-white/70">admin@moiorder.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 bg-white border-b border-border px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="text-[#224e4a]"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-[#224e4a]">MoiOrder Admin</h1>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold mb-1 capitalize">{currentView}</h2>
            <p className="text-muted-foreground">
              {currentView === 'dashboard' && 'Overview of your platform'}
              {currentView === 'orders' && 'Manage all orders from customers'}
              {currentView === 'work-permit' && 'Manage all work permits from customers'}
              {currentView === '90-days-report' && 'Generate and download 90 days report'}
              {currentView === 'embassy-letter' && 'Generate and download embassy letter'}
              {currentView === 'reports' && 'Generate and download reports'}
              {currentView === 'revenue' && 'Track your earnings and revenue'}
              {currentView === 'notifications' && 'View all system notifications'}
              {currentView === 'settings' && 'Configure your preferences'}
            </p>
          </div>

          {/* Content */}
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'orders' && renderOrders()}
          {currentView === 'work-permit' && <WorkPermitAdmin />}
          {currentView === '90-days-report' && <NinetyDaysReportAdmin />}
          {currentView === 'embassy-letter' && <EmbassyLetterAdmin />}
          {currentView === 'reports' && renderReports()}
          {currentView === 'revenue' && renderRevenue()}
          {currentView === 'notifications' && renderNotifications()}
          {currentView === 'settings' && renderSettings()}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Order Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Order Info */}
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-medium">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Restaurant:</span>
                      <span className="font-medium">{selectedOrder.restaurantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Time:</span>
                      <span className="font-medium">{selectedOrder.orderTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Address:</span>
                      <span className="font-medium text-right max-w-[300px]">{selectedOrder.deliveryAddress}</span>
                    </div>
                    {selectedOrder.phoneNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{selectedOrder.phoneNumber}</span>
                      </div>
                    )}
                    {selectedOrder.note && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Note:</span>
                        <span className="font-medium text-right max-w-[300px]">{selectedOrder.note}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Proof */}
                {selectedOrder.paymentProof && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Payment Proof
                    </h3>
                    <img 
                      src={selectedOrder.paymentProof} 
                      alt="Payment Proof" 
                      className="w-full rounded-lg border"
                    />
                  </div>
                )}

                {/* Order Items */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Order Items
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-medium">฿{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total Amount</span>
                      <span className="text-[#224e4a]">฿{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAccept(selectedOrder)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Order
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDecline(selectedOrder)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline Order
                      </Button>
                    </>
                  )}

                  {selectedOrder.status === 'preparing' && (
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleStatusChange(selectedOrder.id, 'on-way')}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Mark as Delivering
                    </Button>
                  )}

                  {selectedOrder.status === 'on-way' && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleStatusChange(selectedOrder.id, 'delivered')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};