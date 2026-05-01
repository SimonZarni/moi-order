import type { HomeCard } from 'src/types';

import { useEffect, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { homeCardsApi } from 'src/api/home-cards';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const NAV_SCREEN_LABELS: Record<string, string> = {
  NinetyDayReport:  '90-Day Report',
  Places:           'Places',
  Tickets:          'Tickets',
  OtherServices:    'Other Services',
  EmbassyServices:  'Embassy Services',
  AirportFastTrack: 'Airport Fast Track',
  Food:             'Food',
  PassportVault:    'Passport Vault',
  Search:           'Search',
  PlacesMap:        'Places Map',
};

// ----------------------------------------------------------------------

export function HomeCardsView() {
  const router = useRouter();

  const [cards, setCards] = useState<HomeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reordering, setReordering] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HomeCard | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCards = useCallback(() => {
    setLoading(true);
    homeCardsApi
      .list({ per_page: 100 })
      .then(({ data }) => setCards(data))
      .catch(() => setError('Failed to load home cards.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const move = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const next = [...cards];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= next.length) return;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      setCards(next);
      setReordering(true);
      homeCardsApi
        .reorder(next.map((c) => c.id))
        .catch(() => setError('Failed to save new order.'))
        .finally(() => setReordering(false));
    },
    [cards]
  );

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setDeleting(true);
    homeCardsApi
      .remove(deleteTarget.id)
      .then(() => {
        setCards((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      })
      .catch(() => setError('Failed to delete card.'))
      .finally(() => setDeleting(false));
  }, [deleteTarget]);

  const activeCount = cards.filter((c) => !c.deleted_at && c.is_active).length;

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4">Home Cards</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {activeCount} active card{activeCount !== 1 ? 's' : ''} shown on the mobile home screen
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push('/home-cards/new')}
        >
          Add Card
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 80 }}>Order</TableCell>
                <TableCell>Card</TableCell>
                <TableCell>Tag</TableCell>
                <TableCell>Goes To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : cards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No cards yet. Add your first card.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                cards.map((card, index) => (
                  <TableRow key={card.id} hover sx={{ opacity: card.deleted_at ? 0.45 : 1 }}>
                    {/* Position arrows */}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
                        <IconButton
                          size="small"
                          disabled={index === 0 || reordering || !!card.deleted_at}
                          onClick={() => move(index, 'up')}
                        >
                          <Iconify icon="eva:arrow-ios-upward-fill" width={16} />
                        </IconButton>
                        <Typography variant="caption" color="text.disabled">
                          {index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          disabled={index === cards.length - 1 || reordering || !!card.deleted_at}
                          onClick={() => move(index, 'down')}
                        >
                          <Iconify icon="eva:arrow-ios-downward-fill" width={16} />
                        </IconButton>
                      </Box>
                    </TableCell>

                    {/* Card preview */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 44,
                            borderRadius: 1,
                            bgcolor: card.accent_color,
                            flexShrink: 0,
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle2">{card.title_en}</Typography>
                          {card.subtitle_en && (
                            <Typography variant="caption" color="text.secondary">
                              {card.subtitle_en}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Tag */}
                    <TableCell>
                      <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.8, color: card.accent_color }}>
                        {card.tag_en}
                      </Typography>
                    </TableCell>

                    {/* Navigation target */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {NAV_SCREEN_LABELS[card.navigation_screen] ?? card.navigation_screen}
                      </Typography>
                    </TableCell>

                    {/* Status badges */}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                        {card.deleted_at ? (
                          <Label color="error">Deleted</Label>
                        ) : card.is_coming_soon ? (
                          <Label color="warning">Coming Soon</Label>
                        ) : card.is_active ? (
                          <Label color="success">Active</Label>
                        ) : (
                          <Label color="default">Inactive</Label>
                        )}
                      </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        disabled={!!card.deleted_at}
                        onClick={() => router.push(`/home-cards/${card.id}/edit`)}
                      >
                        <Iconify icon="solar:pen-bold" width={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={!!card.deleted_at}
                        onClick={() => setDeleteTarget(card)}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Card>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Card?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            &ldquo;{deleteTarget?.title_en}&rdquo; will be removed from the home screen. You can
            restore it later from the API if needed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
