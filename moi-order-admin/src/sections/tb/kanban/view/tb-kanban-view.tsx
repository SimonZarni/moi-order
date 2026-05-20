import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';

import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState, useEffect, useCallback } from 'react';
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
import Divider from '@mui/material/Divider';
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
  MACRO_STAGES,
  addKanbanCard,
  editKanbanCard,
  reorderKanbanCards,
  moveKanbanCardMacro,
  moveKanbanCardStage,
  getMacroStageFromCardStage,
} from '../../shared/tb-mock-store';

import type {
  CardStage,
  KanbanCard,
  MacroStage,
  UrgencyLevel,
  KanbanPipeline,
} from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

const URGENCY_COLOR: Record<UrgencyLevel, 'error' | 'warning' | 'success'> = {
  high: 'error', medium: 'warning', low: 'success',
};

const PIPELINE_TABS: { id: KanbanPipeline; label: string }[] = [
  { id: 'company_registration', label: 'Company Registration' },
  { id: 'visa_work_permit', label: 'Visa / Work Permit Extensions' },
];

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

// ----------------------------------------------------------------------
// Shared card body

function CardBody({ card, canEdit, onEditCard }: { card: KanbanCard; canEdit: boolean; onEditCard: (c: KanbanCard) => void }) {
  const currentStageLabel = card.cardStages.find((s) => s.id === card.currentCardStageId)?.label;
  const stageIdx = card.cardStages.findIndex((s) => s.id === card.currentCardStageId);
  const total = card.cardStages.length;

  return (
    <>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="body2" fontWeight="fontWeightSemiBold" noWrap sx={{ flex: 1, mr: 0.5 }}>
          {card.companyName}
        </Typography>
        {canEdit && (
          <Tooltip title="Edit case">
            <IconButton size="small" sx={{ p: 0.25, mt: -0.25, flexShrink: 0, opacity: 0.5 }}
              onClick={(e) => { e.stopPropagation(); onEditCard(card); }}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <Iconify icon="solar:pen-bold" width={13} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }} noWrap>
        {card.directorNames.join(' · ')}
      </Typography>

      {/* Current stage indicator */}
      {currentStageLabel && total > 0 && (
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
          <Typography variant="caption" color="primary.main" fontWeight="fontWeightMedium" noWrap>
            {stageIdx + 1}/{total} · {currentStageLabel}
          </Typography>
        </Stack>
      )}

      {card.notes && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontStyle: 'italic' }} noWrap>
          {card.notes}
        </Typography>
      )}

      <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
        <Label color={URGENCY_COLOR[card.urgency]}>{card.urgency.toUpperCase()}</Label>
        {card.visaExpiryDate && <Chip size="small" label={`Visa: ${fDate(card.visaExpiryDate)}`} sx={{ height: 20, fontSize: 10 }} />}
        {card.durationDays != null && <Chip size="small" label={`${card.durationDays}d`} sx={{ height: 20, fontSize: 10 }} />}
      </Stack>

      <Typography variant="caption" color="text.disabled">Created {fDate(card.createdDate)}</Typography>
    </>
  );
}

// ----------------------------------------------------------------------
// Sortable card

type DraggableCardProps = { card: KanbanCard; columnId: string; canEdit: boolean; onEditCard: (c: KanbanCard) => void };

function DraggableCard({ card, columnId, canEdit, onEditCard }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled: !canEdit,
    data: { type: 'card', column: columnId },
  });
  return (
    <Paper ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} elevation={1}
      sx={{ p: 2, borderRadius: 1.5, userSelect: 'none', opacity: isDragging ? 0.3 : 1, cursor: canEdit ? 'grab' : 'default', touchAction: canEdit ? 'none' : 'auto', '&:active': { cursor: canEdit ? 'grabbing' : 'default' } }}
      {...attributes} {...listeners}
    >
      <CardBody card={card} canEdit={canEdit} onEditCard={onEditCard} />
    </Paper>
  );
}

