import type { ContentType, ContentStatus } from 'src/types';

type ContentItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  type: ContentType;
  status: ContentStatus;
  createdAt: Date;
};

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const genId = () => Math.random().toString(36).slice(2, 10);

const TYPE_COLORS: Record<ContentType, 'primary' | 'warning' | 'info' | 'success'> = {
  advertisement: 'primary',
  notification: 'warning',
  banner: 'info',
  announcement: 'success',
};

const STATUS_COLORS: Record<ContentStatus, 'success' | 'default' | 'warning'> = {
  active: 'success',
  inactive: 'default',
  draft: 'warning',
};

const MOCK_CONTENT: ContentItem[] = [
  {
    id: 'c1',
    title: 'Summer Travel Deal — Bangkok',
    description: 'Exclusive deals on Bangkok attractions this summer. Book now and save up to 30% on selected packages.',
    imageUrl: '/assets/images/cover/cover-1.webp',
    link: 'https://moiorder.app/deals/bangkok-summer',
    type: 'advertisement',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: 'c2',
    title: 'New Attraction: Kuang Si Falls',
    description: 'We just added Kuang Si Falls Day Trip to our platform! Check it out and book your adventure.',
    imageUrl: '/assets/images/cover/cover-5.webp',
    link: 'https://moiorder.app/attractions/kuang-si',
    type: 'notification',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: 'c3',
    title: 'App Update v2.5',
    description: 'We have improved the booking flow and added LINE Login support. Update your app for the best experience.',
    imageUrl: '/assets/images/cover/cover-3.webp',
    link: 'https://moiorder.app/updates',
    type: 'announcement',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: 'c4',
    title: 'Visa Assistance — Limited Spots',
    description: 'Our 90-day embassy report service slots are filling up fast. Secure your spot today.',
    imageUrl: '/assets/images/cover/cover-2.webp',
    link: 'https://moiorder.app/services/90day',
    type: 'banner',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 10),
  },
  {
    id: 'c5',
    title: 'Patuxai Tour Flash Sale',
    description: 'Flash sale this weekend only — Patuxai Monument Tour at 50% off for all ticket types.',
    imageUrl: '/assets/images/cover/cover-6.webp',
    link: 'https://moiorder.app/attractions/patuxai',
    type: 'advertisement',
    status: 'draft',
    createdAt: new Date(Date.now() - 86400000 * 1),
  },
  {
    id: 'c6',
    title: 'Maintenance Notice',
    description: 'The app will be under scheduled maintenance on Sunday 22:00–23:00 ICT. Bookings may be unavailable.',
    imageUrl: '/assets/images/cover/cover-4.webp',
    link: '',
    type: 'announcement',
    status: 'inactive',
    createdAt: new Date(Date.now() - 86400000 * 14),
  },
];

// ----------------------------------------------------------------------

type ContentDialogProps = {
  open: boolean;
  item: ContentItem | null;
  onClose: () => void;
  onSave: (item: ContentItem) => void;
};

