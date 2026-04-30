import React, { useState } from 'react';
import { Search, Filter, Calendar, Download, CheckCircle, XCircle, Eye, FileText, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { WorkPermitSubmission, SubmissionStatus } from '../../types/submissions';

export function WorkPermitAdmin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'payment' | 'completed'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<WorkPermitSubmission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  const getSubmissions = (): WorkPermitSubmission[] => {
    const stored = localStorage.getItem('workPermitSubmissions');
    console.log('Admin reading workPermitSubmissions from localStorage:', stored);
    const parsed = stored ? JSON.parse(stored) : [];
    console.log('Parsed submissions:', parsed);
    return parsed;
  };

  const [submissions, setSubmissions] = useState<WorkPermitSubmission[]>(getSubmissions());

  const refreshSubmissions = () => {
    setSubmissions(getSubmissions());
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending_review');
  const approvedSubmissions = submissions.filter(s => s.status === 'form_approved');
  const paymentSubmissions = submissions.filter(s => s.status === 'payment_submitted');
  const completedSubmissions = submissions.filter(s => s.status === 'completed' || s.status === 'rejected');

  const displaySubmissions = 
    selectedTab === 'pending' ? pendingSubmissions :
    selectedTab === 'approved' ? approvedSubmissions :
    selectedTab === 'payment' ? paymentSubmissions :
    completedSubmissions;

  const filteredSubmissions = displaySubmissions.filter(sub =>
    sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApproveForm = (submission: WorkPermitSubmission) => {
    const stored = localStorage.getItem('workPermitSubmissions');
    if (stored) {
      const allSubmissions: WorkPermitSubmission[] = JSON.parse(stored);
      const index = allSubmissions.findIndex(s => s.id === submission.id);
      if (index !== -1) {
        allSubmissions[index] = {
          ...allSubmissions[index],
          status: 'form_approved',
          adminNotes: adminNote,
          formApprovedAt: new Date().toISOString()
        };
        localStorage.setItem('workPermitSubmissions', JSON.stringify(allSubmissions));
        refreshSubmissions();
        setShowModal(false);
        setAdminNote('');
        alert('Form approved! User will be notified to submit payment.');
      }
    }
  };

  const handleRejectForm = (submission: WorkPermitSubmission, reason: string) => {
    const stored = localStorage.getItem('workPermitSubmissions');
    if (stored) {
      const allSubmissions: WorkPermitSubmission[] = JSON.parse(stored);
      const index = allSubmissions.findIndex(s => s.id === submission.id);
      if (index !== -1) {
        allSubmissions[index] = {
          ...allSubmissions[index],
          status: 'rejected',
          rejectionReason: reason,
          rejectedAt: new Date().toISOString()
        };
        localStorage.setItem('workPermitSubmissions', JSON.stringify(allSubmissions));
        refreshSubmissions();
        setShowModal(false);
        alert('Submission rejected.');
      }
    }
  };

  const handleApprovePayment = (submission: WorkPermitSubmission) => {
    const stored = localStorage.getItem('workPermitSubmissions');
    if (stored) {
      const allSubmissions: WorkPermitSubmission[] = JSON.parse(stored);
      const index = allSubmissions.findIndex(s => s.id === submission.id);
      if (index !== -1) {
        allSubmissions[index] = {
          ...allSubmissions[index],
          status: 'completed',
          completedAt: new Date().toISOString()
        };
        localStorage.setItem('workPermitSubmissions', JSON.stringify(allSubmissions));
        refreshSubmissions();
        setShowModal(false);
        alert('Payment approved! Submission completed.');
      }
    }
  };

  const handleRejectPayment = (submission: WorkPermitSubmission, reason: string) => {
    const stored = localStorage.getItem('workPermitSubmissions');
    if (stored) {
      const allSubmissions: WorkPermitSubmission[] = JSON.parse(stored);
      const index = allSubmissions.findIndex(s => s.id === submission.id);
      if (index !== -1) {
        allSubmissions[index] = {
          ...allSubmissions[index],
          status: 'rejected',
          rejectionReason: reason,
          rejectedAt: new Date().toISOString()
        };
        localStorage.setItem('workPermitSubmissions', JSON.stringify(allSubmissions));
        refreshSubmissions();
        setShowModal(false);
        alert('Payment rejected.');
      }
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'pending_review':
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Review</Badge>;
      case 'form_approved':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Awaiting Payment</Badge>;
      case 'payment_submitted':
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Payment Review</Badge>;
      case 'completed':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with title and refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#224e4a]">Work Permit Applications</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total Submissions: {submissions.length} | Pending: {pendingSubmissions.length}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            refreshSubmissions();
            alert('Submissions refreshed!');
          }}
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, passport, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-1" />
              Today
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      <div className="bg-white border rounded-lg">
        <div className="flex border-b">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'pending' ? 'text-[#224e4a]' : 'text-gray-500'
            }`}
          >
            Pending Review
            {pendingSubmissions.length > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-white">{pendingSubmissions.length}</Badge>
            )}
            {selectedTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('approved')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'approved' ? 'text-[#224e4a]' : 'text-gray-500'
            }`}
          >
            Awaiting Payment
            {approvedSubmissions.length > 0 && (
              <Badge className="ml-2 bg-blue-500 text-white">{approvedSubmissions.length}</Badge>
            )}
            {selectedTab === 'approved' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('payment')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'payment' ? 'text-[#224e4a]' : 'text-gray-500'
            }`}
          >
            Payment Review
            {paymentSubmissions.length > 0 && (
              <Badge className="ml-2 bg-purple-500 text-white">{paymentSubmissions.length}</Badge>
            )}
            {selectedTab === 'payment' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors relative ${
              selectedTab === 'completed' ? 'text-[#224e4a]' : 'text-gray-500'
            }`}
          >
            Completed
            {selectedTab === 'completed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#224e4a]" />
            )}
          </button>
        </div>

        <div className="p-4 space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="font-semibold mb-2">No submissions found</h3>
              <p className="text-muted-foreground text-center">
                {searchQuery ? 'No submissions match your search' : `No ${selectedTab} submissions at the moment`}
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <Card key={submission.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">ID: {submission.id}</h3>
                        {getStatusBadge(submission.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {submission.fullName} • Position: {submission.jobPosition}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-[#224e4a]">฿{submission.serviceFee}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setShowModal(true);
                      }}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>

                    {submission.status === 'pending_review' && (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowModal(true);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowModal(true);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {submission.status === 'payment_submitted' && (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowModal(true);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve Payment
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowModal(true);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject Payment
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Work Permit Details</h2>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowModal(false);
                  setAdminNote('');
                }}>
                  ✕
                </Button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-muted-foreground">ID:</p>
                  <p className="font-medium">{selectedSubmission.id}</p>
                  
                  <p className="text-muted-foreground">Full Name:</p>
                  <p className="font-medium">{selectedSubmission.fullName}</p>
                  
                  <p className="text-muted-foreground">Father Name:</p>
                  <p className="font-medium">{selectedSubmission.fatherName}</p>
                  
                  <p className="text-muted-foreground">Nationality:</p>
                  <p className="font-medium">{selectedSubmission.nationality}</p>
                  
                  <p className="text-muted-foreground">NRC:</p>
                  <p className="font-medium">{selectedSubmission.nrcNumber}</p>
                  
                  <p className="text-muted-foreground">Passport:</p>
                  <p className="font-medium">{selectedSubmission.passportNumber}</p>
                  
                  <p className="text-muted-foreground">Date of Birth:</p>
                  <p className="font-medium">{selectedSubmission.dateOfBirth}</p>
                  
                  <p className="text-muted-foreground">Phone:</p>
                  <p className="font-medium">{selectedSubmission.phoneNumber}</p>
                  
                  <p className="text-muted-foreground">Email:</p>
                  <p className="font-medium">{selectedSubmission.email}</p>
                  
                  <p className="text-muted-foreground">Employer:</p>
                  <p className="font-medium">{selectedSubmission.employerName}</p>
                  
                  <p className="text-muted-foreground">Position:</p>
                  <p className="font-medium">{selectedSubmission.jobPosition}</p>
                  
                  <p className="text-muted-foreground">Service Fee:</p>
                  <p className="font-medium">฿{selectedSubmission.serviceFee}</p>
                  
                  <p className="text-muted-foreground">Status:</p>
                  <div>{getStatusBadge(selectedSubmission.status)}</div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Address:</p>
                  <p className="font-medium">{selectedSubmission.currentAddress}</p>
                </div>

                {selectedSubmission.paymentProof && (
                  <div>
                    <p className="text-sm font-medium mb-2">Payment Proof:</p>
                    <img src={selectedSubmission.paymentProof} alt="Payment proof" className="w-full max-w-md rounded-lg border" />
                  </div>
                )}
              </div>

              {selectedSubmission.status === 'pending_review' && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Admin Note (Optional)</Label>
                    <Textarea
                      placeholder="Add a note for the user..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveForm(selectedSubmission)}
                    >
                      Approve Form
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        const reason = prompt('Please provide rejection reason:');
                        if (reason) {
                          handleRejectForm(selectedSubmission, reason);
                        }
                      }}
                    >
                      Reject Form
                    </Button>
                  </div>
                </div>
              )}

              {selectedSubmission.status === 'payment_submitted' && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprovePayment(selectedSubmission)}
                    >
                      Approve Payment
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        const reason = prompt('Please provide rejection reason:');
                        if (reason) {
                          handleRejectPayment(selectedSubmission, reason);
                        }
                      }}
                    >
                      Reject Payment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}