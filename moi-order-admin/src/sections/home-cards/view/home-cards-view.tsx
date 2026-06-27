import type { DragEndEvent } from '@dnd-kit/core';
import type { HomeCard, HomeCardRoute } from 'src/types';

import { CSS } from '@dnd-kit/utilities';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSensor, DndContext, useSensors, closestCenter, PointerSensor } from '@dnd-kit/core';
import { arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

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
import { homeCardRoutesApi } from 'src/api/home-card-routes';

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

function navLabel(screen: string | null): string {
  if (!screen) return '—';
  return NAV_SCREEN_LABELS[screen] ?? screen;
}

// ----------------------------------------------------------------------

interface SortableRowProps {
  card: HomeCard;
  index: number;
  total: number;
  reorderMode: boolean;
  reorderBusy: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableRow({
  card,
  index,
  total,
  reorderMode,
  reorderBusy,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled: !reorderMode,
  });

  return (
    <TableRow
      ref={setNodeRef}
      hover={!isDragging}
      style={{ transform: CSS.Transform.toString(transform) ?? undefined, transition }}
      sx={{
        opacity: card.deleted_at ? 0.45 : 1,
        position: 'relative',
        zIndex: isDragging ? 999 : 'auto',
        boxShadow: isDragging ? 8 : 0,
        bgcolor: isDragging ? 'background.paper' : 'transparent',
      }}
    >
      {/* Order / drag handle */}
      <TableCell>
        {reorderMode ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              color: 'text.disabled',
              cursor: 'grab',
              userSelect: 'none',
              '&:active': { cursor: 'grabbing' },
            }}
            {...attributes}
            {...listeners}
          >
            <Iconify icon="custom:drag-handle" width={18} />
            <Typography variant="caption">{index + 1}</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
            <IconButton
              size="small"
              disabled={index === 0 || reorderBusy || !!card.deleted_at}
              onClick={onMoveUp}
            >
              <Iconify icon="eva:arrow-ios-upward-fill" width={16} />
            </IconButton>
            <Typography variant="caption" color="text.disabled">
              {index + 1}
            </Typography>
            <IconButton
              size="small"
              disabled={index === total - 1 || reorderBusy || !!card.deleted_at}
              onClick={onMoveDown}
            >
              <Iconify icon="eva:arrow-ios-downward-fill" width={16} />
            </IconButton>
          </Box>
        )}
      </TableCell>

      {/* Card preview */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 6,
              height: 44,
              borderRadius: 1,
              bgcolor: card.border_color,
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
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ textTransform: 'uppercase', letterSpacing: 0.8, color: card.accent_color }}
        >
          {card.tag_en}
        </Typography>
      </TableCell>

      {/* Navigation target */}
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {navLabel(card.navigation_screen)}
        </Typography>
      </TableCell>

      {/* Status */}
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

      {/* Actions — hidden in reorder mode */}
      {!reorderMode && (
        <TableCell align="right">
          <IconButton size="small" disabled={!!card.deleted_at} onClick={onEdit}>
            <Iconify icon="solar:pen-bold" width={16} />
          </IconButton>
          <IconButton size="small" color="error" disabled={!!card.deleted_at} onClick={onDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
}

// ----------------------------------------------------------------------

interface ChildRowProps {
  card: HomeCard;
  onEdit: () => void;
  onDelete: () => void;
}

function ChildRow({ card, onEdit, onDelete }: ChildRowProps) {
  return (
    <TableRow
      hover
      sx={{
        opacity: card.deleted_at ? 0.45 : 1,
        bgcolor: 'background.neutral',
      }}
    >
      {/* Indent marker */}
      <TableCell sx={{ pl: 3, color: 'text.disabled' }}>
        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
          ↳
        </Typography>
      </TableCell>

      {/* Card preview — indented */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 1.5 }}>
          <Box
            sx={{
              width: 4,
              height: 36,
              borderRadius: 1,
              bgcolor: card.border_color,
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {card.title_en}
            </Typography>
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
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ textTransform: 'uppercase', letterSpacing: 0.8, color: card.accent_color }}
        >
          {card.tag_en}
        </Typography>
      </TableCell>

      {/* Navigation target */}
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {navLabel(card.navigation_screen)}
        </Typography>
      </TableCell>

      {/* Status */}
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
        <IconButton size="small" disabled={!!card.deleted_at} onClick={onEdit}>
          <Iconify icon="solar:pen-bold" width={16} />
        </IconButton>
        <IconButton size="small" color="error" disabled={!!card.deleted_at} onClick={onDelete}>
          <Iconify icon="solar:trash-bin-trash-bold" width={16} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

// ----------------------------------------------------------------------

export function HomeCardsView() {
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const [cards, setCards] = useState<HomeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reordering, setReordering] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HomeCard | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderIds, setReorderIds] = useState<number[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);

  // ── Route management ───────────────────────────────────────────────────────
  const [routes, setRoutes]                 = useState<HomeCardRoute[]>([]);
  const [routesLoading, setRoutesLoading]   = useState(false);
  const [manageRoutesOpen, setManageRoutesOpen] = useState(false);
  const [deleteRouteId, setDeleteRouteId]   = useState<number | null>(null);
  const [deletingRoute, setDeletingRoute]   = useState(false);

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

  useEffect(() => {
    setRoutesLoading(true);
    homeCardRoutesApi
      .list()
      .then(setRoutes)
      .finally(() => setRoutesLoading(false));
  }, []);

  const handleDeleteRoute = useCallback(() => {
    if (deleteRouteId === null) return;
    setDeletingRoute(true);
    homeCardRoutesApi
      .remove(deleteRouteId)
      .then(() => {
        setRoutes((prev) => prev.filter((r) => r.id !== deleteRouteId));
        setDeleteRouteId(null);
      })
      .finally(() => setDeletingRoute(false));
  }, [deleteRouteId]);

  // ── Derived hierarchy ──────────────────────────────────────────────────────

  const rootCards = useMemo(
    () => cards.filter((c) => c.parent_id === null),
    [cards],
  );

  const childrenByParentId = useMemo(() => {
    const map = new Map<number, HomeCard[]>();
    cards
      .filter((c) => c.parent_id !== null)
      .forEach((c) => {
        const arr = map.get(c.parent_id!) ?? [];
        arr.push(c);
        map.set(c.parent_id!, arr);
      });
    return map;
  }, [cards]);

  const activeCount = cards.filter((c) => !c.deleted_at && c.is_active).length;

  // In reorder mode, only root cards participate. Children stay fixed under their parent.
  const activeRootCards = useMemo(
    () => rootCards.filter((c) => !c.deleted_at),
    [rootCards],
  );

  const orderedRootCards = reorderMode
    ? reorderIds.map((id) => rootCards.find((c) => c.id === id)).filter((c): c is HomeCard => !!c)
    : rootCards;

  // ── Actions ────────────────────────────────────────────────────────────────

  const move = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const next = [...activeRootCards];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= next.length) return;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];

      const deletedRoots = rootCards.filter((c) => !!c.deleted_at);
      const children = cards.filter((c) => c.parent_id !== null);
      setCards([...next, ...deletedRoots, ...children]);

      setReordering(true);
      homeCardsApi
        .reorder(next.map((c) => c.id))
        .catch(() => setError('Failed to save new order.'))
        .finally(() => setReordering(false));
    },
    [activeRootCards, rootCards, cards],
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

  const handleEnterReorder = useCallback(() => {
    setReorderIds(activeRootCards.map((c) => c.id));
    setReorderMode(true);
  }, [activeRootCards]);

  const handleCancelReorder = useCallback(() => {
    setReorderMode(false);
  }, []);

  const handleSaveOrder = useCallback(async () => {
    setSavingOrder(true);
    try {
      await homeCardsApi.reorder(reorderIds);
      setCards((prev) => {
        const byId = new Map(prev.map((c) => [c.id, c]));
        const reordered = reorderIds.map((id) => byId.get(id)!).filter(Boolean) as HomeCard[];
        const deletedRoots = prev.filter((c) => c.parent_id === null && !!c.deleted_at);
        const children = prev.filter((c) => c.parent_id !== null);
        return [...reordered, ...deletedRoots, ...children];
      });
      setReorderMode(false);
    } catch {
      setError('Failed to save new order.');
    } finally {
      setSavingOrder(false);
    }
  }, [reorderIds]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setReorderIds((prev) => {
      const oldIdx = prev.indexOf(active.id as number);
      const newIdx = prev.indexOf(over.id as number);
      return arrayMove(prev, oldIdx, newIdx);
    });
  }, []);

  const colSpan = reorderMode ? 5 : 6;

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4">Home Cards</Typography>
          {reorderMode ? (
            <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
              Drag rows to set the display order. Children always follow their parent.
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {activeCount} active card{activeCount !== 1 ? 's' : ''} shown on the mobile home
              screen
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {reorderMode ? (
            <>
              <Button variant="outlined" onClick={handleCancelReorder} disabled={savingOrder}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSaveOrder} disabled={savingOrder}>
                {savingOrder ? 'Saving…' : 'Save Order'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                disabled={routesLoading}
                onClick={() => setManageRoutesOpen(true)}
              >
                Manage Routes
              </Button>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="carbon:chevron-sort" />}
                disabled={loading || activeRootCards.length < 2}
                onClick={handleEnterReorder}
              >
                Reorder
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => router.push('/home-cards/new')}
              >
                Add Card
              </Button>
            </>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <Scrollbar>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={reorderMode ? reorderIds : []}
              strategy={verticalListSortingStrategy}
            >
              <Table sx={{ minWidth: 720 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 80 }}>Order</TableCell>
                    <TableCell>Card</TableCell>
                    <TableCell>Tag</TableCell>
                    <TableCell>Goes To</TableCell>
                    <TableCell>Status</TableCell>
                    {!reorderMode && <TableCell align="right">Actions</TableCell>}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={colSpan} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={28} />
                      </TableCell>
                    </TableRow>
                  ) : orderedRootCards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={colSpan} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          {reorderMode
                            ? 'No active cards to reorder.'
                            : 'No cards yet. Add your first card.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orderedRootCards.map((card, index) => {
                      const children = childrenByParentId.get(card.id) ?? [];
                      return (
                        <React.Fragment key={card.id}>
                          <SortableRow
                            card={card}
                            index={index}
                            total={activeRootCards.length}
                            reorderMode={reorderMode}
                            reorderBusy={reordering}
                            onMoveUp={() => move(index, 'up')}
                            onMoveDown={() => move(index, 'down')}
                            onEdit={() => router.push(`/home-cards/${card.id}/edit`)}
                            onDelete={() => setDeleteTarget(card)}
                          />
                          {!reorderMode &&
                            children.map((child) => (
                              <ChildRow
                                key={child.id}
                                card={child}
                                onEdit={() => router.push(`/home-cards/${child.id}/edit`)}
                                onDelete={() => setDeleteTarget(child)}
                              />
                            ))}
                        </React.Fragment>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
        </Scrollbar>
      </Card>

      {/* Manage Routes dialog */}
      <Dialog open={manageRoutesOpen} onClose={() => setManageRoutesOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Navigation Routes</DialogTitle>
        <DialogContent dividers>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Keys must be PascalCase to match mobile screen names (e.g. SafetyLocationList).
            Delete wrong routes, then re-create with the correct key via the card edit form.
          </Typography>
          {routesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : routes.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No routes yet.</Typography>
          ) : routes.map((route) => (
            <Box key={route.id} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">{route.label_en}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  key: {route.key} · {route.type}
                </Typography>
              </Box>
              <IconButton
                size="small"
                color="error"
                onClick={() => setDeleteRouteId(route.id)}
                aria-label={`Delete route ${route.label_en}`}
              >
                <Iconify icon="solar:trash-bin-trash-bold" width={18} />
              </IconButton>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManageRoutesOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete route confirm dialog */}
      <Dialog open={deleteRouteId !== null} onClose={() => setDeleteRouteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete this route?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Home cards using this route will lose their navigation destination. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRouteId(null)} disabled={deletingRoute}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteRoute} disabled={deletingRoute}>
            {deletingRoute ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete card confirm dialog */}
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
