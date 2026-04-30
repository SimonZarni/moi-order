import React, { useState } from 'react';
import { ArrowLeft, FileText, Upload, Bell, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Translations } from '../../utils/translations';
import { WorkPermitSubmission as WorkPermitSubmissionType } from '../../types/submissions';

interface WorkPermitScreenProps {
  onBack: () => void;
  onSubmit: (submission: WorkPermitSubmission) => void;
  t: Translations;
  onViewNotifications?: () => void;
}

export interface WorkPermitSubmission {
  id: string;
  fullName: string;
  fatherName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  currentAddress: string;
  phoneNumber: string;
  occupation: string;
  companyName: string;
  companyAddress: string;
  paymentProof: string | null;
  paymentProofFile: File | null;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  total: number;
}

export function WorkPermitScreen({ onBack, onSubmit, t, onViewNotifications }: WorkPermitScreenProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    passportNumber: '',
    nationality: '',
    nrcNumber: '',
    dateOfBirth: '',
    currentAddress: '',
    phoneNumber: '',
    email: '',
    employerName: '',
    jobPosition: '',
  });

  const [passportCopy, setPassportCopy] = useState('');
  const [photos, setPhotos] = useState('');
  const [educationCerts, setEducationCerts] = useState('');
  const [medicalCert, setMedicalCert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceFee = 5000; // ฿5000 for work permit service

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'passport' | 'photos' | 'education' | 'medical') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'passport') {
          setPassportCopy(result);
        } else if (field === 'photos') {
          setPhotos(result);
        } else if (field === 'education') {
          setEducationCerts(result);
        } else {
          setMedicalCert(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Create submission matching the WorkPermitSubmission type from submissions.ts
    const submission: WorkPermitSubmissionType = {
      id: `WP-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      fullName: formData.fullName,
      fatherName: formData.fatherName,
      nationality: formData.nationality,
      nrcNumber: formData.nrcNumber,
      dateOfBirth: formData.dateOfBirth,
      passportNumber: formData.passportNumber,
      currentAddress: formData.currentAddress,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      employerName: formData.employerName,
      jobPosition: formData.jobPosition,
      passportCopy,
      photos,
      educationCerts,
      medicalCert,
      serviceFee
    };

    // Save to localStorage
    const stored = localStorage.getItem('workPermitSubmissions');
    const submissions = stored ? JSON.parse(stored) : [];
    submissions.push(submission);
    localStorage.setItem('workPermitSubmissions', JSON.stringify(submissions));
    console.log('Work Permit Submission saved:', submission);
    console.log('Total submissions:', submissions.length);

    // Also send to parent component (App.tsx) to sync with admin dashboard
    onSubmit(submission as any);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(t.language === 'en' 
        ? 'Work permit application submitted successfully! Admin will review it shortly.' 
        : 'အလုပ်ခွင့်လိုင်စင်လျှောက်ထားမှုကို အောင်မြင်စွာတင်သွင်းပြီးပါပြီ။ Admin မှ မကြာမီ စစ်ဆေးပါမည်။');
      
      // Reset form
      setFormData({
        fullName: '',
        fatherName: '',
        passportNumber: '',
        nationality: '',
        nrcNumber: '',
        dateOfBirth: '',
        currentAddress: '',
        phoneNumber: '',
        email: '',
        employerName: '',
        jobPosition: '',
      });
      setPassportCopy('');
      setPhotos('');
      setEducationCerts('');
      setMedicalCert('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1>{t.language === 'en' ? 'Work Permit & Pink Card' : 'အလုပ်ခွင့်လိုင်စင် နှင့် ပန်းရောင်ကဒ်'}</h1>
          </div>
          {onViewNotifications && (
            <Button variant="ghost" size="icon" onClick={onViewNotifications}>
              <Bell className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Service Info */}
        <Card className="bg-gradient-to-br from-[#224e4a]/5 to-transparent border-[#224e4a]/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-8 h-8 text-[#224e4a]" />
              <div>
                <h3 className="font-semibold text-[#224e4a] mb-1">
                  {t.language === 'en' ? 'Work Permit & Pink Card Service' : 'အလုပ်ခွင့်လိုင်စင်နှင့် ပန်းရောင်ကဒ် ဝန်ဆောင်မှု'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t.language === 'en' 
                    ? 'Complete application for work permit and pink card registration' 
                    : 'အလုပ်ခွင့်လိုင်စင်နှင့် ပန်းရောင်ကဒ် လျှောက်ထားခြင်းအတွက် ပြီးပြည့်စုံသော လျှောက်လွှာ'}
                </p>
                <p className="text-sm font-medium text-[#224e4a] mt-2">
                  💰 {t.language === 'en' ? `Service Fee: ฿${serviceFee}` : `ဝန်ဆောင်မှုခ: ฿${serviceFee}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t.language === 'en' ? 'Application Form' : 'လျှောက်လွှာ'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#224e4a]">
                {t.language === 'en' ? 'Personal Information' : 'ကိုယ်ရေးအချက်အလက်'}
              </h3>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Full Name' : 'အမည်'} *</Label>
                <Input 
                  placeholder={t.language === 'en' ? 'Enter full name' : 'အမည်ထည့်ပါ'}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Father Name' : 'အဘအမည်'} *</Label>
                <Input 
                  placeholder={t.language === 'en' ? 'Enter father name' : 'အဘအမည်ထည့်ပါ'}
                  value={formData.fatherName}
                  onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Nationality' : 'နိုင်ငံသား'} *</Label>
                <Input 
                  placeholder={t.language === 'en' ? 'e.g., Myanmar' : 'ဥပမာ - မြန်မာ'}
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'NRC Number' : 'မှတ်ပုံတင်အမှတ်'} *</Label>
                <Input 
                  placeholder={t.language === 'en' ? 'e.g., 12/OUKAMA(N)123456' : 'ဥပမာ - ၁၂/ဥကမ(နိုင်)၁၂၃၄၅၆'}
                  value={formData.nrcNumber}
                  onChange={(e) => setFormData({...formData, nrcNumber: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Date of Birth' : 'မွေးသက္ကရာဇ်'} *</Label>
                <Input 
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Passport Number' : 'နိုင်ငံကူးလက်မှတ်အမှတ်'} *</Label>
                <Input 
                  placeholder={t.language === 'en' ? 'Passport Number' : 'နိုင်ငံကူးလက်မှတ်အမှတ်'}
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({...formData, passportNumber: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Current Address' : 'နေရပ်လိပ်စာ'} *</Label>
                <Input 
                  placeholder={t.language === 'en' ? 'Full address in Thailand' : 'ထိုင်းနိုင်ငံရှိ လိပ်စာအပြည့်အစုံ'}
                  value={formData.currentAddress}
                  onChange={(e) => setFormData({...formData, currentAddress: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Phone Number' : 'ဖုန်းနံပါတ်'} *</Label>
                <Input 
                  placeholder="+66 XX XXX XXXX"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Email' : 'အီးမေးလ်'} *</Label>
                <Input 
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Employment Information */}
            <div className="pt-4 border-t space-y-4">
              <h3 className="text-sm font-medium text-[#224e4a]">
                {t.language === 'en' ? 'Employment Information' : 'အလုပ်အကိုင်အချက်အလက်'}
              </h3>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Employer Name' : 'အလုပ်ရှင်အမည်'} *</Label>
                <Input 
                  placeholder={t.language === 'en' ? 'Company or employer name' : 'ကုမ္ပဏီ သို့မဟုတ် အလုပ်ရှင်အမည်'}
                  value={formData.employerName}
                  onChange={(e) => setFormData({...formData, employerName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Job Position' : 'ရာထူး'} *</Label>
                <Input 
                  placeholder={t.language === 'en' ? 'Your job position' : 'သင့်ရာထူး'}
                  value={formData.jobPosition}
                  onChange={(e) => setFormData({...formData, jobPosition: e.target.value})}
                />
              </div>
            </div>

            {/* Required Documents */}
            <div className="pt-4 border-t space-y-4">
              <h3 className="text-sm font-medium text-[#224e4a]">
                {t.language === 'en' ? 'Documents (Optional)' : 'စာရွက်စာတမ်းများ (ရွေးချယ်ပိုင်ခွင့်)'}
              </h3>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Passport Copy (Optional)' : 'နိုင်ငံကူးလက်မှတ်မိတ္တူ (ရွေးချယ်ပိုင်ခွင့်)'}</Label>
                <Input 
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, 'passport')}
                />
                {passportCopy && (
                  <p className="text-sm text-green-600">✓ {t.language === 'en' ? 'File uploaded' : 'ဖိုင်တင်ပြီးပါပြီ'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Photos (2x2 inch) (Optional)' : 'ဓာတ်ပုံများ (2x2 လက်မ) (ရွေးချယ်ပိုင်ခွင့်)'}</Label>
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'photos')}
                />
                {photos && (
                  <p className="text-sm text-green-600">✓ {t.language === 'en' ? 'File uploaded' : 'ဖိုင်တင်ပြီးပါပြီ'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Education Certificates (Optional)' : 'ပညာအရည်အချင်းလက်မှတ် (ရွေးချယ်ပိုင်ခွင့်)'}</Label>
                <Input 
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, 'education')}
                />
                {educationCerts && (
                  <p className="text-sm text-green-600">✓ {t.language === 'en' ? 'File uploaded' : 'ဖိုင်တင်ပြီးပါပြီ'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t.language === 'en' ? 'Medical Certificate (Optional)' : 'ကျန်းမာရေးလက်မှတ် (ရွေးချယ်ပိုင်ခွင့်)'}</Label>
                <Input 
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, 'medical')}
                />
                {medicalCert && (
                  <p className="text-sm text-green-600">✓ {t.language === 'en' ? 'File uploaded' : 'ဖိုင်တင်ပြီးပါပြီ'}</p>
                )}
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <p className="text-muted-foreground">
                ⚠️ {t.language === 'en' ? 'Processing time: 7-14 business days' : 'ကြာချိန်: ၇-၁၄ ရက်သာ'}
                <br />
                💰 {t.language === 'en' ? `Service Fee: ฿${serviceFee}` : `ဝန်ဆောင်မှုခ: ฿${serviceFee}`}
              </p>
            </div>

            <Button 
              className="w-full bg-[#224e4a] hover:bg-[#1a3a37]"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting 
                ? (t.language === 'en' ? 'Submitting...' : 'တင်သွင်းနေသည်...') 
                : (t.language === 'en' ? 'Submit Application' : 'လျှောက်လွှာတင်သွင်းရန်')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}