function CardOverlay({ card }: { card: KanbanCard }) {
  return (
    <Paper elevation={8} sx={{ p: 2, borderRadius: 1.5, userSelect: 'none', cursor: 'grabbing', width: 250 }}>
      <CardBody card={card} canEdit={false} onEditCard={() => {}} />
    </Paper>
  );
}

// ----------------------------------------------------------------------
// Column (shared for both default macro and filtered card-stage views)

type BoardColumn = { id: string; label: string };

type ColumnProps = {
  col: BoardColumn;
  cards: KanbanCard[];
  canEdit: boolean;
  isCardOver: boolean;
  onEditCard: (card: KanbanCard) => void;
  // stage drag handle props (only in default view)
  stageHandleAttrs?: ReturnType<typeof useSortable>['attributes'];
  stageHandleListeners?: ReturnType<typeof useSortable>['listeners'];
  stageTransform?: ReturnType<typeof useSortable>['transform'];
  stageTransition?: ReturnType<typeof useSortable>['transition'];
  stageIsDragging?: boolean;
  setColRef?: (el: HTMLElement | null) => void;
};

function KanbanColumn({
  col, cards, canEdit, isCardOver, onEditCard,
  stageHandleAttrs, stageHandleListeners, stageTransform, stageTransition, stageIsDragging, setColRef,
}: ColumnProps) {
  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);

  return (
    <Box
      ref={setColRef}
      style={{ transform: CSS.Transform.toString(stageTransform ?? null), transition: stageTransition }}
      sx={{
        flex: '1 1 240px', minWidth: 240, borderRadius: 2, p: 1.5,
        opacity: stageIsDragging ? 0.5 : 1,
        bgcolor: isCardOver && canEdit ? 'action.selected' : 'background.neutral',
        border: '2px dashed', borderColor: isCardOver && canEdit ? 'primary.main' : 'transparent',
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5, px: 0.5 }}>
        {canEdit && stageHandleListeners && (
          <Tooltip title="Drag to reorder">
            <Box {...stageHandleAttrs} {...stageHandleListeners}
              sx={{ display: 'flex', alignItems: 'center', cursor: 'grab', color: 'text.disabled', flexShrink: 0, touchAction: 'none', '&:active': { cursor: 'grabbing' } }}
            >
              <Iconify icon="custom:menu-duotone" width={14} />
            </Box>
          </Tooltip>
        )}
        <Typography variant="subtitle2" color="text.secondary" sx={{ flexGrow: 1 }}>{col.label}</Typography>
        <Chip size="small" label={cards.length} sx={{ height: 20, fontSize: 11, bgcolor: 'background.paper' }} />
      </Stack>

      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <Stack spacing={1.5}>
          {cards.map((card) => (
            <DraggableCard key={card.id} card={card} columnId={col.id} canEdit={canEdit} onEditCard={onEditCard} />
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

// Sortable wrapper for default-view macro columns (adds useSortable)
function SortableMacroColumn({ col, ...rest }: { col: BoardColumn } & Omit<ColumnProps, 'stageHandleAttrs' | 'stageHandleListeners' | 'stageTransform' | 'stageTransition' | 'stageIsDragging' | 'setColRef'>) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: col.id, data: { type: 'stage' },
  });
  return (
    <KanbanColumn
      col={col} {...rest}
      setColRef={setNodeRef}
      stageHandleAttrs={attributes}
      stageHandleListeners={listeners}
      stageTransform={transform}
      stageTransition={transition}
      stageIsDragging={isDragging}
    />
  );
}

// ----------------------------------------------------------------------
// Board

type KanbanBoardProps = {
  pipeline: KanbanPipeline;
  columns: BoardColumn[];
  cards: KanbanCard[];
  isFilteredView: boolean;
  filterCompanyName: string | null;
  canEdit: boolean;
  onCardMoved: () => void;
  onEditCard: (card: KanbanCard) => void;
};

function KanbanBoard({ pipeline, columns, cards, isFilteredView, filterCompanyName, canEdit, onCardMoved, onEditCard }: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const [macroOrder, setMacroOrder] = useState<BoardColumn[]>(columns);
  const colIds = useMemo(() => macroOrder.map((c) => c.id), [macroOrder]);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
  const [cardOverColId, setCardOverColId] = useState<string | null>(null);

  // sync macroOrder when columns prop changes (e.g. filtered view switch)
  useEffect(() => { setMacroOrder(columns); }, [columns]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === 'card') {
      setActiveCard(cards.find((c) => c.id === event.active.id) ?? null);
    }
  }, [cards]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    if (event.active.data.current?.type === 'card') {
      setCardOverColId(event.over ? (event.over.id as string) : null);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveCard(null);
    setCardOverColId(null);
    const { active, over } = event;
    if (!over || !canEdit) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'stage' && !isFilteredView) {
      // Reorder macro columns
      const oi = macroOrder.findIndex((c) => c.id === active.id);
      const ni = macroOrder.findIndex((c) => c.id === over.id);
      if (oi !== ni) setMacroOrder(arrayMove([...macroOrder], oi, ni));
    } else if (activeType === 'card') {
      if (!cards.find((c) => c.id === active.id)) return;

      if (overType === 'card') {
        const overCard = cards.find((c) => c.id === over.id);
        if (!overCard) return;
        const activeCol = active.data.current?.column as string;
        const overCol = overCard ? (isFilteredView ? overCard.currentCardStageId : overCard.macroStage) : null;

        if (activeCol === over.data.current?.column) {
          reorderKanbanCards(active.id as string, over.id as string);
        } else if (overCard && activeCol !== overCol) {
          if (isFilteredView) {
            moveKanbanCardStage(active.id as string, overCard.currentCardStageId);
          } else {
            moveKanbanCardMacro(active.id as string, overCard.macroStage);
          }
        }
      } else if (overType === 'stage') {
        if (isFilteredView) {
          moveKanbanCardStage(active.id as string, over.id as string);
        } else {
          moveKanbanCardMacro(active.id as string, over.id as MacroStage);
        }
      }
      onCardMoved();
    }
  }, [canEdit, macroOrder, cards, isFilteredView, onCardMoved]);

  const getColCards = useCallback((colId: string) => {
    if (isFilteredView) {
      return cards.filter(
        (c) => c.pipeline === pipeline && c.companyName === filterCompanyName && c.currentCardStageId === colId
      );
    }
    return cards.filter((c) => c.pipeline === pipeline && c.macroStage === colId);
  }, [cards, pipeline, isFilteredView, filterCompanyName]);

  const displayCols = isFilteredView ? columns : macroOrder;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <SortableContext items={colIds} strategy={horizontalListSortingStrategy}>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, alignItems: 'flex-start' }}>
          {displayCols.map((col) =>
            isFilteredView ? (
              // Filtered view: static columns (no stage drag handle)
              <KanbanColumn key={col.id} col={col} cards={getColCards(col.id)} canEdit={canEdit} isCardOver={cardOverColId === col.id} onEditCard={onEditCard} />
            ) : (
              // Default view: sortable macro columns
              <SortableMacroColumn key={col.id} col={col} cards={getColCards(col.id)} canEdit={canEdit} isCardOver={cardOverColId === col.id} onEditCard={onEditCard} />
            )
          )}
        </Box>
      </SortableContext>
      <DragOverlay>{activeCard ? <CardOverlay card={activeCard} /> : null}</DragOverlay>
    </DndContext>
  );
}

