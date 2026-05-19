import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';

import { CSS } from '@dnd-kit/utilities';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import ToggleButton from '@mui/material/ToggleButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { fDate } from 'src/utils/format-time';

import { useAuth } from 'src/context/auth-context';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import {
  tbStore,
  addKanbanCard,
  editKanbanCard,
  addKanbanStage,
  moveKanbanCard,
  deleteKanbanStage,
  updateKanbanStage,
  reorderKanbanCards,
  reorderKanbanStages,
} from '../../shared/tb-mock-store';

import type { KanbanCard, KanbanStage, UrgencyLevel, KanbanPipeline } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

const URGENCY_COLOR: Record<UrgencyLevel, 'error' | 'warning' | 'success'> = {
  high: 'error',
  medium: 'warning',
  low: 'success',
};

const PIPELINE_TABS: { id: KanbanPipeline; label: string }[] = [
  { id: 'company_registration', label: 'Company Registration' },
  { id: 'visa_work_permit', label: 'Visa / Work Permit Extensions' },
];

// ----------------------------------------------------------------------
// Shared card content (used by both DraggableCard and CardOverlay)

function CardBody({
  card,
  canEdit,
  onEditCard,
}: {
  card: KanbanCard;
  canEdit: boolean;
  onEditCard: (c: KanbanCard) => void;
}) {
  return (
    <>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="body2" fontWeight="fontWeightSemiBold" noWrap sx={{ flex: 1, mr: 0.5 }}>
          {card.companyName}
        </Typography>
        {canEdit && (
          <Tooltip title="Edit case">
            <IconButton
              size="small"
              sx={{ p: 0.25, mt: -0.25, flexShrink: 0, opacity: 0.5 }}
              onClick={(e) => { e.stopPropagation(); onEditCard(card); }}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <Iconify icon="solar:pen-bold" width={13} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }} noWrap>
        {card.directorNames.join(' · ')}
      </Typography>

      {card.notes && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontStyle: 'italic' }} noWrap>
          {card.notes}
        </Typography>
      )}

      <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
        <Label color={URGENCY_COLOR[card.urgency]}>{card.urgency.toUpperCase()}</Label>
        {card.visaExpiryDate && (
          <Chip size="small" label={`Visa: ${fDate(card.visaExpiryDate)}`} sx={{ height: 20, fontSize: 10 }} />
        )}
        {card.durationDays != null && (
          <Chip size="small" label={`${card.durationDays}d`} sx={{ height: 20, fontSize: 10 }} />
        )}
      </Stack>

      <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
        Created {fDate(card.createdDate)}
      </Typography>
    </>
  );
}

// ----------------------------------------------------------------------
// Sortable case card (uses useSortable for both cross-column and within-column drag)

type DraggableCardProps = { card: KanbanCard; canEdit: boolean; onEditCard: (c: KanbanCard) => void };

function DraggableCard({ card, canEdit, onEditCard }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled: !canEdit,
    data: { type: 'card', column: card.column },
  });

  return (
    <Paper
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 1.5,
        userSelect: 'none',
        opacity: isDragging ? 0.3 : 1,
        cursor: canEdit ? 'grab' : 'default',
        touchAction: canEdit ? 'none' : 'auto',
        '&:active': { cursor: canEdit ? 'grabbing' : 'default' },
      }}
      {...attributes}
      {...listeners}
    >
      <CardBody card={card} canEdit={canEdit} onEditCard={onEditCard} />
    </Paper>
  );
}

// Overlay card rendered inside DragOverlay (no hooks, elevated shadow)
function CardOverlay({ card }: { card: KanbanCard }) {
  return (
    <Paper elevation={8} sx={{ p: 2, borderRadius: 1.5, userSelect: 'none', cursor: 'grabbing', width: 240 }}>
      <CardBody card={card} canEdit={false} onEditCard={() => {}} />
    </Paper>
  );
}

// ----------------------------------------------------------------------
// Sortable + droppable stage column

