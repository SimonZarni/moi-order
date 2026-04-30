import React, { useState } from 'react';
import { ArrowLeft, FileText, Upload, QrCode, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { NinetyDaysSubmission, EmbassyLetterSubmission, WorkPermitSubmission, getStatusLabel, getStatusColor } from '../../types/submissions';

type AnySubmission = NinetyDaysSubmission | EmbassyLetterSubmission | WorkPermitSubmission;

interface SubmissionDetailViewProps {
  submission: AnySubmission;
  submissionType: 'ninetyDays' | 'embassyLetter' | 'workPermit';
  onBack: () => void;
  onUpdate: () => void;
}

export function SubmissionDetailView({ submission, submissionType, onBack, onUpdate }: SubmissionDetailViewProps) {
  const [paymentProof, setPaymentProof] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!paymentProof) return;
    
    setIsSubmitting(true);
    
    // Update submission with payment proof
    const storageKey = `${submissionType}Submissions`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const submissions = JSON.parse(stored);
      const index = submissions.findIndex((s: AnySubmission) => s.id === submission.id);
      if (index !== -1) {
        submissions[index] = {
          ...submissions[index],
          status: 'payment_submitted',
          paymentProof,
          paymentSubmittedAt: new Date().toISOString()
        };
        localStorage.setItem(storageKey, JSON.stringify(submissions));
      }
    }
    
    setTimeout(() => {
      setIsSubmitting(false);
      onUpdate();
    }, 1000);
  };

  const getTitle = () => {
    switch (submissionType) {
      case 'ninetyDays':
        return '90 Days Report Submission';
      case 'embassyLetter':
        return 'Embassy Letter Request';
      case 'workPermit':
        return 'Work Permit Application';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-[#224e4a] px-4 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-white font-semibold">{getTitle()}</h1>
            <p className="text-white/80 text-sm">ID: {submission.id}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Status</span>
              <Badge variant="outline" className={getStatusColor(submission.status)}>
                {getStatusLabel(submission.status)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                submission.status === 'pending_review' || submission.status === 'form_approved' || submission.status === 'payment_submitted' || submission.status === 'completed'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Form Submitted</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(submission.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {submission.status !== 'rejected' && (
              <>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    submission.status === 'form_approved' || submission.status === 'payment_submitted' || submission.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : submission.status === 'pending_review'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {submission.status === 'pending_review' ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Form Approved</p>
                    {submission.formApprovedAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.formApprovedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    submission.status === 'payment_submitted' || submission.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : submission.status === 'form_approved'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {submission.status === 'form_approved' ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Payment Submitted</p>
                    {submission.paymentSubmittedAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.paymentSubmittedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    submission.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : submission.status === 'payment_submitted'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {submission.status === 'payment_submitted' ? (
                      <Clock className="w-5 h-5" />
                    ) : submission.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Completed</p>
                    {submission.completedAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.completedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {submission.status === 'rejected' && submission.rejectionReason && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Rejection Reason</p>
                    <p className="text-sm text-red-700 mt-1">{submission.rejectionReason}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Section - Only show if form is approved */}
        {submission.status === 'form_approved' && (
          <Card>
            <CardHeader>
              <CardTitle>Submit Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  Your form has been approved! Please complete the payment to proceed.
                </p>
              </div>

              {/* QR Code Display */}
              <div className="bg-white p-4 rounded border flex flex-col items-center">
                <QrCode className="w-16 h-16 text-[#224e4a] mb-3" />
                <p className="text-sm text-center mb-2">Scan QR code to pay</p>
                <p className="font-medium text-[#224e4a] text-lg">
                  ฿{submission.serviceFee.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">PromptPay Payment</p>
              </div>

              {/* Upload Payment Proof */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Payment Screenshot</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePaymentProofUpload}
                    className="hidden"
                    id="payment-proof"
                  />
                  <label htmlFor="payment-proof" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {paymentProof ? 'Payment proof uploaded' : 'Click to upload payment screenshot'}
                    </p>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleSubmitPayment}
                disabled={!paymentProof || isSubmitting}
                className="w-full bg-[#224e4a] hover:bg-[#1a3d39]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Payment'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {'fullName' in submission && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Full Name:</span>
                <span className="font-medium">{submission.fullName}</span>
              </div>
            )}
            {'passportNumber' in submission && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Passport Number:</span>
                <span className="font-medium">{submission.passportNumber}</span>
              </div>
            )}
            {'nationality' in submission && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Nationality:</span>
                <span className="font-medium">{submission.nationality}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Service Fee:</span>
              <span className="font-medium">฿{submission.serviceFee.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {submission.adminNotes && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{submission.adminNotes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}