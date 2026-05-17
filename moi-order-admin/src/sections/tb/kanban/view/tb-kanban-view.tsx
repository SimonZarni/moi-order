import type { DragEndEvent } from '@dnd-kit/core';

import { CSS } from '@dnd-kit/utilities';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
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
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
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
  addKanbanStage,
  moveKanbanCard,
  deleteKanbanStage,
  updateKanbanStage,
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
// Draggable case card

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
      <Typography variant="body2" fontWeight="fontWeightSemiBold" sx={{ mb: 0.5 }} noWrap>
        {card.companyName}
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }} noWrap>
        {card.directorNames.join(' · ')}
      </Typography>

      {card.notes && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mb: 1, fontStyle: 'italic' }}
          noWrap
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
// Droppable stage column with inline rename + delete

type DroppableColumnProps = {
  stage: KanbanStage;
  cards: KanbanCard[];
  canEdit: boolean;
  canDelete: boolean;
  onSaveLabel: (stageId: string, label: string) => void;
  onDelete: (stageId: string) => void;
};

function DroppableColumn({
  stage, cards, canEdit, canDelete, onSaveLabel, onDelete,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(stage.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(stage.label);
  }, [stage.label]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

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

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: '1 1 230px',
        minWidth: 230,
        borderRadius: 2,
        p: 1.5,
        bgcolor: isOver && canEdit ? 'action.selected' : 'background.neutral',
        border: '2px dashed',
        borderColor: isOver && canEdit ? 'primary.main' : 'transparent',
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
    >
      {/* Column header */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5, px: 0.5 }}>
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
                <Tooltip
                  title={
                    !canDelete
                      ? 'Move all cases out of this stage before deleting'
                      : 'Delete stage'
                  }
                >
                  <span>
                    <IconButton
                      size="small"
                      disabled={!canDelete}
                      onClick={() => onDelete(stage.id)}
                      sx={{ opacity: 0.6 }}
                    >
                      <Iconify
                        icon="solar:trash-bin-trash-bold"
                        width={13}
                        sx={{ color: canDelete ? 'error.main' : 'text.disabled' }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            )}

            <Chip
              size="small"
              label={cards.length}
              sx={{ height: 20, fontSize: 11, bgcolor: 'background.paper' }}
            />
          </>
        )}
      </Stack>

      {/* Cases */}
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
            {canEdit ? 'Drop cases here' : 'No cases'}
          </Typography>
        )}
      </Stack>
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
  onSaveStageLabel: (stageId: string, label: string) => void;
  onDeleteStage: (stageId: string) => void;
  onAddStage: () => void;
};

function KanbanBoard({
  pipeline, stages, cards, canEdit,
  onCardMoved, onSaveStageLabel, onDeleteStage, onAddStage,
}: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const [, setVersion] = useState(0);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || !canEdit) return;
      moveKanbanCard(active.id as string, over.id as string);
      setVersion((v) => v + 1);
      onCardMoved();
    },
    [canEdit, onCardMoved]
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, alignItems: 'flex-start' }}>
        {stages.map((stage) => {
          const stageCards = cards.filter(
            (c) => c.column === stage.id && c.pipeline === pipeline
          );
          const allCardsInStage = cards.filter((c) => c.column === stage.id);
          const canDelete = allCardsInStage.length === 0 && stages.length > 1;

          return (
            <DroppableColumn
              key={stage.id}
              stage={stage}
              cards={stageCards}
              canEdit={canEdit}
              canDelete={canDelete}
              onSaveLabel={onSaveStageLabel}
              onDelete={onDeleteStage}
            />
          );
        })}

        {canEdit && (
          <Box sx={{ flexShrink: 0, pt: 0.5 }}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" width={16} />}
              onClick={onAddStage}
              sx={{ whiteSpace: 'nowrap', minWidth: 140 }}
            >
              Add Stage
            </Button>
          </Box>
        )}
      </Box>
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
          fullWidth
          autoFocus
          label="Stage Name *"
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
// Add Case dialog

