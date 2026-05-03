import type { SelectChangeEvent } from '@mui/material/Select';

import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
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
import { usersApi, type UserDocument, type UserDetailData, type CreateDocumentPayload } from 'src/api/users';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const DOCUMENT_TYPES = [
  { value: 'passport',          label: 'Passport' },
  { value: 'ninety_day_report', label: '90-Day Report' },
  { value: 'other',             label: 'Other Document' },
];

// ── Add document dialog ─────────────────────────────────────────────��────────

interface AddDocDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateDocumentPayload) => void;
  loading: boolean;
}

function AddDocDialog({ open, onClose, onSubmit, loading }: AddDocDialogProps) {
  const [type, setType]       = useState('passport');
  const [subtype, setSubtype] = useState('');
  const [expiry, setExpiry]   = useState('');
  const [note, setNote]       = useState('');

  const handleSubmit = () => {
    onSubmit({
      type,
      subtype:            subtype || null,
      expiry_date:        expiry  || null,
      validation_message: note    || null,
      is_valid_type:      true,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Document</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={(e: SelectChangeEvent) => setType(e.target.value)}>
            {DOCUMENT_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Subtype (optional)" size="small" value={subtype} onChange={(e) => setSubtype(e.target.value)} />
        <TextField label="Expiry date" type="date" size="small" InputLabelProps={{ shrink: true }} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        <TextField label="Note (optional)" size="small" multiline rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Adding…' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
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
  const [addDocOpen, setAddDocOpen]   = useState(false);
  const [addDocLoading, setAddDocLoading] = useState(false);

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

  const handleDeleteDoc = useCallback(
    (docId: number, docLabel: string) => {
      if (!id) return;
      if (!window.confirm(`Delete "${docLabel}" document? The user will be notified.`)) return;
      usersApi.documents
        .delete(id, docId)
        .then(() => setUser((prev) => prev ? { ...prev, documents: prev.documents.filter((d: UserDocument) => d.id !== docId) } : prev))
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
        <Tab label={`Documents (${user.documents.length})`} />
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

      {/* Tab 3: Documents */}
      {activeTab === 3 && (
        <Card>
          <CardHeader
            title="Documents"
            subheader="Passport, 90-Day Reports, and other docs. Users are notified when you add or remove."
            action={
              canManage && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() => setAddDocOpen(true)}
                >
                  Add Document
                </Button>
              )
            }
          />
          <Scrollbar>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Subtype</TableCell>
                    <TableCell>Expiry</TableCell>
                    <TableCell>Note</TableCell>
                    <TableCell>Added</TableCell>
                    {canManage && <TableCell align="right">Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canManage ? 6 : 5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No documents
                      </TableCell>
                    </TableRow>
                  ) : (
                    user.documents.map((doc: UserDocument) => (
                      <TableRow key={doc.id} hover>
                        <TableCell>
                          <Label color={doc.is_valid_type ? 'success' : 'warning'}>{doc.type_label}</Label>
                        </TableCell>
                        <TableCell>{doc.subtype ?? '—'}</TableCell>
                        <TableCell>{doc.expiry_date ? fDate(doc.expiry_date) : '—'}</TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {doc.validation_message ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>{fDate(doc.created_at)}</TableCell>
                        {canManage && (
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteDoc(doc.id, doc.type_label)}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      )}

      <AddDocDialog
        open={addDocOpen}
        onClose={() => setAddDocOpen(false)}
        onSubmit={handleAddDoc}
        loading={addDocLoading}
      />
    </DashboardContent>
  );
}
