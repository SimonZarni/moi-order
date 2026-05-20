import { useParams } from 'react-router-dom';
import { useRef, useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import { useAuth } from 'src/context/auth-context';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { TBCompanyFormDialog } from './tb-company-form-dialog';
import {
  tbStore,
  STATUS_BG,
  STATUS_TEXT,
  STATUS_COLORS,
  STATUS_LABELS,
  updateCompany,
  addCompanyDocument,
  DOCUMENT_CATEGORIES,
  removeCompanyDocument,
  replaceCompanyDocument,
  DOCUMENT_CATEGORY_LABELS,
} from '../../shared/tb-mock-store';

import type { TBClient, StatusLevel, CompanyDocumentCategory } from '../../shared/tb-mock-store';

// Accepted file formats: images (incl. HEIC/HEIF from iOS), PDF, Word docs
const ACCEPT_ALL = 'image/*,.heic,.heif,.pdf,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const genId = () => `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

// ----------------------------------------------------------------------

function StatusChip({ label, level }: { label: string; level: StatusLevel }) {
  return (
    <Chip
      size="small"
      label={`${label}: ${STATUS_LABELS[level]}`}
      sx={{
        height: 24, fontSize: 12, fontWeight: 600,
        bgcolor: STATUS_BG[level], color: STATUS_TEXT[level],
        border: `1px solid ${STATUS_COLORS[level]}40`,
      }}
    />
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="overline" color="text.disabled" sx={{ display: 'block', mb: 2, letterSpacing: 1 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ color: valueColor }}>{value}</Typography>
    </Stack>
  );
}

function DirectorVisaStatus(director: TBClient['directors'][number]): StatusLevel | null {
  if (!director.visaExpiry) return null;
  const daysLeft = Math.ceil((new Date(director.visaExpiry).getTime() - Date.now()) / 86_400_000);
  if (daysLeft < 0) return 'critical';
  if (daysLeft <= 60) return 'warning';
  return 'good';
}

// File type icon helper
function docIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'].includes(ext)) return 'solar:gallery-bold';
  if (ext === 'pdf') return 'eva:done-all-fill';
  return 'solar:check-circle-bold';
}

// ----------------------------------------------------------------------

