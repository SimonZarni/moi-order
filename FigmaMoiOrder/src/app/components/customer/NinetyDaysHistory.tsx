import React from 'react';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { NinetyDaysSubmission, getStatusLabel, getStatusColor } from '../../types/submissions';

interface NinetyDaysHistoryProps {
  onBack: () => void;
  onViewSubmission: (submission: NinetyDaysSubmission) => void;
  language: 'en' | 'my';
}

export function NinetyDaysHistory({ onBack, onViewSubmission, language }: NinetyDaysHistoryProps) {
  
  // Get submissions from localStorage
  const getSubmissions = (): NinetyDaysSubmission[] => {
    const stored = localStorage.getItem('ninetyDaysSubmissions');
    return stored ? JSON.parse(stored) : [];
  };

  const submissions = getSubmissions().sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'form_approved':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'payment_submitted':
        return <Clock className="w-5 h-5 text-purple-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-[#224e4a] px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-white font-semibold">90 Days Report History</h1>
            <p className="text-white/80 text-sm">{submissions.length} submission(s)</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Submissions Yet</h3>
              <p className="text-sm text-muted-foreground">
                Your 90 Days Report submissions will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card 
              key={submission.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onViewSubmission(submission)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(submission.status)}
                    <div>
                      <p className="font-medium">{submission.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.submittedAt).toLocaleDateString()} at{' '}
                        {new Date(submission.submittedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(submission.status)}>
                    {getStatusLabel(submission.status)}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passport:</span>
                    <span className="font-medium">{submission.passportNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee:</span>
                    <span className="font-medium">฿{submission.serviceFee.toLocaleString()}</span>
                  </div>
                </div>

                {submission.status === 'form_approved' && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                    ⚠️ Action Required: Please submit payment to continue
                  </div>
                )}

                {submission.rejectionReason && (
                  <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700">
                    Rejection Reason: {submission.rejectionReason}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}