import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { type KycApplication, type KycDocumentType, merchantsApi } from 'src/api/merchants';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type StatusColor = 'success' | 'warning' | 'info' | 'error' | 'default';

const STATUS_COLOR: Record<string, StatusColor> = {
  submitted:    'warning',
  under_review: 'info',
  approved:     'success',
  rejected:     'error',
  draft:        'default',
};

const DOCUMENT_TYPES: { type: KycDocumentType; label: string }[] = [
  { type: 'national_id',           label: 'National ID' },
  { type: 'business_registration', label: 'Business Registration' },
  { type: 'bank_book',             label: 'Bank Book' },
  { type: 'storefront_photo',      label: 'Storefront Photo' },
];

const isPdf = (url: string) => url.toLowerCase().includes('.pdf');

// ----------------------------------------------------------------------

export function KycDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [application, setApplication] = useState<KycApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    merchantsApi
      .getKycApplication(id)
      .then(setApplication)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = useCallback(() => {
    if (!id) return;
    setActionLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    merchantsApi
      .reviewKycApplication(id, 'approve')
      .then((updated) => {
        setApplication(updated);
        setSuccessMsg('Application approved successfully.');
      })
      .catch(() => setErrorMsg('Failed to approve application. Please try again.'))
      .finally(() => setActionLoading(false));
  }, [id]);

  const handleRejectSubmit = useCallback(() => {
    if (!id) return;
    setActionLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    merchantsApi
      .reviewKycApplication(id, 'reject', rejectNotes.trim() || undefined)
      .then((updated) => {
        setApplication(updated);
        setSuccessMsg('Application rejected.');
        setRejectDialogOpen(false);
        setRejectNotes('');
      })
      .catch(() => setErrorMsg('Failed to reject application. Please try again.'))
      .finally(() => setActionLoading(false));
  }, [id, rejectNotes]);

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!application) {
    return (
      <DashboardContent>
        <Typography color="error">Application not found.</Typography>
      </DashboardContent>
    );
  }

  const canReview = application.status === 'submitted' || application.status === 'under_review';

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          size="small"
          startIcon={
            <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
          }
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          KYC Review — {application.business_name}
        </Typography>
        <Label color={STATUS_COLOR[application.status] ?? 'default'}>
          {application.status_label}
        </Label>
      </Box>

      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

      <Grid container spacing={3}>
        {/* Left: Applicant Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Applicant Information" />
              <CardContent>
                <Stack spacing={1.5}>
                  <InfoRow label="Full Name"       value={application.user_name} />
                  <InfoRow label="Email"           value={application.user_email} />
                  <InfoRow label="Phone"           value={application.user_phone ?? '—'} />
                  <Divider />
                  <InfoRow label="Business Name"    value={application.business_name} />
                  <InfoRow label="Business Type"    value={application.business_type} />
                  <InfoRow label="Business Address" value={application.business_address} />
                  {application.business_phone && (
                    <InfoRow label="Business Phone" value={application.business_phone} />
                  )}
                  <Divider />
                  <InfoRow
                    label="Submitted"
                    value={application.submitted_at ? fDate(application.submitted_at) : '—'}
                  />
                  {application.reviewed_at && (
                    <InfoRow label="Reviewed" value={fDate(application.reviewed_at)} />
                  )}
                  {application.review_notes && (
                    <InfoRow label="Review Notes" value={application.review_notes} />
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader title="KYC Documents" />
              <CardContent>
                <Grid container spacing={2}>
                  {DOCUMENT_TYPES.map(({ type, label }) => {
                    const doc = application.documents.find((d) => d.type === type);
                    return (
                      <Grid key={type} size={{ xs: 12, sm: 6 }}>
                        <Box
                          sx={{
                            border: '1px solid',
                            borderColor: doc ? 'divider' : 'grey.200',
                            borderRadius: 1.5,
                            p: 2,
                            bgcolor: doc ? 'background.paper' : 'grey.50',
                            minHeight: 140,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                          }}
                        >
                          <Typography variant="subtitle2" color={doc ? 'text.primary' : 'text.disabled'}>
                            {label}
                          </Typography>
                          {doc ? (
                            <>
                              {isPdf(doc.url) ? (
                                <Box
                                  sx={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'grey.100',
                                    borderRadius: 1,
                                  }}
                                >
                                  <Iconify icon="solar:eye-bold" width={32} sx={{ color: 'text.secondary' }} />
                                </Box>
                              ) : (
                                <Box
                                  component="img"
                                  src={doc.url}
                                  alt={label}
                                  sx={{
                                    width: '100%',
                                    height: 90,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                  }}
                                />
                              )}
                              <Button
                                size="small"
                                variant="outlined"
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<Iconify icon="solar:eye-bold" width={14} />}
                              >
                                View Document
                              </Button>
                            </>
                          ) : (
                            <Box
                              sx={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography variant="body2" color="text.disabled">
                                Not uploaded
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right: Review Actions */}
        <Grid size={{ xs: 12, md: 5 }}>
          {canReview && (
            <Card>
              <CardHeader title="Review Actions" />
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Review this application and approve or reject the merchant&apos;s KYC submission.
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled={actionLoading}
                    onClick={handleApprove}
                    startIcon={
                      actionLoading
                        ? <CircularProgress size={16} color="inherit" />
                        : <Iconify icon="solar:check-circle-bold" />
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    disabled={actionLoading}
                    onClick={() => setRejectDialogOpen(true)}
                    startIcon={<Iconify icon="mingcute:close-line" />}
                  >
                    Reject
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Application</DialogTitle>
        <DialogContent>
          <TextField
            label="Rejection Notes (optional)"
            multiline
            rows={4}
            fullWidth
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            placeholder="Explain the reason for rejection…"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRejectSubmit}
            disabled={actionLoading}
            startIcon={
              actionLoading
                ? <CircularProgress size={14} color="inherit" />
                : <Iconify icon="mingcute:close-line" />
            }
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}
