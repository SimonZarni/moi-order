import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Store, Mail, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface MerchantLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function MerchantLogin({ onLogin, onBack }: MerchantLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.email && credentials.password) {
      onLogin();
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
          <h1 className="font-semibold">Merchant Portal</h1>
        </div>
      </div>

      <div className="px-4 py-8">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">MoiOrder for Merchants</h2>
          <p className="text-muted-foreground">Manage your restaurant and orders</p>
        </div>

        {/* Login Form */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Sign In to Your Restaurant</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Restaurant Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="restaurant@example.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground">
                Sign In
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Access */}
        <Card className="max-w-md mx-auto mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Demo Access</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try the merchant dashboard with sample data
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={onLogin}
            >
              Continue with Demo
            </Button>
          </CardContent>
        </Card>

        {/* Partner Registration */}
        <div className="max-w-md mx-auto mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            New to MoiOrder?
          </p>
          <Button variant="outline" className="w-full">
            Register Your Restaurant
          </Button>
        </div>

        {/* Support */}
        <div className="max-w-md mx-auto mt-6 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Need help getting started?
          </p>
          <Button variant="link" className="text-primary text-sm">
            Contact Merchant Support
          </Button>
        </div>
      </div>
    </div>
  );
}