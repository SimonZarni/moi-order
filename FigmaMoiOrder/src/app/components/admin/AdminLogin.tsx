import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Settings, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const AdminLogin = ({ onLogin, onBack }: AdminLoginProps) => (
  <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
    <Card className="w-full max-w-md p-8 shadow-2xl border-0">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
          <Settings className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Admin Portal
        </h1>
        <p className="text-muted-foreground">Access administrative controls</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Input 
            placeholder="Admin Email" 
            className="h-12 bg-muted/50 border-0 focus:bg-background"
          />
          <Input 
            type="password" 
            placeholder="Admin Password" 
            className="h-12 bg-muted/50 border-0 focus:bg-background"
          />
        </div>
        <Button 
          onClick={onLogin}
          className="w-full h-12 bg-primary hover:bg-primary/90"
        >
          Access Admin Panel
        </Button>
        <div className="text-center">
          <Button variant="link" className="text-primary">
            Forgot Password?
          </Button>
        </div>
        <Separator />
        <Button 
          variant="outline"
          onClick={onBack}
          className="w-full h-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Selection
        </Button>
      </div>
    </Card>
  </div>
);