type AddCaseForm = {
  companyId: string;
  pipeline: KanbanPipeline;
  columnId: string;
  urgency: UrgencyLevel;
  visaExpiryDate: string;
  notes: string;
};

type AddCaseDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (card: Omit<KanbanCard, 'id'>) => void;
  stages: KanbanStage[];
  defaultPipeline: KanbanPipeline;
};

function AddCaseDialog({ open, onClose, onSubmit, stages, defaultPipeline }: AddCaseDialogProps) {
  const [form, setForm] = useState<AddCaseForm>({
    companyId: '',
    pipeline: defaultPipeline,
    columnId: stages[0]?.id ?? '',
    urgency: 'medium',
    visaExpiryDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AddCaseForm, string>>>({});

  useEffect(() => {
    if (open) {
      setForm({
        companyId: '',
        pipeline: defaultPipeline,
        columnId: stages[0]?.id ?? '',
        urgency: 'medium',
        visaExpiryDate: '',
        notes: '',
      });
      setErrors({});
    }
  }, [open, defaultPipeline, stages]);

  const selectedCompany = tbStore.clients.find((c) => c.id === form.companyId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const directorNames = useMemo(() => selectedCompany?.directors.map((d) => d.name) ?? [], [form.companyId]);

  const handleChange = useCallback(
    <K extends keyof AddCaseForm>(field: K, value: AddCaseForm[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof AddCaseForm, string>> = {};
    if (!form.companyId) newErrors.companyId = 'Select a company';
    if (!form.columnId) newErrors.columnId = 'Select an initial stage';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(() => {
    if (!validate() || !selectedCompany) return;

    onSubmit({
      pipeline: form.pipeline,
      column: form.columnId,
      companyId: form.companyId,
      companyName: selectedCompany.companyName,
      thaiRegNumber: selectedCompany.thaiRegNumber,
      directorNames,
      urgency: form.urgency,
      visaExpiryDate: form.visaExpiryDate || undefined,
      notes: form.notes.trim() || undefined,
    });
  }, [form, validate, selectedCompany, directorNames, onSubmit]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Case</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Company select */}
          <FormControl fullWidth error={!!errors.companyId}>
            <InputLabel>Company *</InputLabel>
            <Select
              value={form.companyId}
              label="Company *"
              onChange={(e) => handleChange('companyId', e.target.value)}
            >
              {tbStore.clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  <Box>
                    <Typography variant="body2" fontWeight="fontWeightMedium">
                      {client.companyName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      {client.thaiRegNumber}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.companyId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.companyId}
              </Typography>
            )}
          </FormControl>

          {/* Auto-populated directors */}
          {directorNames.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Directors (auto-populated from company)
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap">
                {directorNames.map((name) => (
                  <Chip key={name} size="small" label={name} sx={{ mb: 0.75 }} />
                ))}
              </Stack>
            </Box>
          )}

          {/* Pipeline */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Pipeline *
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={form.pipeline}
              onChange={(_, val) => val && handleChange('pipeline', val)}
              size="small"
              fullWidth
            >
              <ToggleButton value="company_registration">Company Registration</ToggleButton>
              <ToggleButton value="visa_work_permit">Visa / Work Permit</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Initial stage */}
          <FormControl fullWidth size="small" error={!!errors.columnId}>
            <InputLabel>Initial Stage *</InputLabel>
            <Select
              value={form.columnId}
              label="Initial Stage *"
              onChange={(e) => handleChange('columnId', e.target.value)}
            >
              {stages.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Urgency */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Urgency *
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={form.urgency}
              onChange={(_, val) => val && handleChange('urgency', val as UrgencyLevel)}
              size="small"
            >
              <ToggleButton
                value="high"
                sx={{ '&.Mui-selected': { bgcolor: '#FEE2E2', color: '#991B1B' } }}
              >
                High
              </ToggleButton>
              <ToggleButton
                value="medium"
                sx={{ '&.Mui-selected': { bgcolor: '#FEF3C7', color: '#92400E' } }}
              >
                Medium
              </ToggleButton>
              <ToggleButton
                value="low"
                sx={{ '&.Mui-selected': { bgcolor: '#D1FAE5', color: '#065F46' } }}
              >
                Low
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Visa expiry — more relevant for visa pipeline but available for both */}
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Visa / Permit Expiry Date"
            value={form.visaExpiryDate}
            onChange={(e) => handleChange('visaExpiryDate', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            helperText="Optional — used to show urgency based on expiry date"
          />

          {/* Notes */}
          <TextField
            fullWidth
            size="small"
            multiline
            rows={2}
            label="Notes"
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Internal notes, special requirements…"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!form.companyId}>
          Add Case
        </Button>
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
  const [stages, setStages] = useState<KanbanStage[]>(() => [...tbStore.stages]);
  const [cards, setCards] = useState<KanbanCard[]>(() => [...tbStore.kanbanCards]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addCaseOpen, setAddCaseOpen] = useState(false);
  const [addStageOpen, setAddStageOpen] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; severity: 'success' | 'error' | 'info' } | null>(null);

  const handleTabChange = useCallback((_: React.SyntheticEvent, val: KanbanPipeline) => {
    setActivePipeline(val);
  }, []);

  const handleCardMoved = useCallback(() => {
    setCards([...tbStore.kanbanCards]);
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setHasChanges(false);
      setNotification({ msg: 'Pipeline changes saved successfully.', severity: 'success' });
    }, 800);
  }, []);

  const handleSaveStageLabel = useCallback((stageId: string, label: string) => {
    updateKanbanStage(stageId, label);
    setStages([...tbStore.stages]);
    setNotification({ msg: `Stage renamed to "${label}".`, severity: 'info' });
  }, []);

  const handleDeleteStage = useCallback((stageId: string) => {
    const success = deleteKanbanStage(stageId);
    if (success) {
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
    setNotification({ msg: `Case added to ${stages.find(s => s.id === card.column)?.label ?? card.column}.`, severity: 'success' });
  }, [stages]);

  return (
    <DashboardContent maxWidth={false}>
      {/* Header */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Kanban Pipelines</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {canEdit
              ? 'Long-press (mobile) or drag (desktop) to move cases. Click the pencil to rename a stage.'
              : 'View-only — only Super Admins can manage cases and stages.'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0, mt: 0.5 }}>
          {canEdit && (
            <>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" width={16} />}
                onClick={() => setAddCaseOpen(true)}
              >
                Add Case
              </Button>
              <Button
                variant="contained"
                disabled={!hasChanges || saving}
                onClick={handleSave}
              >
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
      <Tabs
        value={activePipeline}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        {PIPELINE_TABS.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={
              <Stack direction="row" spacing={0.75} alignItems="center">
                <span>{tab.label}</span>
                <Chip
                  size="small"
                  label={cards.filter((c) => c.pipeline === tab.id).length}
                  sx={{ height: 18, fontSize: 10 }}
                />
              </Stack>
            }
          />
        ))}
      </Tabs>

      {/* Board */}
      <KanbanBoard
        pipeline={activePipeline}
        stages={stages}
        cards={cards}
        canEdit={canEdit}
        onCardMoved={handleCardMoved}
        onSaveStageLabel={handleSaveStageLabel}
        onDeleteStage={handleDeleteStage}
        onAddStage={() => setAddStageOpen(true)}
      />

      {/* Dialogs */}
      <AddStageDialog
        open={addStageOpen}
        onClose={() => setAddStageOpen(false)}
        onSubmit={handleAddStage}
      />

      <AddCaseDialog
        open={addCaseOpen}
        onClose={() => setAddCaseOpen(false)}
        onSubmit={handleAddCase}
        stages={stages}
        defaultPipeline={activePipeline}
      />

      {/* Notifications */}
      <Snackbar
        open={!!notification}
        autoHideDuration={3500}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notification ? (
          <Alert
            severity={notification.severity}
            onClose={() => setNotification(null)}
            sx={{ width: '100%' }}
          >
            {notification.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </DashboardContent>
  );
}
