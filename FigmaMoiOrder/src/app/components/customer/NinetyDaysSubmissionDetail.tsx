import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, XCircle, Clock, CreditCard, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { NinetyDaysSubmission, SubmissionStatus, getStatusLabel, getStatusColor } from '../../types/submissions';

interface NinetyDaysSubmissionDetailProps {
  submissionId: string;
  onBack: () => void;
  language: 'en' | 'my';
}

export function NinetyDaysSubmissionDetail({ submissionId, onBack, language }: NinetyDaysSubmissionDetailProps) {
  const [paymentProof, setPaymentProof] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get submission from localStorage
  const getSubmission = (): NinetyDaysSubmission | null => {
    const stored = localStorage.getItem('ninetyDaysSubmissions');
    if (!stored) return null;
    const submissions: NinetyDaysSubmission[] = JSON.parse(stored);
    return submissions.find(s => s.id === submissionId) || null;
  };

  const submission = getSubmission();

  if (!submission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Submission not found</p>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = () => {
    if (!paymentProof) {
      alert(language === 'en' ? 'Please upload payment proof' : 'ငွေပေးချေမှုအထောက်အထားတင်ပါ');
      return;
    }

    setIsSubmitting(true);

    // Update submission with payment proof
    const stored = localStorage.getItem('ninetyDaysSubmissions');
    if (stored) {
      const submissions: NinetyDaysSubmission[] = JSON.parse(stored);
      const index = submissions.findIndex(s => s.id === submissionId);
      if (index !== -1) {
        submissions[index] = {
          ...submissions[index],
          paymentProof,
          status: 'payment_submitted',
          paymentSubmittedAt: new Date().toISOString()
        };
        localStorage.setItem('ninetyDaysSubmissions', JSON.stringify(submissions));
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      alert(language === 'en' 
        ? 'Payment proof submitted successfully! Admin will review it shortly.' 
        : 'ငွေပေးချေမှုအထောက်အထားကို အောင်မြင်စွာတင်သွင်းပြီးပါပြီ။ Admin မှ မကြာမီ စစ်ဆေးပါမည်။');
      onBack();
    }, 1000);
  };

  const getStatusIcon = (status: SubmissionStatus) => {
    switch (status) {
      case 'pending_review':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'form_approved':
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case 'payment_submitted':
        return <CreditCard className="w-6 h-6 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>{language === 'en' ? 'Submission Details' : 'တင်သွင်းမှုအသေးစိတ်'}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Status Card */}
        <Card className={getStatusColor(submission.status)}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(submission.status)}
              <div className="flex-1">
                <p className="font-medium">{getStatusLabel(submission.status)}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Submitted on' : 'တင်သွင်းသည့်ရက်စွဲ'} {new Date(submission.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Personal Information' : 'ကိုယ်ရေးအချက်အလက်များ'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-muted-foreground">{language === 'en' ? 'Full Name:' : 'အမည်အပြည့်အစုံ:'}</p>
              <p className="font-medium">{submission.fullName}</p>
              
              <p className="text-muted-foreground">{language === 'en' ? 'Father Name:' : 'အဘအမည်:'}</p>
              <p className="font-medium">{submission.fatherName}</p>
              
              <p className="text-muted-foreground">{language === 'en' ? 'Nationality:' : 'နိုင်ငံမှု:'}</p>
              <p className="font-medium">{submission.nationality}</p>
              
              <p className="text-muted-foreground">{language === 'en' ? 'Passport:' : 'နိုင်ငံကူးလက်မှတ်:'}</p>
              <p className="font-medium">{submission.passportNumber}</p>
              
              <p className="text-muted-foreground">{language === 'en' ? 'Date of Birth:' : 'မွေးသက္ကရာဇ်:'}</p>
              <p className="font-medium">{submission.dateOfBirth}</p>
              
              <p className="text-muted-foreground">{language === 'en' ? 'Arrival Date:' : 'ရောက်ရှိသည့်ရက်:'}</p>
              <p className="font-medium">{submission.arrivalDate}</p>
              
              <p className="text-muted-foreground">{language === 'en' ? 'Phone:' : 'ဖုန်း:'}</p>
              <p className="font-medium">{submission.phoneNumber}</p>
              
              <p className="text-muted-foreground">{language === 'en' ? 'Email:' : 'အီးမေးလ်:'}</p>
              <p className="font-medium">{submission.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{language === 'en' ? 'Current Address:' : 'လက်ရှိလိပ်စာ:'}</p>
              <p className="font-medium">{submission.currentAddress}</p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Notes */}
        {submission.adminNotes && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">
                    {language === 'en' ? 'Admin Notes' : 'စီမံခန့်ခွဲသူမှတ်ချက်'}
                  </p>
                  <p className="text-sm text-blue-800">{submission.adminNotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejection Reason */}
        {submission.rejectionReason && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 mb-1">
                    {language === 'en' ? 'Rejection Reason' : 'ပယ်ချရခြင်းအကြောင်းရင်း'}
                  </p>
                  <p className="text-sm text-red-800">{submission.rejectionReason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Required */}
        {submission.status === 'form_approved' && !submission.paymentProof && (
          <Card className="border-blue-300 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">
                {language === 'en' ? '💰 Payment Required' : '💰 ငွေပေးချေရန်လိုအပ်သည်'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  {language === 'en' ? 'Service Fee:' : 'ဝန်ဆောင်မှုခ:'}
                </p>
                <p className="text-2xl font-bold text-[#224e4a]">฿{submission.serviceFee}</p>
              </div>

              {/* QR Code Display */}
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium mb-3 text-center">
                    {language === 'en' ? 'Scan QR Code to Pay via PromptPay' : 'PromptPay ဖြင့် ငွေပေးချေရန် QR Code ကို scan လုပ်ပါ'}
                  </p>
                  <div className="w-48 h-48 bg-white rounded-lg p-2 shadow-sm mb-3">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021129370016A000000677010111011300669876543215802TH5303764540${submission.serviceFee.toFixed(2)}5802TH6304`}
                      alt="PromptPay QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {language === 'en' ? 'PromptPay Payment' : 'PromptPay ငွေပေးချေမှု'}
                  </p>
                  <p className="text-sm font-medium text-[#224e4a] mt-1">
                    ฿{submission.serviceFee.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{language === 'en' ? 'Upload Payment Proof (QR Code Screenshot)' : 'ငွေပေးချေမှုအထောက်အထားတင်ပါ (QR Code Screenshot)'}</Label>
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                {paymentProof && (
                  <div className="mt-2">
                    <img src={paymentProof} alt="Payment proof" className="w-full max-w-sm rounded-lg border" />
                  </div>
                )}
              </div>

              <Button 
                className="w-full bg-[#224e4a] hover:bg-[#1a3a37] disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSubmitPayment}
                disabled={isSubmitting || !paymentProof}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isSubmitting 
                  ? (language === 'en' ? 'Submitting...' : 'တင်သွင်းနေသည်...') 
                  : (language === 'en' ? 'Submit Payment' : 'ငွေပေးချေမှုတင်သွင်းရန်')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payment Submitted */}
        {submission.status === 'payment_submitted' && submission.paymentProof && (
          <Card className="border-purple-300 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-900">
                {language === 'en' ? '⏳ Payment Under Review' : '⏳ ငွေပေးချေမှုစစ်ဆေးနေသည်'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-purple-800">
                {language === 'en' 
                  ? 'Your payment proof has been submitted and is being reviewed by admin.' 
                  : 'သင်၏ငွေပေးချေမှုအထောက်အထားကို admin မှ စစ်ဆေးနေပါသည်။'}
              </p>
              <div>
                <p className="text-sm font-medium text-purple-900 mb-2">
                  {language === 'en' ? 'Submitted Payment Proof:' : 'တင်သွင်းထားသော ငွေပေးချေမှုအထောက်အထား:'}
                </p>
                <img src={submission.paymentProof} alt="Payment proof" className="w-full max-w-sm rounded-lg border" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed */}
        {submission.status === 'completed' && (
          <Card className="border-green-300 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                {language === 'en' ? '🎉 Completed Successfully!' : '🎉 အောင်မြင်စွာပြီးမြောက်ပါပြီ!'}
              </h3>
              <p className="text-sm text-green-800">
                {language === 'en' 
                  ? 'Your 90 Days Report has been processed successfully.' 
                  : 'သင်၏ 90 ရက် အစီရင်ခံစာကို အောင်မြင်စွာ စီမံဆောင်ရွက်ပြီးပါပြီ။'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}