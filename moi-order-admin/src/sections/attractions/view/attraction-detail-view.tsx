import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { attractionsApi, type AttractionData } from 'src/api/attractions';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const genTempId = () => Math.random().toString(36).slice(2, 10);

type LocalVariant = { tempId: string; id?: number; name: string; price: number; description: string };

// ----------------------------------------------------------------------

export function AttractionDetailView() {
  const { id } = useParams();
  const router = useRouter();

  const [attraction, setAttraction] = useState<AttractionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState<LocalVariant[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([attractionsApi.get(id), attractionsApi.listVariants(id)])
      .then(([data, variantList]) => {
        setAttraction(data);
        setVariants(variantList.map((v) => ({ ...v, tempId: String(v.id) })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const addVariant = () => {
    setVariants((prev) => [...prev, { tempId: genTempId(), name: '', price: 0, description: '' }]);
  };

  const updateVariant = (tempId: string, field: keyof LocalVariant, value: string | number) => {
    setVariants((prev) => prev.map((v) => (v.tempId === tempId ? { ...v, [field]: value } : v)));
  };

  const removeVariant = (tempId: string) => {
    const lv = variants.find((v) => v.tempId === tempId);
    if (lv?.id && id) attractionsApi.deleteVariant(Number(id), lv.id).catch(() => {});
    setVariants((prev) => prev.filter((v) => v.tempId !== tempId));
  };

  const handleSave = () => {
    if (!id || !attraction) return;
    setSaving(true);
    const current = attraction.variants ?? [];
    const removedIds = current.filter((v) => !variants.find((lv) => lv.id === v.id)).map((v) => v.id);
    const ops = [
      ...removedIds.map((vid) => attractionsApi.deleteVariant(Number(id), vid)),
      ...variants.map((lv, i) => {
        const payload = { name: lv.name, price: lv.price, description: lv.description, sort_order: i + 1 };
        return lv.id
          ? attractionsApi.updateVariant(Number(id), lv.id, payload)
          : attractionsApi.createVariant(Number(id), payload);
      }),
    ];
    Promise.all(ops)
      .then(() => Promise.all([attractionsApi.get(Number(id)), attractionsApi.listVariants(Number(id))]))
      .then(([data, variantList]) => {
        setAttraction(data);
        setVariants(variantList.map((v) => ({ ...v, tempId: String(v.id) })));
      })
      .catch(() => {})
      .finally(() => setSaving(false));
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

  if (!attraction) {
    return (
      <DashboardContent>
        <Alert severity="error">Attraction not found.</Alert>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.push('/attractions')}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">{attraction.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {attraction.city}
            {attraction.province ? ` · ${attraction.province}` : ''}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} /> : <Iconify icon="eva:checkmark-fill" width={14} />}
        >
          Save Variants
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <Avatar
              src={attraction.cover_image_url ?? undefined}
              variant="square"
              sx={{ width: '100%', height: 200, borderRadius: '12px 12px 0 0' }}
            />
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {attraction.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {attraction.highlight_description || attraction.description}
              </Typography>
              {attraction.starting_from_price != null && (
                <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 1 }}>
                  From {attraction.starting_from_price.toFixed(0)} THB
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader
              title={`Pricing Variants (${variants.length})`}
              action={
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon="mingcute:add-line" width={14} />}
                  onClick={addVariant}
                >
                  Add Variant
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                {variants.map((v) => (
                  <Box
                    key={v.tempId}
                    sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 5 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Variant Name"
                          value={v.name}
                          onChange={(e) => updateVariant(v.tempId, 'name', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Price (THB)"
                          type="number"
                          value={v.price}
                          onChange={(e) => updateVariant(v.tempId, 'price', Number(e.target.value))}
                        />
                      </Grid>
                      <Grid size={{ xs: 4, sm: 3 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Description"
                          value={v.description}
                          onChange={(e) => updateVariant(v.tempId, 'description', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 2, sm: 1 }}>
                        <IconButton size="small" color="error" onClick={() => removeVariant(v.tempId)}>
                          <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                {variants.length === 0 && (
                  <Box
                    sx={{
                      py: 4,
                      textAlign: 'center',
                      color: 'text.disabled',
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      No variants yet. Click &quot;Add Variant&quot; to add pricing options.
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