type DroppableColumnProps = {
  stage: KanbanStage;
  cards: KanbanCard[];
  canEdit: boolean;
  canDelete: boolean;
  isCardOver: boolean;
  onSaveLabel: (stageId: string, label: string) => void;
  onDelete: (stageId: string) => void;
  onEditCard: (card: KanbanCard) => void;
};

function DroppableColumn({
  stage, cards, canEdit, canDelete, isCardOver, onSaveLabel, onDelete, onEditCard,
}: DroppableColumnProps) {
  const {
    setNodeRef, attributes, listeners,
    transform, transition, isDragging,
  } = useSortable({ id: stage.id, data: { type: 'stage' } });

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(stage.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setEditValue(stage.label); }, [stage.label]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const handleSave = useCallback(() => {
    if (editValue.trim()) onSaveLabel(stage.id, editValue.trim());
    setEditing(false);
  }, [editValue, onSaveLabel, stage.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') { setEditValue(stage.label); setEditing(false); }
    },
    [handleSave, stage.label]
  );

  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);

  return (
    <Box
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      sx={{
        flex: '1 1 240px',
        minWidth: 240,
        borderRadius: 2,
        p: 1.5,
        opacity: isDragging ? 0.5 : 1,
        bgcolor: isCardOver && canEdit ? 'action.selected' : 'background.neutral',
        border: '2px dashed',
        borderColor: isCardOver && canEdit ? 'primary.main' : 'transparent',
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
    >
      {/* Column header */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5, px: 0.5 }}>
        {canEdit && !editing && (
          <Tooltip title="Drag to reorder stage">
            <Box
              {...attributes}
              {...listeners}
              sx={{ display: 'flex', alignItems: 'center', cursor: 'grab', color: 'text.disabled', flexShrink: 0, touchAction: 'none', '&:active': { cursor: 'grabbing' } }}
            >
              <Iconify icon="custom:menu-duotone" width={14} />
            </Box>
          </Tooltip>
        )}

        {editing ? (
          <>
            <TextField
              inputRef={inputRef}
              size="small"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ flex: 1 }}
              slotProps={{ input: { sx: { py: 0.5, fontSize: 13, fontWeight: 600 } } }}
            />
            <IconButton size="small" color="primary" onClick={handleSave}>
              <Iconify icon="solar:check-circle-bold" width={16} />
            </IconButton>
            <IconButton size="small" onClick={() => { setEditValue(stage.label); setEditing(false); }}>
              <Iconify icon="mingcute:close-line" width={16} />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="subtitle2" color="text.secondary" sx={{ flexGrow: 1 }}>
              {stage.label}
            </Typography>
            {canEdit && (
              <Stack direction="row" spacing={0}>
                <Tooltip title="Rename stage">
                  <IconButton size="small" onClick={() => setEditing(true)} sx={{ opacity: 0.6 }}>
                    <Iconify icon="solar:pen-bold" width={13} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={!canDelete ? 'Move all cases out before deleting' : 'Delete stage'}>
                  <span>
                    <IconButton size="small" disabled={!canDelete} onClick={() => onDelete(stage.id)} sx={{ opacity: 0.6 }}>
                      <Iconify icon="solar:trash-bin-trash-bold" width={13} sx={{ color: canDelete ? 'error.main' : 'text.disabled' }} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            )}
            <Chip size="small" label={cards.length} sx={{ height: 20, fontSize: 11, bgcolor: 'background.paper' }} />
          </>
        )}
      </Stack>

      {/* Cards — wrapped in SortableContext for within-column reordering */}
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <Stack spacing={1.5}>
          {cards.map((card) => (
            <DraggableCard key={card.id} card={card} canEdit={canEdit} onEditCard={onEditCard} />
          ))}
          {cards.length === 0 && (
            <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', py: 3, display: 'block' }}>
              {canEdit ? 'Drop cases here' : 'No cases'}
            </Typography>
          )}
        </Stack>
      </SortableContext>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Board

