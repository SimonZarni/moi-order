import type { DragEndEvent } from '@dnd-kit/core';

import { CSS } from '@dnd-kit/utilities';
import { useState, useCallback } from 'react';
import { useSensor, DndContext, useSensors, useDraggable, useDroppable, PointerSensor } from '@dnd-kit/core';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

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

type DraggableCardProps = { card: KanbanCard };

function DraggableCard({ card }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isDragging ? 6 : 1}
      sx={{
        p: 2,
        cursor: 'grab',
        opacity: isDragging ? 0.6 : 1,
        borderRadius: 1.5,
        userSelect: 'none',
        '&:active': { cursor: 'grabbing' },
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
};

function DroppableColumn({ column, label, cards }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: '1 1 220px',
        minWidth: 220,
        borderRadius: 2,
        p: 1.5,
        bgcolor: isOver ? 'action.selected' : 'background.neutral',
        border: '2px dashed',
        borderColor: isOver ? 'primary.main' : 'transparent',
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5, px: 0.5 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Chip
          size="small"
          label={cards.length}
          sx={{ height: 20, fontSize: 11, bgcolor: 'background.paper' }}
        />
      </Stack>

      <Stack spacing={1.5}>
        {cards.map((card) => (
          <DraggableCard key={card.id} card={card} />
        ))}
        {cards.length === 0 && (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ textAlign: 'center', py: 3, display: 'block' }}
          >
            Drop cards here
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

type KanbanBoardProps = { pipeline: KanbanPipeline; cards: KanbanCard[] };

function KanbanBoard({ pipeline, cards }: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const [, setVersion] = useState(0);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;
      moveKanbanCard(active.id as string, over.id as KanbanColumn);
      setVersion((v) => v + 1);
    },
    []
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
  const [activePipeline, setActivePipeline] = useState<KanbanPipeline>('company_registration');
  const cards = tbStore.kanbanCards;

  const handleTabChange = useCallback((_: React.SyntheticEvent, val: KanbanPipeline) => {
    setActivePipeline(val);
  }, []);

  return (
    <DashboardContent maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Kanban Pipelines
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Drag and drop cards between columns to update their status.
      </Typography>

      <Tabs
        value={activePipeline}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        {PIPELINE_TABS.map((tab) => (
          <Tab key={tab.id} value={tab.id} label={tab.label} />
        ))}
      </Tabs>

      <KanbanBoard pipeline={activePipeline} cards={cards} />
    </DashboardContent>
  );
}
