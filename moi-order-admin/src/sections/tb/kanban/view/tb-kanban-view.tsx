import type { DragEndEvent } from '@dnd-kit/core';

import { CSS } from '@dnd-kit/utilities';
import { useState, useCallback } from 'react';
import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { useAuth } from 'src/context/auth-context';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';

import { tbStore, COLUMN_LABELS, moveKanbanCard } from '../../shared/tb-mock-store';

import type { KanbanCard, KanbanColumn, KanbanPipeline } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

const COLUMNS: { id: KanbanColumn; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'processing', label: 'Processing' },
  { id: 'document_review', label: 'Document Review' },
  { id: 'completed', label: 'Completed' },
];

const URGENCY_COLOR: Record<string, 'error' | 'warning' | 'success'> = {
  high: 'error',
  medium: 'warning',
  low: 'success',
};

// ----------------------------------------------------------------------

type DraggableCardProps = { card: KanbanCard; canEdit: boolean };

function DraggableCard({ card, canEdit }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    disabled: !canEdit,
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isDragging ? 6 : 1}
      sx={{
        p: 2,
        borderRadius: 1.5,
        userSelect: 'none',
        opacity: isDragging ? 0.6 : 1,
        cursor: canEdit ? 'grab' : 'default',
        touchAction: canEdit ? 'none' : 'auto',
        '&:active': { cursor: canEdit ? 'grabbing' : 'default' },
      }}
      {...attributes}
      {...listeners}
    >
      <Typography variant="body2" fontWeight="fontWeightSemiBold" sx={{ mb: 0.5 }}>
        {card.companyName}
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        {card.directorNames.join(' · ')}
      </Typography>

      {card.notes && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}
        >
          {card.notes}
        </Typography>
      )}

      <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
        <Label color={URGENCY_COLOR[card.urgency]}>{card.urgency.toUpperCase()}</Label>

        {card.visaExpiryDate && (
          <Chip
            size="small"
            label={`Visa exp: ${fDate(card.visaExpiryDate)}`}
            sx={{ height: 20, fontSize: 10 }}
          />
        )}
      </Stack>
    </Paper>
  );
}

// ----------------------------------------------------------------------

type DroppableColumnProps = {
  column: KanbanColumn;
  label: string;
  cards: KanbanCard[];
  canEdit: boolean;
};

function DroppableColumn({ column, label, cards, canEdit }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: '1 1 220px',
        minWidth: 220,
        borderRadius: 2,
        p: 1.5,
        bgcolor: isOver && canEdit ? 'action.selected' : 'background.neutral',
        border: '2px dashed',
        borderColor: isOver && canEdit ? 'primary.main' : 'transparent',
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5, px: 0.5 }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Chip size="small" label={cards.length} sx={{ height: 20, fontSize: 11, bgcolor: 'background.paper' }} />
      </Stack>

      <Stack spacing={1.5}>
        {cards.map((card) => (
          <DraggableCard key={card.id} card={card} canEdit={canEdit} />
        ))}
        {cards.length === 0 && (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ textAlign: 'center', py: 3, display: 'block' }}
          >
            {canEdit ? 'Drop cards here' : 'Empty'}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

type KanbanBoardProps = {
  pipeline: KanbanPipeline;
  cards: KanbanCard[];
  canEdit: boolean;
  onCardMoved: () => void;
};

function KanbanBoard({ pipeline, cards, canEdit, onCardMoved }: KanbanBoardProps) {
  // MouseSensor for desktop, TouchSensor with long-press delay for mobile
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const [, setVersion] = useState(0);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || !canEdit) return;
      moveKanbanCard(active.id as string, over.id as KanbanColumn);
      setVersion((v) => v + 1);
      onCardMoved();
    },
    [canEdit, onCardMoved]
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
        {COLUMNS.map((col) => (
          <DroppableColumn
            key={col.id}
            column={col.id}
            label={COLUMN_LABELS[col.id]}
            cards={cards.filter((c) => c.column === col.id && c.pipeline === pipeline)}
            canEdit={canEdit}
          />
        ))}
      </Box>
    </DndContext>
  );
}

// ----------------------------------------------------------------------

const PIPELINE_TABS: { id: KanbanPipeline; label: string }[] = [
  { id: 'company_registration', label: 'Company Registration' },
  { id: 'visa_work_permit', label: 'Visa / Work Permit Extensions' },
];

export function TBKanbanView() {
  const { isSuperAdmin } = useAuth();
  const canEdit = isSuperAdmin();

  const [activePipeline, setActivePipeline] = useState<KanbanPipeline>('company_registration');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const cards = tbStore.kanbanCards;

  const handleTabChange = useCallback((_: React.SyntheticEvent, val: KanbanPipeline) => {
    setActivePipeline(val);
  }, []);

  const handleCardMoved = useCallback(() => {
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);
    // Simulate API call — replace with real endpoint when backend is ready
    setTimeout(() => {
      setSaving(false);
      setHasChanges(false);
      setSaved(true);
    }, 800);
  }, []);

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Kanban Pipelines</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {canEdit
              ? 'Long-press a card on mobile or click-and-drag on desktop to move it.'
              : 'You have view-only access to this board.'}
          </Typography>
        </Box>

        {canEdit && (
          <Button
            variant="contained"
            disabled={!hasChanges || saving}
            onClick={handleSave}
            sx={{ flexShrink: 0, mt: 0.5 }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        )}
      </Stack>

      {!canEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Only Super Admins can move cards. You are viewing this board in read-only mode.
        </Alert>
      )}

      <Tabs
        value={activePipeline}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        {PIPELINE_TABS.map((tab) => (
          <Tab key={tab.id} value={tab.id} label={tab.label} />
        ))}
      </Tabs>

      <KanbanBoard
        pipeline={activePipeline}
        cards={cards}
        canEdit={canEdit}
        onCardMoved={handleCardMoved}
      />

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSaved(false)} sx={{ width: '100%' }}>
          Pipeline changes saved successfully.
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
