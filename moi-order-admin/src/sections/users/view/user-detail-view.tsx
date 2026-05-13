import type { SelectChangeEvent } from '@mui/material/Select';

import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fToNow } from 'src/utils/format-time';

import { useAuth } from 'src/context/auth-context';
import { DashboardContent } from 'src/layouts/dashboard';
import { usersApi, type UserDocument, type UserDetailData, type CreateDocumentPayload, type ServiceSubmissionSummary } from 'src/api/users';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const DOCUMENT_TYPES = [
  { value: 'passport',          label: 'Passport' },
  { value: 'ninety_day_report', label: '90-Day Report' },
  { value: 'other',             label: 'Other Document' },
];

const DOC_CATEGORIES: { value: string; label: string }[] = DOCUMENT_TYPES;

// ── Extracted data field config per type ────────────────────────────────────

const EXTRACTED_FIELDS: Record<string, { key: string; label: string }[]> = {
  passport: [
    { key: 'full_name',       label: 'Full name' },
    { key: 'passport_number', label: 'Passport number' },
    { key: 'date_of_birth',   label: 'Date of birth (YYYY-MM-DD)' },
    { key: 'issue_date',      label: 'Issue date (YYYY-MM-DD)' },
    { key: 'country_code',    label: 'Country code' },
  ],
  ninety_day_report: [
    { key: 'full_name',             label: 'Full name' },
    { key: 'previous_report_date',  label: 'Report date (YYYY-MM-DD)' },
    { key: 'next_report_date',      label: 'Next due date (YYYY-MM-DD)' },
  ],
  other: [
    { key: 'full_name', label: 'Full name' },
  ],
};

// ── Add / Edit document dialog ───────────────────────────────────────────────

interface DocDialogProps {
  open: boolean;
  initial?: UserDocument;
  dialogTitle: string;
  isNew: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateDocumentPayload) => void;
  loading: boolean;
}

