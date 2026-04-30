import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Phone, Mail, Clock, Send, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface SupportScreenProps {
  onBack: () => void;
}

export function SupportScreen({ onBack }: SupportScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time by going to the Order History section in your profile. Click on any active order to see its current status and estimated delivery time.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards (Visa, Mastercard, JCB), mobile banking, PromptPay, and cash on delivery for selected areas.'
    },
    {
      question: 'How do I cancel an order?',
      answer: 'Orders can be cancelled within 5 minutes of placing them. Go to Order History, select the order, and tap "Cancel Order". After 5 minutes, please contact our support team.'
    },
    {
      question: 'What is the delivery time?',
      answer: 'Delivery times vary by restaurant and location, typically ranging from 25-45 minutes. You\'ll see the estimated time before placing your order.'
    },
    {
      question: 'How do I report a problem with my order?',
      answer: 'Go to Order History, select the order, and tap "Report Issue". You can also use the contact form below to reach our support team directly.'
    },
    {
      question: 'Can I schedule orders for later?',
      answer: 'Yes! During checkout, you can select "Schedule for Later" and choose your preferred delivery time up to 24 hours in advance.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>Help & Support</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Quick Contact Options */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Phone className="w-6 h-6 text-[#224e4a] mx-auto mb-2" />
              <p className="text-xs">Call Us</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Mail className="w-6 h-6 text-[#224e4a] mx-auto mb-2" />
              <p className="text-xs">Email</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-6 h-6 text-[#224e4a] mx-auto mb-2" />
              <p className="text-xs">Live Chat</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="border-[#224e4a]/20 bg-gradient-to-br from-[#224e4a]/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#224e4a]">
              <MessageSquare className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+66 2 123 4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>support@moiorder.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>24/7 Customer Support</span>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-[#224e4a]" />
            <h2>Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input 
                placeholder="What is this about?"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea 
                placeholder="Describe your issue or question"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <Button className="w-full bg-[#224e4a] hover:bg-[#1a3a37]">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card className="bg-gradient-to-br from-[#FF7A00]/5 to-transparent border-[#FF7A00]/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-[#FF7A00] mx-auto mb-2" />
            <p className="text-sm">Average Response Time</p>
            <p className="text-[#FF7A00]">Under 2 hours</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
