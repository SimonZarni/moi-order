import React from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { WorkPermitSubmission, SubmissionStatus } from '../../types/submissions';

interface WorkPermitNotificationsProps {
  onBack: () => void;
  onViewSubmission: (id: string) => void;
  language: 'en' | 'my';
}

export function WorkPermitNotifications({ onBack, onViewSubmission, language }: WorkPermitNotificationsProps) {
  // Get submissions from localStorage
  const getSubmissions = (): WorkPermitSubmission[] => {
    const stored = localStorage.getItem('workPermitSubmissions');
    return stored ? JSON.parse(stored) : [];
  };

  const submissions = getSubmissions();

  const getStatusIcon = (status: SubmissionStatus) => {
    switch (status) {
      case 'pending_review':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'form_approved':
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      case 'payment_submitted':
        return <AlertCircle className="w-5 h-5 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: SubmissionStatus) => {
    const statusMap = {
      en: {
        pending_review: 'Pending Review',
        form_approved: 'Approved - Payment Required',
        payment_submitted: 'Payment Under Review',
        completed: 'Completed',
        rejected: 'Rejected'
      },
      my: {
        pending_review: 'စစ်ဆေးနေဆဲ',
        form_approved: 'အတည်ပြုပြီး - ငွေပေးချေရန်',
        payment_submitted: 'ငွေပေးချေမှုစစ်ဆေးနေဆဲ',
        completed: 'ပြီးမြောက်ပြီ',
        rejected: 'ပယ်ချခဲ့သည်'
      }
    };
    return statusMap[language][status] || status;
  };

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'pending_review':
        return 'bg-yellow-50 border-yellow-200';
      case 'form_approved':
        return 'bg-blue-50 border-blue-200';
      case 'payment_submitted':
        return 'bg-purple-50 border-purple-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
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
          <h1>{language === 'en' ? 'Work Permit - Notifications' : 'အလုပ်ခွင့်လိုင်စင် - အကြောင်းကြားချက်များ'}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-20">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {language === 'en' ? 'No submissions yet' : 'တင်သွင်းမှုမရှိသေးပါ'}
            </p>
          </div>
        ) : (
          submissions.map((submission) => (
            <Card 
              key={submission.id} 
              className={`cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(submission.status)}`}
              onClick={() => onViewSubmission(submission.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getStatusIcon(submission.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{submission.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'en' ? 'Position:' : 'ရာထူး:'} {submission.jobPosition}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{getStatusText(submission.status)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {submission.status === 'form_approved' ? (
                      <div className="mt-2 p-2 bg-blue-100 rounded-md">
                        <p className="text-sm text-blue-800">
                          {language === 'en' 
                            ? '⚡ Action Required: Please submit payment' 
                            : '⚡ လုပ်ဆောင်ရန်လိုအပ်သည်: ငွေပေးချေရန်'}
                        </p>
                      </div>
                    ) : null}

                    {submission.adminNotes && (
                      <div className="mt-2 p-2 bg-gray-100 rounded-md">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">{language === 'en' ? 'Admin Note:' : 'စီမံခန့်ခွဲသူမှတ်ချက်:'}</span> {submission.adminNotes}
                        </p>
                      </div>
                    )}

                    {submission.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-100 rounded-md">
                        <p className="text-sm text-red-800">
                          <span className="font-medium">{language === 'en' ? 'Rejection Reason:' : 'ပယ်ချရခြင်းအကြောင်းရင်း:'}</span> {submission.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