type KanbanBoardProps = {
  pipeline: KanbanPipeline;
  stages: KanbanStage[];
  cards: KanbanCard[];
  canEdit: boolean;
  onCardMoved: () => void;
  onStageMoved: (reordered: KanbanStage[]) => void;
  onSaveStageLabel: (stageId: string, label: string) => void;
  onDeleteStage: (stageId: string) => void;
  onAddStage: () => void;
  onEditCard: (card: KanbanCard) => void;
};

function KanbanBoard({
  pipeline, stages, cards, canEdit,
  onCardMoved, onStageMoved, onSaveStageLabel, onDeleteStage, onAddStage, onEditCard,
}: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const stageIds = useMemo(() => stages.map((s) => s.id), [stages]);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
  const [cardOverStageId, setCardOverStageId] = useState<string | null>(null);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (event.active.data.current?.type === 'card') {
        setActiveCard(cards.find((c) => c.id === event.active.id) ?? null);
      }
    },
    [cards]
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (active.data.current?.type === 'card') {
      setCardOverStageId(over ? (over.id as string) : null);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveCard(null);
      setCardOverStageId(null);
      const { active, over } = event;
      if (!over || !canEdit) return;

      const activeType = active.data.current?.type;
      const overType = over.data.current?.type;

      if (activeType === 'stage') {
        const oi = stages.findIndex((s) => s.id === active.id);
        const ni = stages.findIndex((s) => s.id === over.id);
        if (oi !== ni) onStageMoved(arrayMove([...stages], oi, ni));
      } else if (activeType === 'card') {
        const activeCardData = cards.find((c) => c.id === active.id);
        if (!activeCardData) return;

        if (overType === 'card') {
          const overCardData = cards.find((c) => c.id === over.id);
          if (!overCardData) return;

          if (activeCardData.column === overCardData.column) {
            // Same column — reorder within column
            reorderKanbanCards(active.id as string, over.id as string);
          } else {
            // Different column — move card
            moveKanbanCard(active.id as string, overCardData.column);
          }
        } else if (overType === 'stage') {
          // Dropped directly on a column (e.g. empty column)
          if (activeCardData.column !== (over.id as string)) {
            moveKanbanCard(active.id as string, over.id as string);
          }
        }
        onCardMoved();
      }
    },
    [canEdit, stages, cards, onStageMoved, onCardMoved]
  );

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <SortableContext items={stageIds} strategy={horizontalListSortingStrategy}>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, alignItems: 'flex-start' }}>
          {stages.map((stage) => {
            const stageCards = cards.filter((c) => c.column === stage.id && c.pipeline === pipeline);
            const allInStage = cards.filter((c) => c.column === stage.id);
            return (
              <DroppableColumn
                key={stage.id}
                stage={stage}
                cards={stageCards}
                canEdit={canEdit}
                canDelete={allInStage.length === 0 && stages.length > 1}
                isCardOver={cardOverStageId === stage.id}
                onSaveLabel={onSaveStageLabel}
                onDelete={onDeleteStage}
                onEditCard={onEditCard}
              />
            );
          })}

          {canEdit && (
            <Box sx={{ flexShrink: 0, pt: 0.5 }}>
              <Button variant="outlined" startIcon={<Iconify icon="mingcute:add-line" width={16} />} onClick={onAddStage} sx={{ whiteSpace: 'nowrap', minWidth: 140 }}>
                Add Stage
              </Button>
            </Box>
          )}
        </Box>
      </SortableContext>

      {/* Drag overlay — renders a floating card clone while dragging */}
      <DragOverlay>
        {activeCard ? <CardOverlay card={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

// ----------------------------------------------------------------------
// Add Stage dialog

type AddStageDialogProps = { open: boolean; onClose: () => void; onSubmit: (label: string) => void };

function AddStageDialog({ open, onClose, onSubmit }: AddStageDialogProps) {
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(() => {
    if (!label.trim()) { setError('Stage name is required'); return; }
    onSubmit(label.trim());
    setLabel('');
    setError('');
  }, [label, onSubmit]);

  const handleClose = useCallback(() => {
    setLabel('');
    setError('');
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Stage</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth autoFocus label="Stage Name *"
          value={label}
          onChange={(e) => { setLabel(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          error={!!error}
          helperText={error || 'e.g. "Under Review", "Pending Approval"'}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Add Stage</Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
// Add / Edit Case dialog

type AddCaseForm = {
  companyId: string;
  pipeline: KanbanPipeline;
  columnId: string;
  urgency: UrgencyLevel;
  visaExpiryDate: string;
  durationDays: string;
  createdDate: string;
  notes: string;
};

type AddCaseDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (card: Omit<KanbanCard, 'id'>) => void;
  stages: KanbanStage[];
  defaultPipeline: KanbanPipeline;
  editCard?: KanbanCard;
};

function AddCaseDialog({ open, onClose, onSubmit, stages, defaultPipeline, editCard }: AddCaseDialogProps) {
  const isEdit = !!editCard;
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState<AddCaseForm>({
    companyId: '', pipeline: defaultPipeline, columnId: stages[0]?.id ?? '',
    urgency: 'medium', visaExpiryDate: '', durationDays: '', createdDate: today, notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AddCaseForm, string>>>({});

  useEffect(() => {
    if (!open) return;
    if (editCard) {
      const resolvedId = editCard.companyId ?? tbStore.clients.find((c) => c.companyName === editCard.companyName)?.id ?? '';
      setForm({
        companyId: resolvedId, pipeline: editCard.pipeline, columnId: editCard.column,
        urgency: editCard.urgency, visaExpiryDate: editCard.visaExpiryDate ?? '',
        durationDays: editCard.durationDays != null ? String(editCard.durationDays) : '',
        createdDate: editCard.createdDate, notes: editCard.notes ?? '',
      });
    } else {
      setForm({ companyId: '', pipeline: defaultPipeline, columnId: stages[0]?.id ?? '', urgency: 'medium', visaExpiryDate: '', durationDays: '', createdDate: today, notes: '' });
    }
    setErrors({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const selectedCompany = tbStore.clients.find((c) => c.id === form.companyId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const directorNames = useMemo(() => selectedCompany?.directors.map((d) => d.name) ?? [], [form.companyId]);

  const handleChange = useCallback(<K extends keyof AddCaseForm>(field: K, value: AddCaseForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const e: Partial<Record<keyof AddCaseForm, string>> = {};
    if (!form.companyId) e.companyId = 'Select a company';
    if (!form.columnId) e.columnId = 'Select a stage';
    if (!form.createdDate) e.createdDate = 'Created date is required';
    if (form.durationDays && (isNaN(Number(form.durationDays)) || Number(form.durationDays) <= 0)) {
      e.durationDays = 'Enter a positive number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = useCallback(() => {
    if (!validate() || !selectedCompany) return;
    onSubmit({
      pipeline: form.pipeline, column: form.columnId, companyId: form.companyId,
      companyName: selectedCompany.companyName, thaiRegNumber: selectedCompany.thaiRegNumber,
      directorNames, urgency: form.urgency,
      visaExpiryDate: form.visaExpiryDate || undefined,
      durationDays: form.durationDays ? Number(form.durationDays) : undefined,
      createdDate: form.createdDate, notes: form.notes.trim() || undefined,
    });
  }, [form, validate, selectedCompany, directorNames, onSubmit]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Case' : 'Add Case'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <FormControl fullWidth error={!!errors.companyId}>
            <InputLabel>Company *</InputLabel>
            <Select value={form.companyId} label="Company *" onChange={(e) => handleChange('companyId', e.target.value)}>
              {tbStore.clients.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  <Box>
                    <Typography variant="body2" fontWeight="fontWeightMedium">{c.companyName}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{c.thaiRegNumber}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.companyId && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>{errors.companyId}</Typography>}
          </FormControl>

          {directorNames.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Directors (from company)</Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap">
                {directorNames.map((name) => <Chip key={name} size="small" label={name} sx={{ mb: 0.75 }} />)}
              </Stack>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Pipeline *</Typography>
            <ToggleButtonGroup exclusive value={form.pipeline} onChange={(_, val) => val && handleChange('pipeline', val)} size="small" fullWidth>
              <ToggleButton value="company_registration">Company Registration</ToggleButton>
              <ToggleButton value="visa_work_permit">Visa / Work Permit</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <FormControl fullWidth size="small" error={!!errors.columnId}>
            <InputLabel>{isEdit ? 'Stage *' : 'Initial Stage *'}</InputLabel>
            <Select value={form.columnId} label={isEdit ? 'Stage *' : 'Initial Stage *'} onChange={(e) => handleChange('columnId', e.target.value)}>
              {stages.map((s) => <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>)}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Urgency *</Typography>
            <ToggleButtonGroup exclusive value={form.urgency} onChange={(_, val) => val && handleChange('urgency', val as UrgencyLevel)} size="small">
              <ToggleButton value="high" sx={{ '&.Mui-selected': { bgcolor: '#FEE2E2', color: '#991B1B' } }}>High</ToggleButton>
              <ToggleButton value="medium" sx={{ '&.Mui-selected': { bgcolor: '#FEF3C7', color: '#92400E' } }}>Medium</ToggleButton>
              <ToggleButton value="low" sx={{ '&.Mui-selected': { bgcolor: '#D1FAE5', color: '#065F46' } }}>Low</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth size="small" type="date" label="Created Date *" value={form.createdDate} onChange={(e) => handleChange('createdDate', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} error={!!errors.createdDate} helperText={errors.createdDate ?? 'Defaults to today'} />
            <TextField fullWidth size="small" type="number" label="Duration (days)" value={form.durationDays} onChange={(e) => handleChange('durationDays', e.target.value)} slotProps={{ input: { inputProps: { min: 1 } } }} error={!!errors.durationDays} helperText={errors.durationDays ?? 'Leave blank → shows "–"'} />
          </Stack>

          <TextField fullWidth size="small" type="date" label="Visa / Permit Expiry Date" value={form.visaExpiryDate} onChange={(e) => handleChange('visaExpiryDate', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} helperText="Optional" />
          <TextField fullWidth size="small" multiline rows={2} label="Notes" value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Internal notes…" />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!form.companyId}>{isEdit ? 'Save Changes' : 'Add Case'}</Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
// Main view

export function TBKanbanView() {
  const { isSuperAdmin } = useAuth();
  const canEdit = isSuperAdmin();

  const [activePipeline, setActivePipeline] = useState<KanbanPipeline>('company_registration');
  const [filterCompanyName, setFilterCompanyName] = useState<string | null>(null);
  const [filterUrgency, setFilterUrgency] = useState<UrgencyLevel | 'all'>('all');
  const [sortByDeadline, setSortByDeadline] = useState(false);
  const [stages, setStages] = useState<KanbanStage[]>(() => [...tbStore.stages]);
  const [cards, setCards] = useState<KanbanCard[]>(() => [...tbStore.kanbanCards]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addCaseOpen, setAddCaseOpen] = useState(false);
  const [addStageOpen, setAddStageOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [notification, setNotification] = useState<{ msg: string; severity: 'success' | 'error' | 'info' } | null>(null);

  // Companies in the CR pipeline (for company filter)
  const crCompanies = useMemo(() => {
    const map = new Map<string, number>();
    cards.filter((c) => c.pipeline === 'company_registration')
      .forEach((c) => map.set(c.companyName, (map.get(c.companyName) ?? 0) + 1));
    return Array.from(map.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
  }, [cards]);

  // Filtered + sorted cards
  const filteredCards = useMemo(() => {
    let result = cards;
    if (filterCompanyName && activePipeline === 'company_registration') {
      result = result.filter((c) => c.companyName === filterCompanyName);
    }
    if (filterUrgency !== 'all') {
      result = result.filter((c) => c.urgency === filterUrgency);
    }
    if (sortByDeadline) {
      result = [...result].sort((a, b) => (a.durationDays ?? Infinity) - (b.durationDays ?? Infinity));
    }
    return result;
  }, [cards, filterCompanyName, filterUrgency, sortByDeadline, activePipeline]);

  const hasActiveFilters = filterCompanyName !== null || filterUrgency !== 'all' || sortByDeadline;

  const handleTabChange = useCallback((_: React.SyntheticEvent, val: KanbanPipeline) => {
    setActivePipeline(val);
    setFilterCompanyName(null);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterCompanyName(null);
    setFilterUrgency('all');
    setSortByDeadline(false);
  }, []);

  const handleCardMoved = useCallback(() => {
    setCards([...tbStore.kanbanCards]);
    setHasChanges(true);
  }, []);

  const handleStageMoved = useCallback((reordered: KanbanStage[]) => {
    reorderKanbanStages(reordered.map((s) => s.id));
    setStages([...tbStore.stages]);
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setHasChanges(false);
      setNotification({ msg: 'Pipeline changes saved.', severity: 'success' });
    }, 800);
  }, []);

  const handleSaveStageLabel = useCallback((stageId: string, label: string) => {
    updateKanbanStage(stageId, label);
    setStages([...tbStore.stages]);
    setNotification({ msg: `Stage renamed to "${label}".`, severity: 'info' });
  }, []);

  const handleDeleteStage = useCallback((stageId: string) => {
    const ok = deleteKanbanStage(stageId);
    if (ok) {
      setStages([...tbStore.stages]);
      setNotification({ msg: 'Stage deleted.', severity: 'info' });
    } else {
      setNotification({ msg: 'Move all cases out of this stage before deleting.', severity: 'error' });
    }
  }, []);

  const handleAddStage = useCallback((label: string) => {
    addKanbanStage(label);
    setStages([...tbStore.stages]);
    setAddStageOpen(false);
    setNotification({ msg: `Stage "${label}" added.`, severity: 'success' });
  }, []);

  const handleAddCase = useCallback((card: Omit<KanbanCard, 'id'>) => {
    addKanbanCard(card);
    setCards([...tbStore.kanbanCards]);
    setAddCaseOpen(false);
    setHasChanges(true);
    const stageName = stages.find((s) => s.id === card.column)?.label ?? card.column;
    setNotification({ msg: `Case added to "${stageName}".`, severity: 'success' });
  }, [stages]);

  const handleEditCase = useCallback((card: Omit<KanbanCard, 'id'>) => {
    if (!editingCard) return;
    editKanbanCard(editingCard.id, card);
    setCards([...tbStore.kanbanCards]);
    setEditingCard(null);
    setHasChanges(true);
    setNotification({ msg: 'Case updated.', severity: 'success' });
  }, [editingCard]);

  return (
    <DashboardContent maxWidth={false}>
      {/* Page header */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Kanban Pipelines</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {canEdit
              ? 'Drag the ≡ handle to reorder stages · drag cards to move or reorder within a stage'
              : 'View-only — only Super Admins can manage cases and stages.'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0, mt: 0.5 }}>
          {canEdit && (
            <>
              <Button variant="outlined" startIcon={<Iconify icon="mingcute:add-line" width={16} />} onClick={() => setAddCaseOpen(true)}>
                Add Case
              </Button>
              <Button variant="contained" disabled={!hasChanges || saving} onClick={handleSave}>
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      {!canEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Only Super Admins can add cases or modify pipeline stages. You are in view-only mode.
        </Alert>
      )}

      {/* Pipeline tabs */}
      <Tabs value={activePipeline} onChange={handleTabChange} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        {PIPELINE_TABS.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={
              <Stack direction="row" spacing={0.75} alignItems="center">
                <span>{tab.label}</span>
                <Chip size="small" label={cards.filter((c) => c.pipeline === tab.id).length} sx={{ height: 18, fontSize: 10 }} />
              </Stack>
            }
          />
        ))}
      </Tabs>

      {/* Filter bar */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        spacing={1.5}
        flexWrap="wrap"
        sx={{ py: 2 }}
      >
        {/* Company filter — CR tab only */}
        {activePipeline === 'company_registration' && (
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel shrink>Company</InputLabel>
            <Select
              notched displayEmpty
              value={filterCompanyName ?? ''}
              label="Company"
              onChange={(e) => setFilterCompanyName(e.target.value || null)}
            >
              <MenuItem value="">
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                  <Typography variant="body2">All Companies</Typography>
                  <Chip size="small" label={cards.filter((c) => c.pipeline === 'company_registration').length} sx={{ height: 18, fontSize: 10, ml: 1 }} />
                </Stack>
              </MenuItem>
              {crCompanies.map(({ name, count }) => (
                <MenuItem key={name} value={name}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{name}</Typography>
                    <Chip size="small" label={count} sx={{ height: 18, fontSize: 10, ml: 1, flexShrink: 0 }} />
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, ...(activePipeline !== 'company_registration' && { display: 'none' }) }} />

        {/* Urgency filter */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel shrink>Urgency</InputLabel>
          <Select
            notched
            displayEmpty
            value={filterUrgency}
            label="Urgency"
            onChange={(e) => setFilterUrgency(e.target.value as UrgencyLevel | 'all')}
            renderValue={(val) => {
              const DOT: Record<string, string> = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' };
              const LABEL: Record<string, string> = { all: 'All', high: 'High', medium: 'Medium', low: 'Low' };
              return (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  {val !== 'all' && (
                    <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: DOT[val], flexShrink: 0 }} />
                  )}
                  <span>{LABEL[val] ?? 'All'}</span>
                </Stack>
              );
            }}
          >
            <MenuItem value="all">All Urgencies</MenuItem>
            {([['high', '#EF4444', 'High'], ['medium', '#F59E0B', 'Medium'], ['low', '#10B981', 'Low']] as const).map(([val, color, label]) => (
              <MenuItem key={val} value={val}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                  <span>{label}</span>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Deadline sort */}
        <Button
          size="small"
          variant={sortByDeadline ? 'contained' : 'outlined'}
          startIcon={<Iconify icon="solar:clock-circle-outline" width={15} />}
          onClick={() => setSortByDeadline((v) => !v)}
        >
          Closest Deadline
        </Button>

        {/* Clear all */}
        {hasActiveFilters && (
          <Button size="small" color="inherit" startIcon={<Iconify icon="mingcute:close-line" width={14} />} onClick={handleClearFilters}>
            Clear
          </Button>
        )}

        {hasActiveFilters && (
          <Typography variant="caption" color="text.secondary">
            {filteredCards.filter((c) => c.pipeline === activePipeline).length} of {cards.filter((c) => c.pipeline === activePipeline).length} cases
          </Typography>
        )}
      </Stack>

      {/* Board */}
      <KanbanBoard
        pipeline={activePipeline}
        stages={stages}
        cards={filteredCards}
        canEdit={canEdit}
        onCardMoved={handleCardMoved}
        onStageMoved={handleStageMoved}
        onSaveStageLabel={handleSaveStageLabel}
        onDeleteStage={handleDeleteStage}
        onAddStage={() => setAddStageOpen(true)}
        onEditCard={setEditingCard}
      />

      {/* Dialogs */}
      <AddStageDialog open={addStageOpen} onClose={() => setAddStageOpen(false)} onSubmit={handleAddStage} />
      <AddCaseDialog open={addCaseOpen} onClose={() => setAddCaseOpen(false)} onSubmit={handleAddCase} stages={stages} defaultPipeline={activePipeline} />
      <AddCaseDialog open={!!editingCard} onClose={() => setEditingCard(null)} onSubmit={handleEditCase} stages={stages} defaultPipeline={activePipeline} editCard={editingCard ?? undefined} />

      <Snackbar open={!!notification} autoHideDuration={3500} onClose={() => setNotification(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {notification ? (
          <Alert severity={notification.severity} onClose={() => setNotification(null)} sx={{ width: '100%' }}>{notification.msg}</Alert>
        ) : undefined}
      </Snackbar>
    </DashboardContent>
  );
}
