import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { submissionsApi, type SubmissionStatus, type SubmissionDetailData } from 'src/api/submissions';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STATUS_COLORS: Record<SubmissionStatus, 'warning' | 'success' | 'error'> = {
  pending_payment: 'warning',
  processing: 'warning',
  completed: 'success',
  payment_failed: 'error',
  cancelled: 'error',
};

const WRITABLE_STATUSES: Partial<Record<SubmissionStatus, { value: SubmissionStatus; label: string }[]>> = {
  pending_payment: [{ value: 'cancelled', label: 'Cancelled' }],
  processing: [
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ],
};

// ----------------------------------------------------------------------

export function SubmissionDetailView() {
  const { id } = useParams();
  const router = useRouter();

  const [submission, setSubmission] = useState<SubmissionDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SubmissionStatus>('processing');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    submissionsApi
      .get(id)
      .then((data) => {
        setSubmission(data);
        const opts = WRITABLE_STATUSES[data.status as SubmissionStatus];
        setStatus(opts?.[0]?.value ?? (data.status as SubmissionStatus));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveStatus = () => {
    if (!id) return;
    setSaving(true);
    submissionsApi.updateStatus(id, status).then(() => {
      if (submission) setSubmission({ ...submission, status });
    }).catch(() => {}).finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!submission) {
    return (
      <DashboardContent>
        <Alert severity="error">Submission not found.</Alert>
      </DashboardContent>
    );
  }

  const serviceName = submission.service_type?.service?.name ?? submission.service_type?.name ?? '—';
  const userName = submission.user?.name ?? '—';
  const userEmail = submission.user?.email ?? '';

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.push('/services/submissions')}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Submission #{id}</Typography>
          <Typography variant="body2" color="text.secondary">
            {serviceName} · {userName}
          </Typography>
        </Box>
        <Label color={STATUS_COLORS[status] ?? 'warning'} sx={{ fontSize: 14, px: 2, py: 1 }}>
          {status}
        </Label>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Submission Info" />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">{userName}</Typography>
                  <Typography variant="body2" color="text.secondary">{userEmail}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  {[
                    ['Service', serviceName],
                    ['Service Type', submission.service_type?.name ?? '—'],
                    ['Submitted', fDate(submission.created_at)],
                    ['Completed', submission.completed_at ? fDate(submission.completed_at) : '—'],
                    ['Price', submission.price_snapshot !== null ? `${(submission.price_snapshot / 100).toFixed(2)}` : '—'],
                  ].map(([label, value]) => (
                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{label}</Typography>
                      <Typography variant="body2" fontWeight={500}>{value}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {submission.submission_data && Object.keys(submission.submission_data).length > 0 && (
              <Card>
                <CardHeader title="Form Data" />
                <CardContent>
                  <Stack spacing={1.5}>
                    {Object.entries(submission.submission_data).map(([key, value]) => {
                      const isUrl = typeof value === 'string' && value.startsWith('http');
                      return (
                        <Box key={key}>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize', display: 'block', mb: 0.5 }}>
                            {key.replace(/_/g, ' ')}
                          </Typography>
                          {isUrl ? (
                            <Box
                              component="a"
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ display: 'inline-block', borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider', '&:hover': { opacity: 0.85 } }}
                            >
                              <Box
                                component="img"
                                src={value}
                                alt={key}
                                sx={{ display: 'block', width: 120, height: 90, objectFit: 'cover' }}
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                  const img = e.currentTarget;
                                  img.style.display = 'none';
                                  if (img.parentElement) {
                                    img.parentElement.innerHTML = `<span style="display:flex;align-items:center;justify-content:center;width:120px;height:90px;font-size:11px;color:#888;padding:4px;word-break:break-all;text-align:center;">View File</span>`;
                                  }
                                }}
                              />
                            </Box>
                          ) : (
                            <Typography variant="body2" fontWeight={500}>{value}</Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader title="Update Status" />
              <CardContent>
                {WRITABLE_STATUSES[submission.status as SubmissionStatus] ? (
                  <>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value as SubmissionStatus)}>
                        {(WRITABLE_STATUSES[submission.status as SubmissionStatus] ?? []).map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveStatus} disabled={saving}>
                      Save Status
                    </Button>
                  </>
                ) : (
                  <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 1 }}>
                    This submission cannot be updated.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          {submission.documents.length > 0 && (
            <Card>
              <CardHeader title={`Documents (${submission.documents.length})`} />
              <CardContent>
                <Grid container spacing={2}>
                  {submission.documents.map((doc) => (
                    <Grid key={doc.id} size={{ xs: 6, sm: 4 }}>
                      <Box
                        sx={{
                          position: 'relative',
                          borderRadius: 1.5,
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover .doc-overlay': { opacity: 1 },
                        }}
                      >
                        <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.neutral' }}>
                          <Box
                            component="img"
                            src={doc.signed_url}
                            alt={doc.label}
                            sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <Iconify icon="solar:eye-bold" width={32} sx={{ color: 'text.disabled', position: 'absolute' }} />
                        </Box>
                        <Box className="doc-overlay" sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0, transition: 'opacity 0.2s' }}>
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                              onClick={() => {
                                const a = document.createElement('a');
                                a.href = doc.signed_url;
                                a.download = doc.label;
                                a.target = '_blank';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                              }}
                            >
                              <Iconify icon="eva:arrow-ios-downward-fill" width={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
                          <Typography variant="caption" noWrap display="block">{doc.label}</Typography>
                          <Typography variant="caption" color="text.disabled">{doc.document_type}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {submission.documents.length === 0 && (
            <Card>
              <CardContent>
                <Box sx={{ py: 4, textAlign: 'center', color: 'text.disabled' }}>
                  <Iconify icon="solar:eye-bold" width={40} sx={{ mb: 1, opacity: 0.3 }} />
                  <Typography variant="body2">No documents uploaded for this submission.</Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
