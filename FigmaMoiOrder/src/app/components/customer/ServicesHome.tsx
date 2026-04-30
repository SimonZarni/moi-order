import React from 'react';
import { ChevronDown, ShoppingBag, FileText, Building, MapPin, Newspaper, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CustomerView } from '../CustomerApp';

interface ServicesHomeProps {
  onViewChange: (view: CustomerView) => void;
}

export function ServicesHome({ onViewChange }: ServicesHomeProps) {
  const services = [
    {
      id: 'food-order' as CustomerView,
      title: 'အစားအသောက်\nမှာယူရန်',
      icon: ShoppingBag,
      image: 'https://images.unsplash.com/photo-1647482770207-06bfdc9458a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBtZWFsfGVufDF8fHx8MTc2NDUxNTA5Nnww&ixlib=rb-4.1.0&q=80&w=400',
      color: 'from-teal-600 to-teal-700',
      view: 'home' as CustomerView
    },
    {
      id: '90-days-report' as CustomerView,
      title: '၉၀ ရက်\nအစီရင်ခံစာ',
      icon: FileText,
      image: 'https://images.unsplash.com/photo-1712813082477-28bf398d924c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHJlcG9ydHxlbnwxfHx8fDE3NjQ1MTUwOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
      color: 'from-teal-600 to-teal-700',
      view: '90-days-report' as CustomerView
    },
    {
      id: 'embassy-letter' as CustomerView,
      title: 'သံရုံး\nအကြောင်းကြားစာ',
      icon: Building,
      image: 'https://images.unsplash.com/photo-1676144845114-9058186a0f53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJhc3N5JTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY0NTE1MDk3fDA&ixlib=rb-4.1.0&q=80&w=400',
      color: 'from-teal-600 to-teal-700',
      view: 'embassy-letter' as CustomerView
    },
    {
      id: 'places' as CustomerView,
      title: 'လည်ပတ်\nရန်နေရာများ',
      icon: MapPin,
      image: 'https://images.unsplash.com/photo-1619417889956-c701044fed86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3VyaXN0JTIwcGxhY2VzJTIwbGFuZG1hcmt8ZW58MXx8fHwxNzY0NTE1MDk3fDA&ixlib=rb-4.1.0&q=80&w=400',
      color: 'from-teal-600 to-teal-700',
      view: 'places' as CustomerView
    },
    {
      id: 'news' as CustomerView,
      title: 'သတင်း\nအချက်အလက်',
      icon: Newspaper,
      image: 'https://images.unsplash.com/photo-1635135473157-9c5f7af2f27f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzJTIwbmV3c3BhcGVyfGVufDF8fHx8MTc2NDUxNTA5OHww&ixlib=rb-4.1.0&q=80&w=400',
      color: 'from-teal-600 to-teal-700',
      view: 'news' as CustomerView
    },
    {
      id: 'partnership' as CustomerView,
      title: 'မိတ်ဖက်\nဝန်ဆောင်မှုများ',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1758599543152-a73184816eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0bmVyc2hpcCUyMGhhbmRzaGFrZSUyMGJ1c2luZXNzfGVufDF8fHx8MTc2NDQ5NTgwN3ww&ixlib=rb-4.1.0&q=80&w=400',
      color: 'from-teal-600 to-teal-700',
      view: 'partnership' as CustomerView
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#224e4a] flex items-center justify-center">
              <span className="text-white">မ</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">မင်္ဂလာပါ</p>
              <div className="flex items-center gap-1">
                <span>19/7 Soi Sukhumvit 23..</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FF7A00] flex items-center justify-center">
            <span className="text-white">U</span>
          </div>
        </div>

        <h1 className="text-2xl text-[#D4183D] mt-2">ရင် ဂို သားတို့အီးပြီးပြီလား !</h1>
      </div>

      {/* Services Grid */}
      <div className="px-4 pb-20">
        <h2 className="mb-4">လုပ်နေ ဘာကလူ</h2>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => onViewChange(service.view)}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2C5F5F] to-[#1E4545] p-4 aspect-square flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#00D4E8] flex items-center justify-center mb-3 overflow-hidden">
                <ImageWithFallback 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-center whitespace-pre-line">
                {service.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}