// ----------------------------------------------------------------------
// Add / Edit Case dialog (multi-step)

type CustomStage = { id: string; label: string };

type AddCaseForm = {
  companyId: string;
  pipeline: KanbanPipeline;
  templateId: string;
  customStages: CustomStage[];
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
  defaultPipeline: KanbanPipeline;
  editCard?: KanbanCard;
};

function AddCaseDialog({ open, onClose, onSubmit, defaultPipeline, editCard }: AddCaseDialogProps) {
  const isEdit = !!editCard;
  const today = new Date().toISOString().slice(0, 10);
  const [tab, setTab] = useState(0);

  const [form, setForm] = useState<AddCaseForm>({
    companyId: '', pipeline: defaultPipeline, templateId: '', customStages: [],
    urgency: 'medium', visaExpiryDate: '', durationDays: '', createdDate: today, notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    if (!open) return;
    setTab(0);
    if (editCard) {
      const resolvedId = editCard.companyId ?? tbStore.clients.find((c) => c.companyName === editCard.companyName)?.id ?? '';
      setForm({
        companyId: resolvedId,
        pipeline: editCard.pipeline,
        templateId: editCard.templateId ?? 'custom',
        customStages: editCard.cardStages.map((s) => ({ id: s.id, label: s.label })),
        urgency: editCard.urgency,
        visaExpiryDate: editCard.visaExpiryDate ?? '',
        durationDays: editCard.durationDays != null ? String(editCard.durationDays) : '',
        createdDate: editCard.createdDate,
        notes: editCard.notes ?? '',
      });
    } else {
      setForm({ companyId: '', pipeline: defaultPipeline, templateId: '', customStages: [], urgency: 'medium', visaExpiryDate: '', durationDays: '', createdDate: today, notes: '' });
    }
    setErrors({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const selectedCompany = tbStore.clients.find((c) => c.id === form.companyId);
  const directorNames = useMemo(() => selectedCompany?.directors.map((d) => d.name) ?? [], [selectedCompany]);

  const pipelineTemplates = useMemo(
    () => tbStore.stageTemplates.filter((t) => t.pipeline === form.pipeline || t.pipeline === 'any'),
    [form.pipeline]
  );

  const handleChange = useCallback(<K extends keyof AddCaseForm>(field: K, value: AddCaseForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSelectTemplate = useCallback((templateId: string) => {
    const tpl = tbStore.stageTemplates.find((t) => t.id === templateId);
    setForm((prev) => ({
      ...prev,
      templateId,
      customStages: templateId === 'custom' ? [{ id: genId(), label: '' }] : (tpl?.stages.map((s) => ({ id: genId(), label: s.label })) ?? []),
    }));
  }, []);

  const handleAddStage = useCallback(() => {
    setForm((prev) => ({ ...prev, customStages: [...prev.customStages, { id: genId(), label: '' }] }));
  }, []);

  const handleRemoveStage = useCallback((id: string) => {
    setForm((prev) => ({ ...prev, customStages: prev.customStages.filter((s) => s.id !== id) }));
  }, []);

  const handleStageLabel = useCallback((id: string, label: string) => {
    setForm((prev) => ({ ...prev, customStages: prev.customStages.map((s) => s.id === id ? { ...s, label } : s) }));
  }, []);

  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!form.companyId) e.companyId = 'Select a company';
    if (!form.templateId) e.templateId = 'Choose a workflow';
    if (form.customStages.length === 0) e.stages = 'Add at least one stage';
    if (form.customStages.some((s) => !s.label.trim())) e.stages = 'All stages must have a name';
    if (!form.createdDate) e.createdDate = 'Required';
    if (form.durationDays && (isNaN(Number(form.durationDays)) || Number(form.durationDays) <= 0)) e.durationDays = 'Enter a positive number';
    setErrors(e);
    if (e.companyId || e.templateId || e.stages) { setTab(0); return false; }
    if (e.createdDate || e.durationDays) { setTab(1); return false; }
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = useCallback(() => {
    if (!validate() || !selectedCompany) return;
    const cardStages: CardStage[] = form.customStages.map((s, i) => ({ id: s.id, label: s.label.trim(), order: i }));
    const currentCardStageId = cardStages[0]?.id ?? '';
    onSubmit({
      pipeline: form.pipeline,
      macroStage: getMacroStageFromCardStage(cardStages, currentCardStageId),
      cardStages,
      currentCardStageId,
      templateId: form.templateId === 'custom' ? undefined : form.templateId,
      companyId: form.companyId,
      companyName: selectedCompany.companyName,
      thaiRegNumber: selectedCompany.thaiRegNumber,
      directorNames,
      urgency: form.urgency,
      visaExpiryDate: form.visaExpiryDate || undefined,
      durationDays: form.durationDays ? Number(form.durationDays) : undefined,
      createdDate: form.createdDate,
      notes: form.notes.trim() || undefined,
    });
  }, [form, validate, selectedCompany, directorNames, onSubmit]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Case' : 'Add Case'}</DialogTitle>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tab label={
          <Stack direction="row" spacing={0.5} alignItems="center">
            <span>Workflow</span>
            {(errors.companyId || errors.templateId || errors.stages) && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main' }} />}
          </Stack>
        } />
        <Tab label={
          <Stack direction="row" spacing={0.5} alignItems="center">
            <span>Details</span>
            {(errors.createdDate || errors.durationDays) && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main' }} />}
          </Stack>
        } />
      </Tabs>

      <DialogContent dividers sx={{ minHeight: 400, maxHeight: '60vh' }}>

        {tab === 0 && (
          <Stack spacing={3}>
            {/* Company */}
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

            {/* Pipeline */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Pipeline *</Typography>
              <ToggleButtonGroup exclusive value={form.pipeline} onChange={(_, val) => val && handleChange('pipeline', val)} size="small" fullWidth>
                <ToggleButton value="company_registration">Company Registration</ToggleButton>
                <ToggleButton value="visa_work_permit">Visa / Work Permit</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Divider />

            {/* Template selection */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Workflow Stages *</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Choose a template or define custom stages for this company.
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                {pipelineTemplates.map((tpl) => (
                  <Paper
                    key={tpl.id}
                    elevation={0}
                    onClick={() => handleSelectTemplate(tpl.id)}
                    sx={{
                      p: 1.5, borderRadius: 1.5, cursor: 'pointer',
                      border: '2px solid', borderColor: form.templateId === tpl.id ? 'primary.main' : 'divider',
                      bgcolor: form.templateId === tpl.id ? 'primary.lighter' : 'background.paper',
                      '&:hover': { borderColor: 'primary.light' },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" fontWeight="fontWeightMedium">{tpl.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tpl.stages.map((s) => s.label).join(' → ')}
                        </Typography>
                      </Box>
                      {tpl.isDefault && <Chip size="small" label="Default" sx={{ fontSize: 10, height: 20 }} />}
                    </Stack>
                  </Paper>
                ))}
                <Paper
                  elevation={0}
                  onClick={() => handleSelectTemplate('custom')}
                  sx={{
                    p: 1.5, borderRadius: 1.5, cursor: 'pointer',
                    border: '2px solid', borderColor: form.templateId === 'custom' ? 'primary.main' : 'divider',
                    bgcolor: form.templateId === 'custom' ? 'primary.lighter' : 'background.paper',
                    '&:hover': { borderColor: 'primary.light' },
                  }}
                >
                  <Typography variant="body2" fontWeight="fontWeightMedium">Custom Stages</Typography>
                  <Typography variant="caption" color="text.secondary">Define your own workflow for this company</Typography>
                </Paper>
              </Stack>
              {errors.templateId && <Typography variant="caption" color="error">{errors.templateId}</Typography>}
            </Box>

            {/* Stage editor — shown after template or custom is selected */}
            {form.templateId && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {form.templateId === 'custom' ? 'Define Stages' : 'Edit Stages'}
                </Typography>
                {errors.stages && <Alert severity="error" sx={{ mb: 1 }}>{errors.stages}</Alert>}
                <Stack spacing={1}>
                  {form.customStages.map((stage, idx) => (
                    <Stack key={stage.id} direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" color="text.disabled" sx={{ minWidth: 20 }}>{idx + 1}.</Typography>
                      <TextField
                        size="small" fullWidth value={stage.label}
                        onChange={(e) => handleStageLabel(stage.id, e.target.value)}
                        placeholder="Stage name…"
                      />
                      <IconButton size="small" onClick={() => handleRemoveStage(stage.id)} disabled={form.customStages.length <= 1}>
                        <Iconify icon="solar:trash-bin-trash-bold" width={14} sx={{ color: form.customStages.length > 1 ? 'error.main' : 'text.disabled' }} />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button size="small" startIcon={<Iconify icon="mingcute:add-line" width={14} />} onClick={handleAddStage} sx={{ alignSelf: 'flex-start' }}>
                    Add Stage
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        )}

        {tab === 1 && (
          <Stack spacing={3}>
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

            <TextField fullWidth size="small" type="date" label="Visa / Permit Expiry" value={form.visaExpiryDate} onChange={(e) => handleChange('visaExpiryDate', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} helperText="Optional" />
            <TextField fullWidth size="small" multiline rows={2} label="Notes" value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Internal notes…" />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Stack direction="row" spacing={1}>
          {tab > 0 && <Button variant="outlined" onClick={() => setTab(0)}>Back</Button>}
          {tab === 0 ? (
            <Button variant="contained" onClick={() => setTab(1)} disabled={!form.companyId || !form.templateId || form.customStages.length === 0}>
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Add Case'}</Button>
          )}
        </Stack>
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
  const [cards, setCards] = useState<KanbanCard[]>(() => [...tbStore.kanbanCards]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addCaseOpen, setAddCaseOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [notification, setNotification] = useState<{ msg: string; severity: 'success' | 'error' | 'info' } | null>(null);

  // Companies in the CR pipeline (for company filter)
  const crCompanies = useMemo(() => {
    const map = new Map<string, number>();
    cards.filter((c) => c.pipeline === 'company_registration').forEach((c) => map.set(c.companyName, (map.get(c.companyName) ?? 0) + 1));
    return Array.from(map.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
  }, [cards]);

  // When filtered to a company, use their card's stages as the board columns
  const filteredCompanyColumns = useMemo<BoardColumn[] | null>(() => {
    if (!filterCompanyName) return null;
    const companyCard = cards.find((c) => c.companyName === filterCompanyName && c.pipeline === activePipeline);
    return companyCard ? companyCard.cardStages.map((s) => ({ id: s.id, label: s.label })) : null;
  }, [cards, filterCompanyName, activePipeline]);

  const isFilteredView = !!filteredCompanyColumns;
  const boardColumns: BoardColumn[] = filteredCompanyColumns ?? MACRO_STAGES;

  const filteredCards = useMemo(() => {
    let result = cards;
    if (filterUrgency !== 'all') result = result.filter((c) => c.urgency === filterUrgency);
    if (sortByDeadline) result = [...result].sort((a, b) => (a.durationDays ?? Infinity) - (b.durationDays ?? Infinity));
    return result;
  }, [cards, filterUrgency, sortByDeadline]);

  const hasActiveFilters = filterUrgency !== 'all' || sortByDeadline || !!filterCompanyName;

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

  const handleSave = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setHasChanges(false);
      setNotification({ msg: 'Pipeline changes saved.', severity: 'success' });
    }, 800);
  }, []);

  const handleAddCase = useCallback((card: Omit<KanbanCard, 'id'>) => {
    addKanbanCard(card);
    setCards([...tbStore.kanbanCards]);
    setAddCaseOpen(false);
    setHasChanges(true);
    setNotification({ msg: `Case added for "${card.companyName}".`, severity: 'success' });
  }, []);

  const handleEditCase = useCallback((card: Omit<KanbanCard, 'id'>) => {
    if (!editingCard) return;
    editKanbanCard(editingCard.id, card);
    setCards([...tbStore.kanbanCards]);
    setEditingCard(null);
    setHasChanges(true);
    setNotification({ msg: 'Case updated.', severity: 'success' });
  }, [editingCard]);

  // Filtered view: show which stage the company's card is currently at
  const filteredCardCurrentStage = useMemo(() => {
    if (!filterCompanyName || !isFilteredView) return null;
    const c = cards.find((x) => x.companyName === filterCompanyName && x.pipeline === activePipeline);
    return c ? c.cardStages.find((s) => s.id === c.currentCardStageId)?.label : null;
  }, [cards, filterCompanyName, activePipeline, isFilteredView]);

  return (
    <DashboardContent maxWidth={false}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Kanban Pipelines</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {canEdit
              ? isFilteredView
                ? `Showing ${filterCompanyName}'s stages · drag cards to advance their progress`
                : 'Default view shows macro stages · filter by company to see their custom workflow'
              : 'View-only — only Super Admins can manage cases.'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0, mt: 0.5 }}>
          {canEdit && (
            <>
              <Button variant="outlined" startIcon={<Iconify icon="mingcute:add-line" width={16} />} onClick={() => setAddCaseOpen(true)}>Add Case</Button>
              <Button variant="contained" disabled={!hasChanges || saving} onClick={handleSave}>{saving ? 'Saving…' : 'Save Changes'}</Button>
            </>
          )}
        </Stack>
      </Stack>

      {!canEdit && <Alert severity="info" sx={{ mb: 3 }}>Only Super Admins can add or manage cases. View-only mode.</Alert>}

      {/* Pipeline tabs */}
      <Tabs value={activePipeline} onChange={handleTabChange} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        {PIPELINE_TABS.map((tab) => (
          <Tab key={tab.id} value={tab.id} label={
            <Stack direction="row" spacing={0.75} alignItems="center">
              <span>{tab.label}</span>
              <Chip size="small" label={cards.filter((c) => c.pipeline === tab.id).length} sx={{ height: 18, fontSize: 10 }} />
            </Stack>
          } />
        ))}
      </Tabs>

      {/* Filter bar */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={1.5} flexWrap="wrap" sx={{ py: 2 }}>
        {/* Company filter — CR only */}
        {activePipeline === 'company_registration' && (
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel shrink>Company</InputLabel>
            <Select notched displayEmpty value={filterCompanyName ?? ''} label="Company" onChange={(e) => setFilterCompanyName(e.target.value || null)}>
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

        {/* Urgency filter */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel shrink>Urgency</InputLabel>
          <Select notched displayEmpty value={filterUrgency} label="Urgency"
            onChange={(e) => setFilterUrgency(e.target.value as UrgencyLevel | 'all')}
            renderValue={(val) => {
              const DOT: Record<string, string> = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' };
              const LBL: Record<string, string> = { all: 'All', high: 'High', medium: 'Medium', low: 'Low' };
              return (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  {val !== 'all' && <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: DOT[val], flexShrink: 0 }} />}
                  <span>{LBL[val] ?? 'All'}</span>
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
        <Button size="small" variant={sortByDeadline ? 'contained' : 'outlined'} startIcon={<Iconify icon="solar:clock-circle-outline" width={15} />} onClick={() => setSortByDeadline((v) => !v)}>
          Closest Deadline
        </Button>

        {hasActiveFilters && (
          <Button size="small" color="inherit" startIcon={<Iconify icon="mingcute:close-line" width={14} />} onClick={handleClearFilters}>Clear</Button>
        )}

        {/* Filtered view badge */}
        {isFilteredView && filteredCardCurrentStage && (
          <Chip
            size="small"
            label={`Current: ${filteredCardCurrentStage}`}
            sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 600 }}
          />
        )}
      </Stack>

      {/* Board */}
      <KanbanBoard
        pipeline={activePipeline}
        columns={boardColumns}
        cards={filteredCards}
        isFilteredView={isFilteredView}
        filterCompanyName={filterCompanyName}
        canEdit={canEdit}
        onCardMoved={handleCardMoved}
        onEditCard={setEditingCard}
      />

      {/* Dialogs */}
      <AddCaseDialog open={addCaseOpen} onClose={() => setAddCaseOpen(false)} onSubmit={handleAddCase} defaultPipeline={activePipeline} />
      <AddCaseDialog open={!!editingCard} onClose={() => setEditingCard(null)} onSubmit={handleEditCase} defaultPipeline={activePipeline} editCard={editingCard ?? undefined} />

      <Snackbar open={!!notification} autoHideDuration={3500} onClose={() => setNotification(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {notification ? <Alert severity={notification.severity} onClose={() => setNotification(null)} sx={{ width: '100%' }}>{notification.msg}</Alert> : undefined}
      </Snackbar>
    </DashboardContent>
  );
}