function ContentDialog({ open, item, onClose, onSave }: ContentDialogProps) {
  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [link, setLink] = useState(item?.link ?? '');
  const [type, setType] = useState<ContentType>(item?.type ?? 'advertisement');
  const [status, setStatus] = useState<ContentStatus>(item?.status ?? 'draft');
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? '');
  const [previewSrc, setPreviewSrc] = useState(item?.imageUrl ?? '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
    setImageUrl(url);
    e.target.value = '';
  };

  const handleSave = () => {
    onSave({
      id: item?.id ?? genId(),
      title, description, link, type, status,
      imageUrl: imageUrl || '/assets/images/cover/cover-1.webp',
      createdAt: item?.createdAt ?? new Date(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{item ? 'Edit Content' : 'Add New Content'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          {/* Image Upload */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Cover Image</Typography>
            <Box
              component="label"
              sx={{
                display: 'block',
                width: '100%',
                height: 160,
                border: '2px dashed',
                borderColor: previewSrc ? 'transparent' : 'divider',
                borderRadius: 1.5,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                '&:hover .upload-overlay': { opacity: 1 },
              }}
            >
              {previewSrc
                ? <img src={previewSrc} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : (
                  <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', color: 'text.disabled' }}>
                    <Iconify icon="mingcute:add-line" width={36} sx={{ mb: 1 }} />
                    <Typography variant="caption">Click to upload image</Typography>
                  </Stack>
                )
              }
              {previewSrc && (
                <Box
                  className="upload-overlay"
                  sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                >
                  <Stack alignItems="center" sx={{ color: 'white' }}>
                    <Iconify icon="solar:pen-bold" width={24} sx={{ mb: 0.5 }} />
                    <Typography variant="caption">Change image</Typography>
                  </Stack>
                </Box>
              )}
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Box>
          </Box>

          <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select value={type} label="Type" onChange={(e) => setType(e.target.value as ContentType)}>
                  <MenuItem value="advertisement">Advertisement</MenuItem>
                  <MenuItem value="notification">Notification</MenuItem>
                  <MenuItem value="banner">Banner</MenuItem>
                  <MenuItem value="announcement">Announcement</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value as ContentStatus)}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Redirect Link (URL)"
            placeholder="https://moiorder.app/..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={!title.trim()}>
          {item ? 'Save Changes' : 'Add Content'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export function ContentView() {
  const [items, setItems] = useState<ContentItem[]>(MOCK_CONTENT);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = items.filter((item) => {
    const matchName = item.title.toLowerCase().includes(filterName.toLowerCase()) || item.description.toLowerCase().includes(filterName.toLowerCase());
    const matchType = filterType === 'all' || item.type === filterType;
    return matchName && matchType;
  });

  const handleSave = useCallback((item: ContentItem) => {
    setItems((prev) => {
      const exists = prev.find((x) => x.id === item.id);
      return exists ? prev.map((x) => (x.id === item.id ? item : x)) : [...prev, item];
    });
  }, []);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">Content</Typography>
          <Typography variant="body2" color="text.secondary">Manage ads, notifications &amp; banners shown to app users</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <OutlinedInput
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="Search content..."
          startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment>}
          sx={{ mr: 2, width: 240, height: 40 }}
        />
        <FormControl size="small" sx={{ mr: 2, minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select value={filterType} label="Type" onChange={(e) => setFilterType(e.target.value)}>
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="advertisement">Advertisement</MenuItem>
            <MenuItem value="notification">Notification</MenuItem>
            <MenuItem value="banner">Banner</MenuItem>
            <MenuItem value="announcement">Announcement</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => { setEditItem(null); setDialogOpen(true); }}>
          Add Content
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filtered.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={item.imageUrl}
                  variant="square"
                  sx={{ width: '100%', height: 160, borderRadius: '12px 12px 0 0' }}
                />
                <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
                  <Label color={TYPE_COLORS[item.type]} variant="filled" sx={{ textTransform: 'capitalize' }}>
                    {item.type}
                  </Label>
                </Box>
                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                  <Label color={STATUS_COLORS[item.status]} variant="soft" sx={{ textTransform: 'capitalize' }}>
                    {item.status}
                  </Label>
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </Typography>
                {item.link
                  ? (
                    <Chip
                      size="small"
                      variant="outlined"
                      icon={<Iconify icon="eva:arrow-ios-forward-fill" width={12} />}
                      label={item.link.length > 36 ? `${item.link.slice(0, 36)}…` : item.link}
                      sx={{ maxWidth: '100%', fontSize: 11 }}
                    />
                  )
                  : (
                    <Typography variant="caption" color="text.disabled">No redirect link</Typography>
                  )
                }
              </CardContent>

              <Divider />
              <Stack direction="row" alignItems="center" sx={{ px: 1.5, py: 1 }}>
                <Typography variant="caption" color="text.disabled" sx={{ flexGrow: 1 }}>{fDate(item.createdAt)}</Typography>
                <Button size="small" startIcon={<Iconify icon="solar:pen-bold" width={14} />} onClick={() => { setEditItem(item); setDialogOpen(true); }}>
                  Edit
                </Button>
                <IconButton size="small" color="error" onClick={() => setDeleteConfirm(item.id)}>
                  <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                </IconButton>
              </Stack>
            </Card>
          </Grid>
        ))}

        {filtered.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
              <Iconify icon="solar:bell-bing-bold-duotone" width={48} sx={{ mb: 2, opacity: 0.3 }} />
              <Typography variant="body1">No content found</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <ContentDialog open={dialogOpen} item={editItem} onClose={() => setDialogOpen(false)} onSave={handleSave} />

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Content?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">This content will be removed and users will no longer see it in the app.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => { if (deleteConfirm) { setItems((prev) => prev.filter((x) => x.id !== deleteConfirm)); setDeleteConfirm(null); } }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
