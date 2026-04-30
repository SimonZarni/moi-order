import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { 
  MessageSquare, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Phone
} from 'lucide-react';

interface ReportsScreenProps {
  onBack: () => void;
}

interface Report {
  id: string;
  type: string;
  subject: string;
  description: string;
  status: 'pending' | 'reviewing' | 'resolved';
  date: string;
  orderId?: string;
}

const reportTypes = [
  { value: 'order-issue', label: 'Order Issue' },
  { value: 'delivery-problem', label: 'Delivery Problem' },
  { value: 'food-quality', label: 'Food Quality' },
  { value: 'app-bug', label: 'App Bug' },
  { value: 'payment-issue', label: 'Payment Issue' },
  { value: 'restaurant-complaint', label: 'Restaurant Complaint' },
  { value: 'other', label: 'Other' }
];

const mockReports: Report[] = [
  {
    id: 'RPT-001',
    type: 'delivery-problem',
    subject: 'Late delivery',
    description: 'Order was delivered 45 minutes late',
    status: 'resolved',
    date: '2024-01-15',
    orderId: '#1243'
  },
  {
    id: 'RPT-002',
    type: 'food-quality',
    subject: 'Cold food',
    description: 'Pizza arrived cold and cheese was hardened',
    status: 'reviewing',
    date: '2024-01-12',
    orderId: '#1240'
  }
];

export function ReportsScreen({ onBack }: ReportsScreenProps) {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [newReport, setNewReport] = useState({
    type: '',
    subject: '',
    description: '',
    orderId: ''
  });

  const handleSubmitReport = async () => {
    if (!newReport.type || !newReport.subject || !newReport.description) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const report: Report = {
        id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
        type: newReport.type,
        subject: newReport.subject,
        description: newReport.description,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        orderId: newReport.orderId || undefined
      };
      
      setReports([report, ...reports]);
      setNewReport({ type: '', subject: '', description: '', orderId: '' });
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewing': return <FileText className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Support & Reports</h2>
          <p className="text-muted-foreground">We're here to help resolve any issues</p>
        </div>

        {/* Emergency Contact */}
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Emergency Support</p>
              <p className="text-sm text-red-700">Call +1 (555) 911-FOOD for urgent issues</p>
            </div>
          </div>
        </Card>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your report has been submitted successfully. We'll review it within 24 hours.
            </AlertDescription>
          </Alert>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'submit' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('submit')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Submit Report
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('history')}
          >
            <FileText className="w-4 h-4 mr-2" />
            My Reports
          </Button>
        </div>

        {activeTab === 'submit' ? (
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-type">Report Type</Label>
                <Select
                  value={newReport.type}
                  onValueChange={(value) => setNewReport({ ...newReport, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="order-id">Order ID (Optional)</Label>
                <Input
                  id="order-id"
                  placeholder="e.g., #1245"
                  value={newReport.orderId}
                  onChange={(e) => setNewReport({ ...newReport, orderId: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of the issue"
                  value={newReport.subject}
                  onChange={(e) => setNewReport({ ...newReport, subject: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about the issue..."
                  rows={4}
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                />
              </div>

              <Button
                onClick={handleSubmitReport}
                disabled={isSubmitting || !newReport.type || !newReport.subject || !newReport.description}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Your Reports</h3>
              <Badge variant="secondary">{reports.length} total</Badge>
            </div>

            {reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map((report) => (
                  <Card key={report.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{report.subject}</h4>
                        {report.orderId && (
                          <Badge variant="outline" className="text-xs">
                            {report.orderId}
                          </Badge>
                        )}
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(report.status)}
                          <span className="capitalize">{report.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {report.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>ID: {report.id}</span>
                      <span>Submitted: {report.date}</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">No reports submitted yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setActiveTab('submit')}
                >
                  Submit Your First Report
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}