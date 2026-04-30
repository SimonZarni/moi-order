import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface CustomerAppProps {
  onBack: () => void;
}

export const CustomerAppMinimal = ({ onBack }: CustomerAppProps) => {
  const [screen, setScreen] = useState<'splash' | 'home'>('splash');

  if (screen === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-4">
          <div className="text-6xl mb-6">🍕</div>
          <h1 className="text-3xl font-bold mb-4 text-primary">MoiOrder</h1>
          <p className="text-muted-foreground mb-6">Your favorite food, delivered fresh</p>
          <Button 
            onClick={() => setScreen('home')}
            className="w-full"
          >
            Continue
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">MoiOrder</h1>
          <Button onClick={onBack} variant="ghost" className="text-white">
            Exit
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Welcome to Customer App</h2>
        <p className="text-muted-foreground mb-4">
          This is a minimal version of the customer app.
        </p>
        
        <div className="grid gap-4">
          <Card className="p-4">
            <h3 className="font-semibold">Giuseppe's Pizza</h3>
            <p className="text-sm text-muted-foreground">Italian • 4.8 ⭐ • 25-35 min</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold">Sakura Sushi</h3>
            <p className="text-sm text-muted-foreground">Japanese • 4.7 ⭐ • 30-40 min</p>
          </Card>
        </div>
      </div>
    </div>
  );
};