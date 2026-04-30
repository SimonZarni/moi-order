import React, { useState } from 'react';
import { RoleSelection } from './components/RoleSelection';
import { CustomerApp, Order } from './components/CustomerApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WorkPermitSubmission } from './components/customer/WorkPermitScreen';

export type UserRole = 'customer' | 'admin' | null;

export default function App() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [globalOrders, setGlobalOrders] = useState<Order[]>([]);
  const [workPermitSubmissions, setWorkPermitSubmissions] = useState<WorkPermitSubmission[]>([]);

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  const handleAcceptOrder = (orderId: string) => {
    setGlobalOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'preparing' as const }
          : order
      )
    );
  };

  const handleDeclineOrder = (orderId: string) => {
    setGlobalOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as const }
          : order
      )
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setGlobalOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status }
          : order
      )
    );
  };

  const handleNewOrder = (order: Order) => {
    setGlobalOrders(prev => [order, ...prev]);
  };

  const handleNewWorkPermitSubmission = (submission: WorkPermitSubmission) => {
    setWorkPermitSubmissions(prev => [submission, ...prev]);
    // Show success message
    alert('Work Permit application submitted successfully! We will review your application and contact you soon.');
  };

  const handleUpdateWorkPermitStatus = (submissionId: string, status: 'pending' | 'approved' | 'rejected') => {
    setWorkPermitSubmissions(prev => 
      prev.map(submission => 
        submission.id === submissionId 
          ? { ...submission, status }
          : submission
      )
    );
  };

  if (selectedRole === 'customer') {
    return (
      <CustomerApp 
        onBack={handleBack} 
        globalOrders={globalOrders} 
        onNewOrder={handleNewOrder}
        onNewWorkPermitSubmission={handleNewWorkPermitSubmission}
      />
    );
  }

  if (selectedRole === 'admin') {
    return (
      <AdminDashboard 
        orders={globalOrders}
        workPermitSubmissions={workPermitSubmissions}
        onAcceptOrder={handleAcceptOrder}
        onDeclineOrder={handleDeclineOrder}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateWorkPermitStatus={handleUpdateWorkPermitStatus}
        onBack={handleBack}
      />
    );
  }

  return <RoleSelection onSelectRole={handleRoleSelection} />;
}