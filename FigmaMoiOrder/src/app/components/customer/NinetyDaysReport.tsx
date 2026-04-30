import React, { useState } from 'react';
import { ArrowLeft, Calendar, FileText, Download, CheckCircle, History, Upload, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { NinetyDaysSubmission } from '../../types/submissions';

interface NinetyDaysReportProps {
  onBack: () => void;
  onViewHistory?: () => void;
  onViewNotifications?: () => void;
  language: 'en' | 'my';
}

export function NinetyDaysReport({ onBack, onViewHistory, onViewNotifications, language }: NinetyDaysReportProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    nationality: '',
    passportNumber: '',
    dateOfBirth: '',
    arrivalDate: '',
    currentAddress: '',
    phoneNumber: '',
    email: ''
  });
  
  const [files, setFiles] = useState({
    passportCopy: '',
    visaPage: '',
    previousReport: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Create new submission
    const newSubmission: NinetyDaysSubmission = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      ...formData,
      passportCopy: files.passportCopy,
      visaPage: files.visaPage,
      previousReport: files.previousReport,
      serviceFee: 1000
    };
    
    // Save to localStorage
    const existing = localStorage.getItem('ninetyDaysSubmissions');
    const submissions = existing ? JSON.parse(existing) : [];
    submissions.push(newSubmission);
    localStorage.setItem('ninetyDaysSubmissions', JSON.stringify(submissions));
    
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setFormData({
        fullName: '',
        fatherName: '',
        nationality: '',
        passportNumber: '',
        dateOfBirth: '',
        arrivalDate: '',
        currentAddress: '',
        phoneNumber: '',
        email: ''
      });
      setFiles({
        passportCopy: '',
        visaPage: '',
        previousReport: ''
      });
      alert('Report submitted successfully! You can track its status in the history.');
      if (onViewHistory) onViewHistory();
    }, 1000);
  };

  const recentReports = [
    {
      id: '1',
      date: '2024-11-01',
      status: 'Completed',
      nextDueDate: '2025-01-30'
    },
    {
      id: '2',
      date: '2024-08-05',
      status: 'Completed',
      nextDueDate: '2024-11-03'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1>90 Days Report Service</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onViewNotifications}>
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Next Report Due */}
        <Card className="bg-gradient-to-br from-[#FF7A00]/5 to-transparent border-[#FF7A00]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-[#FF7A00]" />
              <div>
                <p className="text-sm">Next Report Due</p>
                <p className="text-[#FF7A00]">30 Jan 2025</p>
                <p className="text-xs text-muted-foreground">60 days remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Report Form */}
        <Card>
          <CardHeader>
            <CardTitle>အစီရင်ခံစာအသစ် တင်သွင်းရန်</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>အမည်အပြည့်အစုံ</Label>
              <Input 
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>အဘအမည်</Label>
              <Input 
                placeholder="Father Name"
                value={formData.fatherName}
                onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>နိုင်ငံမှု</Label>
              <Input 
                placeholder="Nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({...formData, nationality: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Passport Number</Label>
              <Input 
                placeholder="Passport Number"
                value={formData.passportNumber}
                onChange={(e) => setFormData({...formData, passportNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input 
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Arrival Date</Label>
              <Input 
                type="date"
                value={formData.arrivalDate}
                onChange={(e) => setFormData({...formData, arrivalDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>လိပ်သာ</Label>
              <Input 
                placeholder="Current Address in Thailand"
                value={formData.currentAddress}
                onChange={(e) => setFormData({...formData, currentAddress: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input 
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Passport Copy</Label>
              <Input 
                type="file"
                onChange={(e) => handleFileUpload('passportCopy', e)}
              />
            </div>
            <div className="space-y-2">
              <Label>Visa Page</Label>
              <Input 
                type="file"
                onChange={(e) => handleFileUpload('visaPage', e)}
              />
            </div>
            <div className="space-y-2">
              <Label>Previous Report</Label>
              <Input 
                type="file"
                onChange={(e) => handleFileUpload('previousReport', e)}
              />
            </div>
            <Button 
              className="w-full bg-[#224e4a] hover:bg-[#1a3a37]" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <div>
          <h2 className="mb-3">မှတ်တမ်းများ</h2>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#224e4a]/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-[#224e4a]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Report Date</p>
                        <p>{report.date}</p>
                        <p className="text-sm text-muted-foreground mt-1">Next Due</p>
                        <p className="text-[#FF7A00]">{report.nextDueDate}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}