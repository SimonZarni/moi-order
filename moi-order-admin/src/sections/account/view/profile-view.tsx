import Cropper from 'react-easy-crop';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { getCroppedImg } from 'src/utils/crop-image';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type CropArea = { x: number; y: number; width: number; height: number };

export function ProfileView() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('Admin User');
  const [email] = useState('admin@moiorder.com');
  const [phone, setPhone] = useState('+66 80 000 0000');
  const [bio, setBio] = useState('Admin of Moi Order travel platform.');

  // Photo crop state
  const [avatarSrc, setAvatarSrc] = useState('/assets/images/avatar/avatar-25.webp');
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

  const onCropComplete = useCallback((_: unknown, pixels: CropArea) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPendingImageSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropDialogOpen(true);
    e.target.value = '';
  };

  const handleCropSave = async () => {
    if (!pendingImageSrc || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(pendingImageSrc, croppedAreaPixels);
    setAvatarSrc(cropped);
    setCropDialogOpen(false);
    setPendingImageSrc(null);
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    if (pendingImageSrc) URL.revokeObjectURL(pendingImageSrc);
    setPendingImageSrc(null);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Profile</Typography>
        <Typography variant="body2" color="text.secondary">Manage your admin profile</Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSaved(false)}>
          Profile updated successfully.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Avatar card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 5, pb: 4 }}>
              <Box sx={{ position: 'relative', mb: 3 }}>
                <Avatar
                  src={avatarSrc}
                  sx={{ width: 120, height: 120, border: '3px solid', borderColor: 'primary.light' }}
                />
                <Button
                  component="label"
                  size="small"
                  variant="contained"
                  color="primary"
                  sx={{ position: 'absolute', bottom: 0, right: -8, minWidth: 32, width: 32, height: 32, borderRadius: '50%', p: 0 }}
                >
                  <Iconify icon="solar:pen-bold" width={14} />
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </Button>
              </Box>
              <Typography variant="h6">{name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{email}</Typography>
              <Label color="error">Super Admin</Label>
              <Divider sx={{ width: '100%', my: 3 }} />
              <Stack spacing={1.5} sx={{ width: '100%' }}>
                {[
                  ['Member since', 'Jan 2024'],
                  ['Last login', 'Today'],
                  ['Login method', 'Email'],
                ].map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                    <Typography variant="body2" fontWeight={500}>{value}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Edit form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader title="Personal Information" />
            <Divider />
            <CardContent>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setSaved(false); }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={email}
                    disabled
                    helperText="Change email in Settings"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setSaved(false); }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Role" value="Super Admin" disabled />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    value={bio}
                    onChange={(e) => { setBio(e.target.value); setSaved(false); }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={() => setSaved(true)} startIcon={<Iconify icon="eva:checkmark-fill" width={16} />}>
                  Save Changes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Crop Dialog */}
      <Dialog open={cropDialogOpen} onClose={handleCropCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile Photo</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: 'relative', height: 320, bgcolor: 'grey.900' }}>
            {pendingImageSrc && (
              <Cropper
                image={pendingImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </Box>
          <Box sx={{ px: 3, pt: 2, pb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>Zoom</Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                onChange={(_, v) => setZoom(v as number)}
                size="small"
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCropCancel}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCropSave}>
            Crop &amp; Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
