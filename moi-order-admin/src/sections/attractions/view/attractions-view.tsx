import type { IconifyName } from 'src/components/iconify';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { attractionsApi, type AttractionData } from 'src/api/attractions';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const ATTRACTION_ICON: IconifyName = 'solar:cart-3-bold';

// ----------------------------------------------------------------------

export function AttractionsView() {
  const router = useRouter();
  const [attractions, setAttractions] = useState<AttractionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filterName, setFilterName] = useState('');

  const fetchAttractions = useCallback(() => {
    setLoading(true);
    attractionsApi
      .list({ search: filterName || undefined })
      .then(({ data }) => setAttractions(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filterName]);

  useEffect(() => {
    fetchAttractions();
  }, [fetchAttractions]);


  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Attractions</Typography>
          <Typography variant="body2" color="text.secondary">Manage ticket listings</Typography>
        </Box>
        <OutlinedInput
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="Search attractions..."
          startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment>}
          sx={{ width: 240, height: 40 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push('/attractions/new')}
        >
          Add Attraction
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {attractions.map((attraction) => (
            <Grid key={attraction.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={attraction.cover_image_url ?? undefined}
                    variant="square"
                    sx={{ width: '100%', height: 180, borderRadius: '12px 12px 0 0' }}
                  />
                  {attraction.starting_from_price !== null && (
                    <Box sx={{ position: 'absolute', bottom: 12, left: 12, bgcolor: 'primary.main', color: 'white', borderRadius: 1, px: 1.5, py: 0.5 }}>
                      <Typography variant="caption" fontWeight={700}>
                        From {attraction.starting_from_price.toFixed(0)} THB
                      </Typography>
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    {attraction.name}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                    <Iconify icon="solar:eye-bold" width={14} sx={{ color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.secondary">{attraction.city}</Typography>
                    {attraction.province && (
                      <>
                        <Typography variant="caption" color="text.disabled">·</Typography>
                        <Typography variant="caption" color="text.secondary">{attraction.province}</Typography>
                      </>
                    )}
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {attraction.highlight_description || attraction.description}
                  </Typography>
                </CardContent>

                <Divider />
                <Stack direction="row" sx={{ p: 1.5 }} spacing={1} alignItems="center">
                  <Button
                    size="small"
                    startIcon={<Iconify icon="solar:pen-bold" width={14} />}
                    onClick={() => router.push(`/attractions/${attraction.id}`)}
                    sx={{ flexGrow: 1 }}
                  >
                    Edit Variants
                  </Button>
                  <IconButton size="small" color="error" onClick={() => setDeleteConfirm(attraction.id)}>
                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                  </IconButton>
                </Stack>
              </Card>
            </Grid>
          ))}

          {attractions.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
                <Iconify icon={ATTRACTION_ICON} width={48} sx={{ mb: 2, opacity: 0.3 }} />
                <Typography variant="body1">No attractions found</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Attraction?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently remove the attraction.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => {
            if (deleteConfirm !== null) {
              attractionsApi.remove(deleteConfirm).then(() => { setDeleteConfirm(null); fetchAttractions(); }).catch(() => setDeleteConfirm(null));
            }
          }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
