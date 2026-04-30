import React, { useEffect } from 'react';

interface SplashScreenProps {
  onNext: () => void;
}

export const SplashScreen = ({ onNext }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onNext, 3000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-center animate-pulse">
        <div className="text-8xl mb-8 animate-bounce">🍽️</div>
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          MoiOrder
        </h1>
        <p className="text-2xl opacity-90 mb-12 max-w-md mx-auto leading-relaxed">
          Delicious food delivered to your doorstep
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm opacity-70">Loading your food experience...</p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>
  );
};