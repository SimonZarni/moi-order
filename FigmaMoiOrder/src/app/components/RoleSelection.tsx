import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Smartphone, Monitor, Settings, ArrowLeft, CheckCircle } from 'lucide-react';
import { UserRole } from '../App';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelection = ({ onSelectRole }: RoleSelectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-16">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <h1 className="relative text-6xl mb-6 bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent font-bold">
              MoiOrder
            </h1>
          </div>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            The ultimate food delivery platform connecting customers, merchants, and administrators in one seamless experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-10 text-center hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 cursor-pointer group relative overflow-hidden"
                onClick={() => onSelectRole('customer')}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Smartphone className="relative w-20 h-20 mx-auto text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl mb-6 font-semibold">Customer Mobile App</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Discover restaurants, customize orders, track deliveries in real-time, and share your dining experiences with our community
              </p>
              <div className="space-y-3 mb-8 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Real-time order tracking</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>PromptPay payment support</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multi-service platform</span>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 group-hover:shadow-lg transition-all duration-300">
                Enter Customer App
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </Card>

          <Card className="p-10 text-center hover:shadow-2xl transition-all duration-500 border-2 hover:border-[#224e4a]/50 cursor-pointer group relative overflow-hidden"
                onClick={() => onSelectRole('admin')}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#224e4a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-[#224e4a]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Settings className="relative w-20 h-20 mx-auto text-[#224e4a] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl mb-6 font-semibold">Admin Dashboard</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Manage all orders, accept or decline payments, oversee platform operations, and ensure smooth service delivery
              </p>
              <div className="space-y-3 mb-8 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Order approval system</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Payment verification</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Real-time order management</span>
                </div>
              </div>
              <Button className="w-full bg-[#224e4a] hover:bg-[#1a3a37] text-white group-hover:shadow-lg transition-all duration-300">
                Enter Admin Portal
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            Trusted by 10,000+ restaurants • 500,000+ customers • 50+ cities
          </p>
        </div>
      </div>
    </div>
  );
};