function DocDialog({ open, initial, dialogTitle, isNew, onClose, onSubmit, loading }: DocDialogProps) {
  const [type, setType]           = useState(initial?.type ?? 'passport');
  const [subtype, setSubtype]     = useState(initial?.subtype ?? '');
  const [expiry, setExpiry]       = useState(initial?.expiry_date ?? '');
  const [extension, setExtension] = useState(initial?.extension_date ?? '');
  const [note, setNote]           = useState(initial?.validation_message ?? '');
  const [file, setFile]           = useState<File | null>(null);
  const [extracted, setExtracted] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(initial?.extracted_data ?? {}).map(([k, v]) => [k, v ?? ''])
    )
  );

  useEffect(() => {
    if (open) {
      setType(initial?.type ?? 'passport');
      setSubtype(initial?.subtype ?? '');
      setExpiry(initial?.expiry_date ?? '');
      setExtension(initial?.extension_date ?? '');
      setNote(initial?.validation_message ?? '');
      setFile(null);
      setExtracted(
        Object.fromEntries(
          Object.entries(initial?.extracted_data ?? {}).map(([k, v]) => [k, v ?? ''])
        )
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fields = EXTRACTED_FIELDS[type] ?? EXTRACTED_FIELDS.other;

  const handleSubmit = () => {
    const extractedData: Record<string, string> = {};
    fields.forEach(({ key }) => { if (extracted[key]) extractedData[key] = extracted[key]; });
    // Also preserve any existing keys not in the field config (from OCR)
    Object.entries(extracted).forEach(([k, v]) => {
      if (v && !extractedData[k]) extractedData[k] = v;
    });
    onSubmit({
      type,
      subtype,
      expiry_date:        expiry     || null,
      extension_date:     extension  || null,
      validation_message: note       || null,
      is_valid_type:      true,
      extracted_data:     extractedData,
      image:              file,
    });
  };

  const canSave = subtype.trim().length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>

        {/* Type — only editable on new records */}
        {isNew && (
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select value={type} label="Type" onChange={(e: SelectChangeEvent) => setType(e.target.value)}>
              {DOCUMENT_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Title — required */}
        <TextField
          label="Title *"
          size="small"
          value={subtype}
          onChange={(e) => setSubtype(e.target.value)}
          placeholder="e.g. Bio Page, Visa Stamp, TM30"
          helperText="This label appears on the document card"
          required
        />

        {/* File upload */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            {isNew ? 'Upload image (optional)' : 'Replace image (optional)'}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            component="label"
            startIcon={<Iconify icon="solar:share-bold" width={16} />}
          >
            {file ? file.name : 'Choose file'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </Button>
          {file && (
            <Box
              component="img"
              src={URL.createObjectURL(file)}
              alt="preview"
              sx={{ mt: 1, maxHeight: 120, borderRadius: 1, display: 'block', objectFit: 'contain' }}
            />
          )}
        </Box>

        <Divider />

        {/* Dates */}
        <Stack direction="row" spacing={1}>
          <TextField
            label="Expiry date"
            type="date"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
          <TextField
            label="Extension / next report"
            type="date"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={extension}
            onChange={(e) => setExtension(e.target.value)}
          />
        </Stack>

        {/* Extracted data fields */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          Document data (editable — correct OCR mistakes here)
        </Typography>
        {fields.map(({ key, label }) => (
          <TextField
            key={key}
            label={label}
            size="small"
            value={extracted[key] ?? ''}
            onChange={(e) => setExtracted((prev) => ({ ...prev, [key]: e.target.value }))}
          />
        ))}

        <TextField
          label="Admin note (optional)"
          size="small"
          multiline
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !canSave}>
          {loading ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Photo preview dialog ─────────────────────────────────────────────────────

function PhotoDialog({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <Dialog open onClose={onClose} maxWidth="md">
      <DialogContent sx={{ p: 1 }}>
        <Box
          component="img"
          src={url}
          alt="document"
          sx={{ maxWidth: '100%', maxHeight: '80vh', display: 'block', borderRadius: 1 }}
        />
      </DialogContent>
    </Dialog>
  );
}

// ── OCR data row ─────────────────────────────────────────────────────────────

function OcrRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <Stack direction="row" spacing={1} sx={{ py: 0.25 }}>
      <Typography variant="caption" color="text.disabled" sx={{ minWidth: 130 }}>{label}</Typography>
      <Typography variant="caption" color="text.primary">{value}</Typography>
    </Stack>
  );
}

// ── Document category section ─────────────────────────────────────────────────

interface DocSectionProps {
  label: string;
  docs: UserDocument[];
  canManage: boolean;
  onDelete: (doc: UserDocument) => void;
  onEdit: (doc: UserDocument) => void;
  onPreview: (url: string) => void;
}

function DocSection({ label, docs, canManage, onDelete, onEdit, onPreview }: DocSectionProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}>
        {label}
      </Typography>

      {docs.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ pl: 1 }}>No records</Typography>
      ) : (
        <Stack spacing={1.5}>
          {docs.map((doc) => (
            <Card key={doc.id} variant="outlined" sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                {/* Photo thumbnail (user-uploaded only) */}
                {doc.file_url && (
                  <Box
                    component="img"
                    src={doc.file_url}
                    alt={doc.type_label}
                    onClick={() => onPreview(doc.file_url!)}
                    sx={{
                      width: 80, height: 80, objectFit: 'cover', borderRadius: 1,
                      flexShrink: 0, cursor: 'pointer', border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                )}
                {!doc.file_url && !doc.is_admin_created && (
                  <Box
                    sx={{
                      width: 80, height: 80, borderRadius: 1, flexShrink: 0,
                      bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px dashed', borderColor: 'divider',
                    }}
                  >
                    <Iconify icon="solar:eye-bold" width={24} sx={{ color: 'text.disabled' }} />
                  </Box>
                )}

                {/* Info */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Label color={doc.is_valid_type ? 'success' : 'warning'}>{doc.type_label}</Label>
                    {doc.subtype && (
                      <Typography variant="caption" color="text.secondary">{doc.subtype}</Typography>
                    )}
                    {doc.is_admin_created && (
                      <Chip size="small" label="Admin record" variant="outlined" color="primary" sx={{ height: 18, fontSize: 10 }} />
                    )}
                  </Stack>

                  {/* Dates */}
                  <Stack spacing={0} sx={{ mb: 0.5 }}>
                    <OcrRow label="Expiry date"     value={doc.expiry_date    ? fDate(doc.expiry_date)    : null} />
                    <OcrRow label="Extension / next" value={doc.extension_date ? fDate(doc.extension_date) : null} />
                  </Stack>

                  {/* OCR extracted data */}
                  {Object.keys(doc.extracted_data).length > 0 && (
                    <Box sx={{ mt: 0.5 }}>
                      {Object.entries(doc.extracted_data).map(([k, v]) =>
                        v ? <OcrRow key={k} label={k.replace(/_/g, ' ')} value={v} /> : null
                      )}
                    </Box>
                  )}

                  {doc.validation_message && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontStyle: 'italic' }}>
                      {doc.validation_message}
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                    Added {fDate(doc.created_at)}
                  </Typography>
                </Box>

                {/* Actions — edit all docs; delete admin-created or invalid-type docs */}
                {canManage && (
                  <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                    <IconButton size="small" onClick={() => onEdit(doc)} title="Edit">
                      <Iconify icon="solar:pen-bold" width={16} />
                    </IconButton>
                    {(doc.is_admin_created || !doc.is_valid_type) && (
                      <IconButton size="small" color="error" onClick={() => onDelete(doc)} title="Delete">
                        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                      </IconButton>
                    )}
                  </Stack>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}

// ── Channel badge ────────────────────────────────────────────────────────────

function ChannelBadge({ label, connected, value }: { label: string; connected: boolean; value?: string | null }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 0.75 }}>
      <Chip
        size="small"
        label={label}
        color={connected ? 'success' : 'default'}
        variant="outlined"
        sx={{ minWidth: 80 }}
      />
      {connected && value && (
        <Typography variant="body2" color="text.secondary">{value}</Typography>
      )}
      {!connected && (
        <Typography variant="caption" color="text.disabled">Not connected</Typography>
      )}
    </Stack>
  );
}

// ── Main view ────────────────────────────────────────────────────────────────

export function UserDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { hasPermission } = useAuth();
  const canManage = hasPermission('users.manage');

  const [user, setUser]       = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const [addDocOpen, setAddDocOpen]     = useState(false);
  const [addDocLoading, setAddDocLoading] = useState(false);

  const [editDoc, setEditDoc]       = useState<UserDocument | null>(null);
  const [editDocLoading, setEditDocLoading] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchUser = useCallback(() => {
    if (!id) return;
    setLoading(true);
    usersApi
      .get(id)
      .then(setUser)
      .catch(() => setError('Failed to load user.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const handleAddDoc = useCallback(
    (payload: CreateDocumentPayload) => {
      if (!id) return;
      setAddDocLoading(true);
      usersApi.documents
        .create(id, payload)
        .then((doc) => {
          setUser((prev) => prev ? { ...prev, documents: [doc, ...prev.documents] } : prev);
          setAddDocOpen(false);
        })
        .catch(() => {})
        .finally(() => setAddDocLoading(false));
    },
    [id],
  );

  const handleEditDoc = useCallback(
    (payload: CreateDocumentPayload) => {
      if (!id || !editDoc) return;
      setEditDocLoading(true);
      usersApi.documents
        .update(id, editDoc.uuid, payload)
        .then((updated) => {
          setUser((prev) =>
            prev ? { ...prev, documents: prev.documents.map((d) => d.id === updated.id ? updated : d) } : prev
          );
          setEditDoc(null);
        })
        .catch((err: { message?: string }) => {
          alert(`Save failed: ${err?.message ?? 'Unknown error'}`);
        })
        .finally(() => setEditDocLoading(false));
    },
    [id, editDoc],
  );

  const handleDeleteDoc = useCallback(
    (doc: UserDocument) => {
      if (!id) return;
      if (!window.confirm(`Delete "${doc.type_label}" record? The user will be notified.`)) return;
      usersApi.documents
        .delete(id, doc.uuid)
        .then(() =>
          setUser((prev) => prev ? { ...prev, documents: prev.documents.filter((d) => d.id !== doc.id) } : prev)
        )
        .catch(() => {});
    },
    [id],
  );

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error || !user) {
    return (
      <DashboardContent>
        <Alert severity="error">{error || 'User not found.'}</Alert>
      </DashboardContent>
    );
  }

  const channels = user.connected_channels;

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.back()} size="small">
          <Iconify icon="eva:arrow-ios-forward-fill" sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>User Detail</Typography>
      </Box>

      {/* Profile card */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
          <Box sx={{ position: 'relative', alignSelf: 'flex-start' }}>
            <Avatar
              src={user.profile_picture_url ?? undefined}
              alt={user.name}
              sx={{ width: 80, height: 80, fontSize: 32 }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            {user.is_online && (
              <Box
                sx={{
                  position: 'absolute', bottom: 4, right: 4,
                  width: 14, height: 14, borderRadius: '50%',
                  bgcolor: 'success.main', border: '2px solid white',
                }}
              />
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Typography variant="h5">{user.name}</Typography>
              {user.is_online
                ? <Chip size="small" label="Online" color="success" />
                : user.last_active_at
                  ? <Chip size="small" label={`Active ${fToNow(user.last_active_at)}`} color="default" />
                  : null
              }
              {user.is_admin && <Chip size="small" label="Admin" color="primary" />}
              {user.is_merchant && <Chip size="small" label="Merchant" color="warning" />}
            </Stack>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            {user.phone_number && (
              <Typography variant="body2" color="text.secondary">{user.phone_number}</Typography>
            )}
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
              Member since {fDate(user.created_at)}
              {user.date_of_birth && ` · Born ${fDate(user.date_of_birth)}`}
            </Typography>
          </Box>
        </Stack>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Connected Accounts" />
        <Tab label={`Ticket Orders (${user.recent_ticket_orders.length})`} />
        <Tab label={`Food Orders (${user.recent_food_orders.length})`} />
        <Tab label={`Services (${user.service_submissions.length})`} />
        <Tab label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {`Documents (${user.documents.length})`}
            {user.documents.filter((d) => !d.is_valid_type).length > 0 && (
              <Chip
                size="small"
                label={user.documents.filter((d) => !d.is_valid_type).length}
                color="warning"
                sx={{ height: 16, fontSize: 10, fontWeight: 700, minWidth: 20, px: 0.5 }}
              />
            )}
          </Box>
        } />
      </Tabs>

      {/* Tab 0: Connected accounts */}
      {activeTab === 0 && (
        <Card>
          <CardHeader title="Connected Accounts" subheader="Authentication methods linked to this account" />
          <Divider />
          <Box sx={{ p: 3 }}>
            <ChannelBadge label="Email"  connected={channels.email.connected}  value={channels.email.value} />
            <ChannelBadge label="Phone"  connected={channels.phone.connected}  value={channels.phone.value} />
            <ChannelBadge label="Google" connected={channels.google.connected} />
            <ChannelBadge label="Apple"  connected={channels.apple.connected}  />
            <ChannelBadge label="LINE"   connected={channels.line.connected}   />
          </Box>
        </Card>
      )}

      {/* Tab 1: Ticket orders */}
      {activeTab === 1 && (
        <Card>
          <CardHeader title="Ticket Orders" />
          <Scrollbar>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Ticket</TableCell>
                    <TableCell>Visit Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ordered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.recent_ticket_orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No ticket orders</TableCell>
                    </TableRow>
                  ) : (
                    user.recent_ticket_orders.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="primary.main">#{order.id}</Typography>
                        </TableCell>
                        <TableCell>{order.ticket_name ?? '—'}</TableCell>
                        <TableCell>{fDate(order.visit_date)}</TableCell>
                        <TableCell>
                          <Label color={order.status === 'completed' ? 'success' : order.status === 'payment_failed' ? 'error' : 'warning'}>
                            {order.status_label}
                          </Label>
                        </TableCell>
                        <TableCell>{fDate(order.created_at)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      )}

      {/* Tab 2: Food orders */}
      {activeTab === 2 && (
        <Card>
          <CardHeader title="Food Orders" />
          <Scrollbar>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Restaurant</TableCell>
                    <TableCell>Order No.</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ordered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.recent_food_orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No food orders</TableCell>
                    </TableRow>
                  ) : (
                    user.recent_food_orders.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="primary.main">#{order.id}</Typography>
                        </TableCell>
                        <TableCell>{order.restaurant_name ?? '—'}</TableCell>
                        <TableCell>{order.order_number ?? '—'}</TableCell>
                        <TableCell align="right">
                          {order.total !== null ? fCurrency(order.total / 100) : '—'}
                        </TableCell>
                        <TableCell>
                          <Label color="default">{order.status}</Label>
                        </TableCell>
                        <TableCell>{fDate(order.created_at)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      )}

      {/* Tab 3: Service submissions */}
      {activeTab === 3 && (
        <Card>
          <CardHeader title="Service Submissions" />
          <Scrollbar>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submitted</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.service_submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No service submissions</TableCell>
                    </TableRow>
                  ) : (
                    user.service_submissions.map((sub: ServiceSubmissionSummary) => (
                      <TableRow key={sub.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="primary.main">#{sub.id}</Typography>
                        </TableCell>
                        <TableCell>{sub.service_name}</TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">{sub.type_name ?? '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Label color={
                            sub.status === 'completed'       ? 'success' :
                            sub.status === 'payment_failed'  ? 'error'   :
                            sub.status === 'cancelled'       ? 'error'   :
                            sub.status === 'processing'      ? 'warning' : 'default'
                          }>
                            {sub.status_label}
                          </Label>
                        </TableCell>
                        <TableCell>{fDate(sub.created_at)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      )}

      {/* Tab 4: Documents — 3 categories */}
      {activeTab === 4 && (
        <Card>
          <CardHeader
            title="Documents"
            subheader="User-uploaded files (read-only) and admin-created records. Users are notified on add or delete."
            action={
              canManage && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() => setAddDocOpen(true)}
                >
                  Add Record
                </Button>
              )
            }
          />
          <Divider />
          <Box sx={{ p: 3 }}>
            {DOC_CATEGORIES.map((cat) => {
              const catDocs = user.documents.filter((d) => d.type === cat.value);
              return (
                <DocSection
                  key={cat.value}
                  label={cat.label}
                  docs={catDocs}
                  canManage={canManage}
                  onDelete={handleDeleteDoc}
                  onEdit={(doc) => setEditDoc(doc)}
                  onPreview={(url) => setPreviewUrl(url)}
                />
              );
            })}
          </Box>
        </Card>
      )}

      {/* Add doc dialog */}
      <DocDialog
        open={addDocOpen}
        dialogTitle="Add Document Record"
        isNew
        onClose={() => setAddDocOpen(false)}
        onSubmit={handleAddDoc}
        loading={addDocLoading}
      />

      {/* Edit doc dialog */}
      {editDoc && (
        <DocDialog
          open
          dialogTitle="Edit Document Record"
          isNew={false}
          initial={editDoc}
          onClose={() => setEditDoc(null)}
          onSubmit={handleEditDoc}
          loading={editDocLoading}
        />
      )}

      {/* Photo preview */}
      {previewUrl && <PhotoDialog url={previewUrl} onClose={() => setPreviewUrl(null)} />}
    </DashboardContent>
  );
}
