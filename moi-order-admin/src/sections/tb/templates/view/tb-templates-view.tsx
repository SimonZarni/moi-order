import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useAuth } from 'src/context/auth-context';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import {
  tbStore,
  addStageTemplate,
  updateStageTemplate,
  deleteStageTemplate,
} from '../../shared/tb-mock-store';

import type { StageTemplate } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

const PIPELINE_LABELS: Record<StageTemplate['pipeline'], string> = {
  company_registration: 'Company Registration',
  visa_work_permit: 'Visa / Work Permit',
  any: 'Any Pipeline',
};

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

type TemplateForm = {
  name: string;
  pipeline: StageTemplate['pipeline'];
  isDefault: boolean;
  stages: { id: string; label: string }[];
};

const EMPTY_FORM: TemplateForm = {
  name: '',
  pipeline: 'company_registration',
  isDefault: false,
  stages: [{ id: genId(), label: '' }],
};

// ----------------------------------------------------------------------

function TemplateDialog({
  open, onClose, onSubmit, initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: TemplateForm) => void;
  initial?: TemplateForm;
}) {
  const [form, setForm] = useState<TemplateForm>(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const handleChange = useCallback(<K extends keyof TemplateForm>(field: K, value: TemplateForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddStage = useCallback(() => {
    setForm((prev) => ({ ...prev, stages: [...prev.stages, { id: genId(), label: '' }] }));
  }, []);

  const handleRemoveStage = useCallback((id: string) => {
    setForm((prev) => ({ ...prev, stages: prev.stages.filter((s) => s.id !== id) }));
  }, []);

  const handleStageLabel = useCallback((id: string, label: string) => {
    setForm((prev) => ({ ...prev, stages: prev.stages.map((s) => s.id === id ? { ...s, label } : s) }));
  }, []);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Template name is required';
    if (form.stages.length === 0) e.stages = 'Add at least one stage';
    if (form.stages.some((s) => !s.label.trim())) e.stages = 'All stages must have a name';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Edit Template' : 'Add Template'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <TextField
            fullWidth label="Template Name *"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="e.g. BOI Registration, Non-B Visa Extension"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Pipeline</InputLabel>
            <Select value={form.pipeline} label="Pipeline" onChange={(e) => handleChange('pipeline', e.target.value as StageTemplate['pipeline'])}>
              <MenuItem value="company_registration">Company Registration</MenuItem>
              <MenuItem value="visa_work_permit">Visa / Work Permit</MenuItem>
              <MenuItem value="any">Any Pipeline</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={<Switch checked={form.isDefault} onChange={(e) => handleChange('isDefault', e.target.checked)} />}
            label="Mark as default for this pipeline"
          />

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Stages *</Typography>
            {errors.stages && <Alert severity="error" sx={{ mb: 1 }}>{errors.stages}</Alert>}
            <Stack spacing={1}>
              {form.stages.map((stage, idx) => (
                <Stack key={stage.id} direction="row" alignItems="center" spacing={1}>
                  <Typography variant="caption" color="text.disabled" sx={{ minWidth: 20 }}>{idx + 1}.</Typography>
                  <TextField
                    size="small" fullWidth value={stage.label}
                    onChange={(e) => handleStageLabel(stage.id, e.target.value)}
                    placeholder="Stage name…"
                  />
                  <IconButton size="small" onClick={() => handleRemoveStage(stage.id)} disabled={form.stages.length <= 1}>
                    <Iconify icon="solar:trash-bin-trash-bold" width={14} sx={{ color: form.stages.length > 1 ? 'error.main' : 'text.disabled' }} />
                  </IconButton>
                </Stack>
              ))}
              <Button size="small" startIcon={<Iconify icon="mingcute:add-line" width={14} />} onClick={handleAddStage} sx={{ alignSelf: 'flex-start' }}>
                Add Stage
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{initial ? 'Save Changes' : 'Add Template'}</Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export function TBTemplatesView() {
  const { isSuperAdmin } = useAuth();
  const canEdit = isSuperAdmin();

  const [templates, setTemplates] = useState<StageTemplate[]>(() => [...tbStore.stageTemplates]);
  const [addOpen, setAddOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<StageTemplate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const refresh = useCallback(() => setTemplates([...tbStore.stageTemplates]), []);

  const handleAdd = useCallback((form: TemplateForm) => {
    addStageTemplate({ name: form.name.trim(), pipeline: form.pipeline, isDefault: form.isDefault, stages: form.stages.map((s) => ({ id: s.id, label: s.label.trim() })) });
    refresh();
    setAddOpen(false);
    setNotification(`Template "${form.name}" added.`);
  }, [refresh]);

  const handleEdit = useCallback((form: TemplateForm) => {
    if (!editingTemplate) return;
    updateStageTemplate(editingTemplate.id, { name: form.name.trim(), pipeline: form.pipeline, isDefault: form.isDefault, stages: form.stages.map((s) => ({ id: s.id, label: s.label.trim() })) });
    refresh();
    setEditingTemplate(null);
    setNotification(`Template updated.`);
  }, [editingTemplate, refresh]);

  const handleDelete = useCallback((id: string) => {
    const ok = deleteStageTemplate(id);
    if (ok) { refresh(); setNotification('Template deleted.'); }
    setDeletingId(null);
  }, [refresh]);

  const groups = [
    { label: 'Company Registration', pipeline: 'company_registration' as const },
    { label: 'Visa / Work Permit', pipeline: 'visa_work_permit' as const },
    { label: 'Any Pipeline', pipeline: 'any' as const },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Stage Templates</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Reusable stage workflows. When adding a case, choose a template or define custom stages for that company.
          </Typography>
        </Box>
        {canEdit && (
          <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" width={18} />} onClick={() => setAddOpen(true)}>
            Add Template
          </Button>
        )}
      </Stack>

      {!canEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>Only Super Admins can manage stage templates.</Alert>
      )}

      <Stack spacing={4}>
        {groups.map(({ label, pipeline }) => {
          const groupTemplates = templates.filter((t) => t.pipeline === pipeline);
          if (groupTemplates.length === 0 && !canEdit) return null;
          return (
            <Box key={pipeline}>
              <Typography variant="subtitle1" fontWeight="fontWeightSemiBold" sx={{ mb: 2, color: 'text.secondary' }}>
                {label}
              </Typography>
              <Stack spacing={2}>
                {groupTemplates.map((tpl) => (
                  <Paper key={tpl.id} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <Typography variant="body2" fontWeight="fontWeightSemiBold">{tpl.name}</Typography>
                          {tpl.isDefault && (
                            <Chip size="small" label="Default" color="primary" sx={{ height: 20, fontSize: 10 }} />
                          )}
                          <Chip
                            size="small"
                            label={`${tpl.stages.length} stages`}
                            sx={{ height: 20, fontSize: 10 }}
                          />
                        </Stack>

                        <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
                          {tpl.stages.map((s, idx) => (
                            <Stack key={s.id} direction="row" alignItems="center" spacing={0.5}>
                              <Chip
                                size="small"
                                label={s.label}
                                sx={{ height: 22, fontSize: 11, bgcolor: 'background.neutral' }}
                              />
                              {idx < tpl.stages.length - 1 && (
                                <Typography variant="caption" color="text.disabled">→</Typography>
                              )}
                            </Stack>
                          ))}
                        </Stack>
                      </Box>

                      {canEdit && (
                        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                          <IconButton size="small" onClick={() => setEditingTemplate(tpl)}>
                            <Iconify icon="solar:pen-bold" width={16} />
                          </IconButton>
                          <IconButton size="small" onClick={() => setDeletingId(tpl.id)} sx={{ color: 'error.main' }}>
                            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                          </IconButton>
                        </Stack>
                      )}
                    </Stack>
                  </Paper>
                ))}

                {groupTemplates.length === 0 && (
                  <Paper elevation={0} sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.disabled">No templates for {PIPELINE_LABELS[pipeline]}.</Typography>
                  </Paper>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>

      {/* Add dialog */}
      {addOpen && (
        <TemplateDialog open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
      )}

      {/* Edit dialog */}
      {editingTemplate && (
        <TemplateDialog
          open={!!editingTemplate}
          onClose={() => setEditingTemplate(null)}
          onSubmit={handleEdit}
          initial={{
            name: editingTemplate.name,
            pipeline: editingTemplate.pipeline,
            isDefault: editingTemplate.isDefault ?? false,
            stages: editingTemplate.stages.map((s) => ({ id: s.id, label: s.label })),
          }}
        />
      )}

      {/* Delete confirm */}
      <Dialog open={!!deletingId} onClose={() => setDeletingId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Template?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This template will be removed. Existing cases that used it will keep their current stages — only future case creation is affected.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeletingId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => deletingId && handleDelete(deletingId)}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!notification} autoHideDuration={3000} onClose={() => setNotification(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setNotification(null)} sx={{ width: '100%' }}>{notification}</Alert>
      </Snackbar>
    </DashboardContent>
  );
}
