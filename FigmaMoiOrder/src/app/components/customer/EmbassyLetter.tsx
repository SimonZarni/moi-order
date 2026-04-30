import React, { useState } from 'react';
import { ArrowLeft, Building, FileText, Send, Clock, Bell, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { EmbassyLetterSubmission } from '../../types/submissions';

interface EmbassyLetterProps {
  onBack: () => void;
  onViewNotifications?: () => void;
  language?: 'en' | 'my';
}

export function EmbassyLetter({ onBack, onViewNotifications, language = 'my' }: EmbassyLetterProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    nationality: '',
    purposeOfLetter: '',
    requestDetails: '',
    phoneNumber: '',
    email: '',
  });

  const [passportCopy, setPassportCopy] = useState('');
  const [supportingDocs, setSupportingDocs] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceFee = 500; // ฿500 for embassy letter service

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'passport' | 'supporting') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'passport') {
          setPassportCopy(reader.result as string);
        } else {
          setSupportingDocs(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Create submission
    const submission: EmbassyLetterSubmission = {
      id: `EMB-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      fullName: formData.fullName,
      passportNumber: formData.passportNumber,
      nationality: formData.nationality,
      purposeOfLetter: formData.purposeOfLetter,
      requestDetails: formData.requestDetails,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      passportCopy,
      supportingDocs,
      serviceFee
    };

    // Save to localStorage
    const stored = localStorage.getItem('embassyLetterSubmissions');
    const submissions = stored ? JSON.parse(stored) : [];
    submissions.push(submission);
    localStorage.setItem('embassyLetterSubmissions', JSON.stringify(submissions));

    setTimeout(() => {
      setIsSubmitting(false);
      alert(language === 'en' 
        ? 'Embassy letter request submitted successfully! Admin will review it shortly.' 
        : 'သံရုံးစာတောင်းခံမှုကို အောင်မြင်စွာတင်သွင်းပြီးပါပြီ။ Admin မှ မကြာမီ စစ်ဆေးပါမည်။');
      
      // Reset form
      setFormData({
        fullName: '',
        passportNumber: '',
        nationality: '',
        purposeOfLetter: '',
        requestDetails: '',
        phoneNumber: '',
        email: '',
      });
      setPassportCopy('');
      setSupportingDocs('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1>{language === 'en' ? 'Embassy Letter' : 'သံရုံး အကြောင်းကြားစာ'}</h1>
          </div>
          {onViewNotifications && (
            <Button variant="ghost" size="icon" onClick={onViewNotifications}>
              <Bell className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Embassy Info Card */}
        <Card className="border-[#224e4a]/20 bg-gradient-to-br from-[#224e4a]/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#224e4a]">
              <Building className="w-5 h-5" />
              {language === 'en' ? 'Embassy of Myanmar - Bangkok' : 'မြန်မာသံရုံး - ဘန်ကောက်'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>📍 132 Sathorn Nua Road, Bangkok 10500</p>
            <p>📞 +66 2 233 2237</p>
            <p>⏰ {language === 'en' ? 'Mon-Fri: 9:00 AM - 4:00 PM' : 'တနင်္လာ-သောကြာ: 9:00 AM - 4:00 PM'}</p>
            <p>✉️ embassy@myanmarbangkok.com</p>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Embassy Letter Request' : 'အကြောင်းကြားစာ တောင်းခံရန်'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Full Name' : 'အမည်အပြည့်အစုံ'} *</Label>
              <Input 
                placeholder={language === 'en' ? 'Enter full name' : 'အမည်အပြည့်အစုံထည့်ပါ'}
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'en' ? 'Passport Number' : 'နိုင်ငံကူးလက်မှတ်နံပါတ်'} *</Label>
              <Input 
                placeholder={language === 'en' ? 'Passport Number' : 'နိုင်ငံကူးလက်မှတ်နံပါတ်'}
                value={formData.passportNumber}
                onChange={(e) => setFormData({...formData, passportNumber: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'en' ? 'Nationality' : 'နိုင်ငံသား'} *</Label>
              <Input 
                placeholder={language === 'en' ? 'e.g., Myanmar' : 'ဥပမာ - မြန်မာ'}
                value={formData.nationality}
                onChange={(e) => setFormData({...formData, nationality: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'en' ? 'Purpose of Letter' : 'စာ၏ရည်ရွယ်ချက်'} *</Label>
              <Input 
                placeholder={language === 'en' ? 'e.g., Visa Extension, Bank Account' : 'ဥပမာ - ဗီဇာတိုးခြင်း၊ ဘဏ်အကောင့်'}
                value={formData.purposeOfLetter}
                onChange={(e) => setFormData({...formData, purposeOfLetter: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'en' ? 'Request Details' : 'တောင်းဆိုချက်အသေးစိတ်'} *</Label>
              <Textarea 
                placeholder={language === 'en' ? 'Provide detailed information about your request' : 'သင့်တောင်းဆိုချက်အသေးစိတ်ဖော်ပြပါ'}
                rows={4}
                value={formData.requestDetails}
                onChange={(e) => setFormData({...formData, requestDetails: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'en' ? 'Phone Number' : 'ဖုန်းနံပါတ်'} *</Label>
              <Input 
                placeholder={language === 'en' ? '+66 XX XXX XXXX' : '+66 XX XXX XXXX'}
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'en' ? 'Email' : 'အီးမေးလ်'} *</Label>
              <Input 
                type="email"
                placeholder={language === 'en' ? 'email@example.com' : 'email@example.com'}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* File Uploads */}
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-medium">{language === 'en' ? 'Required Documents' : 'လိုအပ်သောစာရွက်စာတမ်းများ'}</h3>
              
              <div className="space-y-2">
                <Label>{language === 'en' ? 'Passport Copy' : 'နိုင်ငံကူးလက်မှတ်မိတ္တူ'} *</Label>
                <Input 
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, 'passport')}
                />
                {passportCopy && (
                  <p className="text-sm text-green-600">✓ {language === 'en' ? 'File uploaded' : 'ဖိုင်တင်ပြီးပါပြီ'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{language === 'en' ? 'Supporting Documents (Optional)' : 'ထောက်ခံစာရွက်စာတမ်းများ (ရွေးချယ်ပိုင်ခွင့်)'}</Label>
                <Input 
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, 'supporting')}
                />
                {supportingDocs && (
                  <p className="text-sm text-green-600">✓ {language === 'en' ? 'File uploaded' : 'ဖိုင်တင်ပြီးပါပြီ'}</p>
                )}
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <p className="text-muted-foreground">
                ⚠️ {language === 'en' ? 'Processing time: 3-5 business days' : 'ကြာချိန်: ၃-၅ ရက်သာ'}
                <br />
                💰 {language === 'en' ? `Service Fee: ฿${serviceFee}` : `ဝန်ဆောင်မှုခ: ฿${serviceFee}`}
              </p>
            </div>

            <Button 
              className="w-full bg-[#224e4a] hover:bg-[#1a3a37]"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting 
                ? (language === 'en' ? 'Submitting...' : 'တင်သွင်းနေသည်...') 
                : (language === 'en' ? 'Submit Request' : 'တောင်းဆိုချက်တင်သွင်းရန်')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}