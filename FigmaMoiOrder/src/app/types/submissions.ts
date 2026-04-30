// Submission types and interfaces for all services

export type SubmissionStatus = 
  | 'pending_review'        // Initial submission, waiting for admin review
  | 'form_approved'         // Admin approved form, awaiting payment
  | 'payment_submitted'     // User submitted payment proof
  | 'completed'             // Admin approved payment, process complete
  | 'rejected';             // Admin rejected at any stage

export interface NinetyDaysSubmission {
  id: string;
  submittedAt: string;
  status: SubmissionStatus;
  
  // Form data
  fullName: string;
  fatherName: string;
  nationality: string;
  passportNumber: string;
  dateOfBirth: string;
  arrivalDate: string;
  currentAddress: string;
  phoneNumber: string;
  email: string;
  
  // File uploads
  passportCopy?: string;
  visaPage?: string;
  previousReport?: string;
  
  // Payment
  serviceFee: number;
  paymentProof?: string;
  
  // Admin notes
  adminNotes?: string;
  rejectionReason?: string;
  
  // Timestamps
  formApprovedAt?: string;
  paymentSubmittedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
}

export interface EmbassyLetterSubmission {
  id: string;
  submittedAt: string;
  status: SubmissionStatus;
  
  // Form data
  fullName: string;
  passportNumber: string;
  nationality: string;
  purposeOfLetter: string;
  requestDetails: string;
  phoneNumber: string;
  email: string;
  
  // File uploads
  passportCopy?: string;
  supportingDocs?: string;
  
  // Payment
  serviceFee: number;
  paymentProof?: string;
  
  // Admin notes
  adminNotes?: string;
  rejectionReason?: string;
  
  // Timestamps
  formApprovedAt?: string;
  paymentSubmittedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
}

export interface WorkPermitSubmission {
  id: string;
  submittedAt: string;
  status: SubmissionStatus;
  
  // Form data in Burmese
  fullName: string;      // အမည်
  fatherName: string;    // အဘအမည်
  nationality: string;   // နိုင်ငံသား
  nrcNumber: string;     // မှတ်ပုံတင်အမှတ်
  dateOfBirth: string;   // မွေးသက္ကရာဇ်
  passportNumber: string; // နိုင်ငံကူးလက်မှတ်အမှတ်
  currentAddress: string; // နေရပ်လိပ်စာ
  phoneNumber: string;    // ဖုန်းနံပါတ်
  email: string;
  employerName: string;   // အလုပ်ရှင်အမည်
  jobPosition: string;    // ရာထူး
  
  // File uploads
  passportCopy?: string;
  photos?: string;
  educationCerts?: string;
  medicalCert?: string;
  
  // Payment
  serviceFee: number;
  paymentProof?: string;
  
  // Admin notes
  adminNotes?: string;
  rejectionReason?: string;
  
  // Timestamps
  formApprovedAt?: string;
  paymentSubmittedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
}

export const getStatusLabel = (status: SubmissionStatus): string => {
  const labels: Record<SubmissionStatus, string> = {
    pending_review: 'Pending Review',
    form_approved: 'Approved - Awaiting Payment',
    payment_submitted: 'Payment Under Review',
    completed: 'Completed',
    rejected: 'Rejected'
  };
  return labels[status];
};

export const getStatusColor = (status: SubmissionStatus): string => {
  const colors: Record<SubmissionStatus, string> = {
    pending_review: 'bg-yellow-100 text-yellow-800',
    form_approved: 'bg-blue-100 text-blue-800',
    payment_submitted: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };
  return colors[status];
};