export function TBClientDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isSuperAdmin } = useAuth();
  const canEdit = isSuperAdmin();

  // version counter forces re-read from store after mutations
  const [version, setVersion] = useState(0);
  const company = useMemo(
    () => tbStore.clients.find((c) => c.id === id) ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, version]
  );

  const [editOpen, setEditOpen] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  // ── Document management state ─────────────────────────────────────────
  const [addDocOpen, setAddDocOpen] = useState(false);
  const [addDocCategory, setAddDocCategory] = useState<CompanyDocumentCategory>('company_certificate');
  const [addDocFileName, setAddDocFileName] = useState('');
  const addDocInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingDocId, setReplacingDocId] = useState<string | null>(null);
  const [viewingDoc, setViewingDoc] = useState<TBClient['documents'][number] | null>(null);

  // ── Handlers ─────────────────────────────────────────────────────────

  const handleEditSubmit = useCallback(
    (data: Omit<TBClient, 'id' | 'history' | 'dbdUrl'>) => {
      if (!id) return;
      updateCompany(id, data);
      setVersion((v) => v + 1);
      setEditOpen(false);
      setNotification({ msg: 'Company updated successfully.', severity: 'success' });
    },
    [id]
  );

  const handleAddDocPickFile = useCallback(() => {
    addDocInputRef.current?.click();
  }, []);

  const handleAddDocFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAddDocFileName(file.name);
    e.target.value = '';
  }, []);

  const handleAddDocConfirm = useCallback(() => {
    if (!id || !addDocFileName) return;
    addCompanyDocument(id, {
      id: genId(),
      category: addDocCategory,
      fileName: addDocFileName,
      uploadedAt: new Date().toISOString(),
    });
    setVersion((v) => v + 1);
    setAddDocOpen(false);
    setAddDocFileName('');
    setNotification({ msg: 'Document added.', severity: 'success' });
  }, [id, addDocCategory, addDocFileName]);

  const handleReplaceDoc = useCallback((docId: string) => {
    setReplacingDocId(docId);
    replaceInputRef.current?.click();
  }, []);

  const handleReplaceFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && id && replacingDocId) {
        replaceCompanyDocument(id, replacingDocId, file.name);
        setVersion((v) => v + 1);
        setNotification({ msg: 'Document replaced.', severity: 'success' });
      }
      setReplacingDocId(null);
      e.target.value = '';
    },
    [id, replacingDocId]
  );

  const handleDeleteDoc = useCallback(
    (docId: string) => {
      if (!id) return;
      removeCompanyDocument(id, docId);
      setVersion((v) => v + 1);
      setNotification({ msg: 'Document removed.', severity: 'success' });
    },
    [id]
  );

  // ── Early returns ─────────────────────────────────────────────────────

  if (!company) {
    return (
      <DashboardContent maxWidth="xl">
        <Stack alignItems="center" justifyContent="center" sx={{ py: 12 }}>
          <Typography variant="h5" color="text.secondary">Company not found.</Typography>
          <Button sx={{ mt: 2 }} onClick={() => router.push('/tb/clients')}>Back to Companies</Button>
        </Stack>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      {/* Hidden file inputs */}
      <input ref={addDocInputRef} type="file" accept={ACCEPT_ALL} hidden onChange={handleAddDocFileChange} />
      <input ref={replaceInputRef} type="file" accept={ACCEPT_ALL} hidden onChange={handleReplaceFileChange} />

      {/* Back nav */}
      <Button
        color="inherit"
        onClick={() => router.push('/tb/clients')}
        startIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ transform: 'rotate(180deg)' }} />}
        sx={{ mb: 2, ml: -1, alignSelf: 'flex-start' }}
      >
        Companies Overview
      </Button>

      {/* Page header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'flex-start' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>{company.companyName}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', mb: 1.5 }}>
            {company.thaiRegNumber}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <StatusChip label="Tax" level={company.taxStatus} />
            <StatusChip label="Company" level={company.companyStatus} />
            <StatusChip label="Director Visa" level={company.directorVisaStatus} />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          {canEdit && (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:pen-bold" width={16} />}
              onClick={() => setEditOpen(true)}
            >
              Edit Company
            </Button>
          )}
          <Link href={company.dbdUrl} target="_blank" rel="noopener noreferrer" underline="none">
            <Button variant="outlined" size="small" startIcon={<Iconify icon="solar:share-bold" width={16} />}>
              DBD Portal
            </Button>
          </Link>
        </Stack>
      </Stack>

      <Grid container spacing={3}>

        {/* ── Left column ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>

            <SectionCard title="Company Information">
              <Stack divider={<Divider />}>
                <InfoRow label="Registration Date" value={fDate(company.registrationDate)} />
                <InfoRow
                  label="Registered Capital"
                  value={company.registeredCapital != null ? `฿${fNumber(company.registeredCapital)}` : '—'}
                />
                <InfoRow label="VAT Registered" value={company.vatRegistered ? 'Yes' : 'No'} valueColor={company.vatRegistered ? '#10B981' : undefined} />
                <InfoRow label="Monthly Accounting" value={company.monthlyAccounting ? 'Active' : 'Inactive'} valueColor={company.monthlyAccounting ? '#10B981' : undefined} />
                <InfoRow label="DBD Portal" value={<Link href={company.dbdUrl} target="_blank" rel="noopener noreferrer" variant="body2">Open DBD ↗</Link>} />
              </Stack>
              {company.notes && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.neutral', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">{company.notes}</Typography>
                </Box>
              )}
            </SectionCard>

            <SectionCard title="Client Details">
              <Stack divider={<Divider />}>
                <InfoRow label="Client Name" value={company.clientName} />
                <InfoRow label="Phone" value={company.clientPhone} />
              </Stack>
            </SectionCard>

            <SectionCard title="Client App Access">
              {company.clientAppAccess ? (
                <Stack divider={<Divider />}>
                  <InfoRow label="Access Status" value="Enabled" valueColor="#10B981" />
                  {company.clientEmail && <InfoRow label="Login Email" value={company.clientEmail} />}
                  <InfoRow label="Password" value={company.clientPasswordSet ? '••••••••' : 'Not set'} valueColor={company.clientPasswordSet ? undefined : '#EF4444'} />
                </Stack>
              ) : (
                <Typography variant="body2" color="text.disabled">Client app access not enabled.</Typography>
              )}
            </SectionCard>

          </Stack>
        </Grid>

        {/* ── Right column ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>

            {/* Directors */}
            <SectionCard title={`Directors (${company.directors.length})`}>
              {company.directors.length === 0 && (
                <Typography variant="body2" color="text.disabled">No directors on record.</Typography>
              )}
              <Stack spacing={2}>
                {company.directors.map((director) => {
                  const visaStatus = DirectorVisaStatus(director);
                  const hasVisa = !!(director.visaType || director.visaExpiry);
                  return (
                    <Paper key={director.id} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="body2" fontWeight="fontWeightSemiBold">{director.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {[director.position, director.nationality].filter(Boolean).join(' · ')}
                          </Typography>
                        </Box>
                        {visaStatus && (
                          <Chip size="small" label={STATUS_LABELS[visaStatus]}
                            sx={{ height: 20, fontSize: 10, bgcolor: STATUS_BG[visaStatus], color: STATUS_TEXT[visaStatus] }}
                          />
                        )}
                      </Stack>
                      {hasVisa && (
                        <Stack direction="row" spacing={3} sx={{ mt: 1.5 }} flexWrap="wrap">
                          {director.visaType && (
                            <Box>
                              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Visa Type</Typography>
                              <Typography variant="caption" fontWeight="fontWeightMedium">{director.visaType}</Typography>
                            </Box>
                          )}
                          {director.visaExpiry && (
                            <Box>
                              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Expiry</Typography>
                              <Typography variant="caption" fontWeight="fontWeightMedium" sx={{ color: visaStatus ? STATUS_COLORS[visaStatus] : 'text.primary' }}>
                                {fDate(director.visaExpiry)}
                              </Typography>
                            </Box>
                          )}
                          {director.workPermit !== undefined && (
                            <Box>
                              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Work Permit</Typography>
                              <Typography variant="caption" fontWeight="fontWeightMedium" sx={{ color: director.workPermit ? '#10B981' : '#EF4444' }}>
                                {director.workPermit ? 'Yes' : 'No'}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            </SectionCard>

            {/* Documents */}
            <SectionCard title={`Documents (${company.documents.length})`}>
              {canEdit && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon="mingcute:add-line" width={14} />}
                  onClick={() => { setAddDocFileName(''); setAddDocOpen(true); }}
                  sx={{ mb: 2 }}
                >
                  Add Document
                </Button>
              )}

              {company.documents.length === 0 && (
                <Typography variant="body2" color="text.disabled">No documents uploaded.</Typography>
              )}

              <Stack spacing={1.5}>
                {company.documents.map((doc) => (
                  <Stack key={doc.id} direction="row" alignItems="center" justifyContent="space-between">
                    <Stack
                      direction="row" spacing={1.5} alignItems="center"
                      sx={{ minWidth: 0, cursor: 'pointer', flex: 1 }}
                      onClick={() => setViewingDoc(doc)}
                    >
                      <Iconify icon={docIcon(doc.fileName)} width={18} sx={{ color: '#10B981', flexShrink: 0 }} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {DOCUMENT_CATEGORY_LABELS[doc.category]}
                        </Typography>
                        <Typography variant="body2" noWrap>{doc.fileName}</Typography>
                        <Typography variant="caption" color="text.disabled">{fDate(doc.uploadedAt)}</Typography>
                      </Box>
                    </Stack>

                    {canEdit && (
                      <Stack direction="row" spacing={0} sx={{ flexShrink: 0, ml: 1 }}>
                        <Tooltip title="View">
                          <IconButton size="small" onClick={() => setViewingDoc(doc)}>
                            <Iconify icon="solar:eye-bold" width={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Replace">
                          <IconButton size="small" onClick={() => handleReplaceDoc(doc.id)}>
                            <Iconify icon="solar:pen-bold" width={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDeleteDoc(doc.id)} sx={{ color: 'error.main' }}>
                            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </Stack>
                ))}
              </Stack>
            </SectionCard>

          </Stack>
        </Grid>

        {/* ── Full-width History ── */}
        <Grid size={{ xs: 12 }}>
          <SectionCard title="History">
            {company.history.length === 0 && (
              <Typography variant="body2" color="text.disabled">No history recorded.</Typography>
            )}
            <Stack spacing={0}>
              {company.history.map((entry, idx) => (
                <Stack key={entry.id} direction="row" spacing={2} alignItems="flex-start">
                  <Stack alignItems="center" sx={{ flexShrink: 0, width: 16 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981', mt: 0.4 }} />
                    {idx < company.history.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', minHeight: 28 }} />}
                  </Stack>
                  <Box sx={{ pb: 2, minWidth: 0 }}>
                    <Typography variant="body2">{entry.action}</Typography>
                    <Typography variant="caption" color="text.disabled">{fDate(entry.date)} · {entry.by}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

      </Grid>

      {/* Edit company dialog */}
      <TBCompanyFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        editCompany={company}
      />

      {/* Add document dialog */}
      <Dialog open={addDocOpen} onClose={() => setAddDocOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Document</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category *</InputLabel>
              <Select value={addDocCategory} label="Category *" onChange={(e) => setAddDocCategory(e.target.value as CompanyDocumentCategory)}>
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{DOCUMENT_CATEGORY_LABELS[cat]}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant={addDocFileName ? 'outlined' : 'contained'}
              color={addDocFileName ? 'success' : 'primary'}
              startIcon={<Iconify icon="mingcute:add-line" width={16} />}
              onClick={handleAddDocPickFile}
            >
              {addDocFileName ? addDocFileName : 'Choose File'}
            </Button>

            <Typography variant="caption" color="text.disabled">
              Supports: images (JPG, PNG, HEIC), PDF, Word documents
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddDocOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddDocConfirm} disabled={!addDocFileName}>
            Add Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document viewer dialog */}
      <Dialog open={!!viewingDoc} onClose={() => setViewingDoc(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Document Preview</DialogTitle>
        <DialogContent>
          {viewingDoc && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify icon={docIcon(viewingDoc.fileName)} width={40} sx={{ color: '#10B981', flexShrink: 0 }} />
                <Box>
                  <Typography variant="body2" fontWeight="fontWeightSemiBold">{viewingDoc.fileName}</Typography>
                  <Typography variant="caption" color="text.secondary">{DOCUMENT_CATEGORY_LABELS[viewingDoc.category]}</Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Uploaded {fDate(viewingDoc.uploadedAt)}</Typography>
                </Box>
              </Stack>
              <Alert severity="info" sx={{ fontSize: 12 }}>
                File preview will be available once connected to the backend storage.
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewingDoc(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={!!notification} autoHideDuration={3000} onClose={() => setNotification(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {notification ? (
          <Alert severity={notification.severity} onClose={() => setNotification(null)} sx={{ width: '100%' }}>
            {notification.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </DashboardContent>
  );
}
