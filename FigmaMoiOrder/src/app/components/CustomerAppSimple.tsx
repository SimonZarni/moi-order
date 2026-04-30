import React, { useState } from 'react';
import { Button } from './ui/button';

interface CustomerAppProps {
  onBack: () => void;
}

export const CustomerAppSimple = ({ onBack }: CustomerAppProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-4">Customer App</h1>
      <p className="text-lg mb-4">This is a simplified customer app.</p>
      <Button onClick={onBack}>
        Back to Selection
      </Button>
    </div>
  );
};