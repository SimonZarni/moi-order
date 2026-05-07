import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

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
import { fCurrency } from 'src/utils/format-number';

import { paymentsApi } from 'src/api/payments';
import { useAuth } from 'src/context/auth-context';
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
  const { hasPermission } = useAuth();
  const canManage = hasPermission('submissions.manage');
  const canManagePayments = hasPermission('payments.manage');

  const [submission, setSubmission] = useState<SubmissionDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SubmissionStatus>('processing');
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [confirmingOrder, setConfirmingOrder] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [countdownLabel, setCountdownLabel] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [regenerating, setRegenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firedRef = useRef(false);

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

  const handleRegenerateQr = async () => {
    if (!submission?.payment?.id) return;
    setRegenerating(true);
    try {
      await paymentsApi.regenerate(submission.payment.id);
      if (id) {
        const data = await submissionsApi.get(id);
        setSubmission(data);
        const opts = WRITABLE_STATUSES[data.status as SubmissionStatus];
        setStatus(opts?.[0]?.value ?? (data.status as SubmissionStatus));
      }
    } catch (_e) {
      // ignore — regeneration errors are silent; user can retry manually
    } finally { setRegenerating(false); }
  };

  // Live countdown — resets when the embedded payment's expires_at changes.
  useEffect(() => {
    const expiresAt = submission?.payment?.expires_at;
    if (!expiresAt || submission?.payment?.status !== 'pending') {
      setCountdownLabel('');
      return undefined;
    }

    firedRef.current = false;

    const tick = () => {
      const secs = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(secs);
      const mm = Math.floor(secs / 60);
      const ss = secs % 60;
      setCountdownLabel(`${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`);
      if (secs === 0 && !firedRef.current) {
        firedRef.current = true;
        handleRegenerateQr();
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submission?.payment?.expires_at, submission?.payment?.status]);

  const handleSaveStatus = () => {
    if (!id) return;
    setSaving(true);
    submissionsApi.updateStatus(id, status).then(() => {
      if (submission) setSubmission({ ...submission, status });
    }).catch(() => {}).finally(() => setSaving(false));
  };

  const handleUploadResult = () => {
    if (!id || !selectedFile) return;
    setUploading(true);
    setUploadError('');
    submissionsApi
      .uploadResultFile(id, selectedFile)
      .then((data) => {
        setSubmission(data);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      })
      .catch(() => setUploadError('Upload failed. Please try again.'))
      .finally(() => setUploading(false));
  };

  const handleDownloadResult = () => {
    if (!id) return;
    submissionsApi.downloadResultFile(id).then(({ blob, contentType }) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `result-${id}`;
      a.click();
      URL.revokeObjectURL(url);
    }).catch(() => {});
  };

  const handleViewResult = () => {
    if (!id) return;
    submissionsApi.downloadResultFile(id).then(({ blob, contentType }) => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }).catch(() => {});
  };

  const handleConfirmOrder = () => {
    if (!id) return;
    setConfirmingOrder(true);
    submissionsApi
      .confirmPayment(id)
      .then((updated) => setSubmission((prev) => prev ? { ...prev, ...updated } : prev))
      .catch(() => {})
      .finally(() => setConfirmingOrder(false));
  };

  const handleConfirmPayment = () => {
    if (!submission?.payment?.id) return;
    setConfirming(true);
    setConfirmError('');
    paymentsApi
      .confirm(submission.payment.id)
      .then(() => {
        if (id) submissionsApi.get(id).then((data) => {
          setSubmission(data);
          const opts = WRITABLE_STATUSES[data.status as SubmissionStatus];
          setStatus(opts?.[0]?.value ?? (data.status as SubmissionStatus));
        }).catch(() => {});
      })
      .catch(() => setConfirmError('Could not confirm payment. Try again.'))
      .finally(() => setConfirming(false));
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

  const serviceName =
    submission.service_type?.service?.name_mm ||
    submission.service_type?.service?.name_en ||
    submission.service_type?.service?.name ||
    '—';
  const userName = submission.user?.name ?? '—';
  const userEmail = submission.user?.email ?? '';

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.back()}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Submission #{id}</Typography>
          <Typography variant="body2" color="text.secondary">
            {serviceName} · {userName}
          </Typography>
        </Box>
        <Label color={STATUS_COLORS[submission.status as SubmissionStatus] ?? 'warning'} sx={{ fontSize: 14, px: 2, py: 1 }}>
          {submission.status}
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
                    ['Service Type', submission.service_type?.name_mm || submission.service_type?.name_en || submission.service_type?.name || '—'],
                    ['Submitted', fDate(submission.created_at)],
                    ['Completed', submission.completed_at ? fDate(submission.completed_at) : '—'],
                    ['Price', submission.price_snapshot !== null ? `${submission.price_snapshot.toLocaleString()} THB` : '—'],
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

            {canManage && (
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
            )}

            {/* Result File */}
            {(submission.status === 'processing' || submission.status === 'completed') && (
              <Card>
                <CardHeader
                  title="Result File"
                  action={submission.has_result && (
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, px: 1 }}>
                      Uploaded
                    </Typography>
                  )}
                />
                <CardContent>
                  {canManage && (submission.status === 'processing' || submission.status === 'completed') && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf,image/jpeg,image/jpg,image/png"
                        style={{ display: 'none' }}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                      />
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Iconify icon="mingcute:add-line" width={16} />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ mb: 1 }}
                      >
                        {selectedFile ? selectedFile.name : 'Select PDF or Image'}
                      </Button>
                      {uploadError && <Alert severity="error" sx={{ mb: 1, py: 0.5 }}>{uploadError}</Alert>}
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={!selectedFile || uploading}
                        onClick={handleUploadResult}
                        startIcon={uploading ? <CircularProgress size={14} color="inherit" /> : <Iconify icon="eva:arrow-ios-upward-fill" width={16} />}
                      >
                        {uploading ? 'Uploading…' : 'Upload Result'}
                      </Button>
                    </>
                  )}
                  {submission.has_result && (
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Iconify icon="solar:eye-bold" width={16} />}
                        onClick={handleViewResult}
                      >
                        View
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={16} />}
                        onClick={handleDownloadResult}
                      >
                        Download
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Order Confirmation (when auto-payment is OFF) */}
            {submission.status === 'pending_payment' && canManage && (
              <Card>
                <CardHeader title="Order Confirmation Required" />
                <CardContent>
                  {submission.payment_authorized ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="solar:check-circle-bold" width={20} color="success.main" />
                      <Typography variant="body2" color="success.main" fontWeight={600}>
                        Order Confirmed
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Auto-payment is disabled. The customer cannot pay until you confirm this order.
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={confirmingOrder}
                        onClick={handleConfirmOrder}
                        startIcon={confirmingOrder ? <CircularProgress size={14} color="inherit" /> : <Iconify icon="solar:check-circle-bold" width={16} />}
                      >
                        {confirmingOrder ? 'Confirming…' : 'Confirm Order for Payment'}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Payment */}
            {submission.payment && (
              <Card>
                <CardHeader title="Payment" />
                <CardContent>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Label color={submission.payment.status === 'succeeded' ? 'success' : submission.payment.status === 'pending' ? 'warning' : 'error'}>
                        {submission.payment.status_label}
                      </Label>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Amount</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {fCurrency(submission.payment.amount / 100)}
                      </Typography>
                    </Box>
                    {submission.payment.expires_at && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Expires</Typography>
                        <Typography variant="body2" fontWeight={500}>{fDate(submission.payment.expires_at)}</Typography>
                      </Box>
                    )}
                  </Stack>

                  {submission.payment.status === 'pending' && submission.payment.qr_image_url && (() => {
                    const isExpired = submission.payment.expires_at !== null &&
                      new Date(submission.payment.expires_at) < new Date();
                    return (
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            PromptPay QR Code
                          </Typography>
                          {isExpired && (
                            <Button
                              size="small"
                              variant="contained"
                              color="warning"
                              disabled={regenerating}
                              onClick={handleRegenerateQr}
                              startIcon={
                                regenerating
                                  ? <CircularProgress size={12} color="inherit" />
                                  : <Iconify icon="solar:restart-bold" width={14} />
                              }
                            >
                              {regenerating ? 'Generating…' : 'Regenerate QR'}
                            </Button>
                          )}
                        </Box>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                          <Box
                            component="img"
                            src={submission.payment.qr_image_url}
                            alt="Payment QR"
                            sx={{
                              width: 180, height: 180, objectFit: 'contain',
                              border: '1px solid', borderColor: 'divider', borderRadius: 1,
                              opacity: isExpired ? 0.25 : 1,
                              filter: isExpired ? 'grayscale(1)' : 'none',
                              transition: 'opacity 0.2s, filter 0.2s',
                            }}
                          />
                          {isExpired && (
                            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Label color="error" sx={{ fontSize: 12, px: 1.5, py: 0.5 }}>Expired</Label>
                            </Box>
                          )}
                        </Box>
                        {!isExpired && countdownLabel !== '' && (
                          <Typography
                            variant="caption"
                            display="block"
                            fontWeight={600}
                            sx={{ mt: 0.5, color: secondsLeft <= 60 ? 'error.main' : secondsLeft <= 120 ? 'warning.main' : 'text.secondary' }}
                          >
                            Expires in: {countdownLabel}
                          </Typography>
                        )}
                        {isExpired && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            QR code expired. Generating a new one…
                          </Typography>
                        )}
                      </Box>
                    );
                  })()}

                  {canManagePayments && submission.payment.status === 'pending' && (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      {confirmError && <Alert severity="error" sx={{ py: 0.5 }}>{confirmError}</Alert>}
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        disabled={confirming}
                        onClick={handleConfirmPayment}
                        startIcon={confirming ? <CircularProgress size={14} color="inherit" /> : <Iconify icon="solar:check-circle-bold" width={16} />}
                      >
                        {confirming ? 'Confirming…' : 'Mark as Paid'}
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          {(submission.documents ?? []).length > 0 && (
            <Card>
              <CardHeader title={`Documents (${(submission.documents ?? []).length})`} />
              <CardContent>
                <Grid container spacing={2}>
                  {(submission.documents ?? []).map((doc) => (
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

          {(submission.documents ?? []).length === 0 && (
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
