import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { tbStore, addTbTodo, toggleTbTodo, deleteTbTodo } from '../../shared/tb-mock-store';

import type { TbTodo, TbTodoPriority } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

const PRIORITY_COLOR: Record<TbTodoPriority, string> = {
  high: '#EF4444', medium: '#F59E0B', low: '#10B981',
};
const PRIORITY_BG: Record<TbTodoPriority, string> = {
  high: '#FEE2E2', medium: '#FEF3C7', low: '#D1FAE5',
};
const PRIORITY_TEXT: Record<TbTodoPriority, string> = {
  high: '#991B1B', medium: '#92400E', low: '#065F46',
};

type FilterStatus = 'all' | 'active' | 'done';

// ----------------------------------------------------------------------

export function TBTodoView() {
  const [todos, setTodos] = useState<TbTodo[]>(() => [...tbStore.todos]);

  // ── Filters ──────────────────────────────────────────────────────────
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCompanyId, setFilterCompanyId] = useState('');
  const [filterClientId, setFilterClientId] = useState('');

  // ── New task form ─────────────────────────────────────────────────────
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TbTodoPriority>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCompanyId, setNewCompanyId] = useState('');
  const [newClientId, setNewClientId] = useState('');

  const refresh = useCallback(() => setTodos([...tbStore.todos]), []);

  const handleAdd = useCallback(() => {
    if (!newTitle.trim()) return;
    const company = tbStore.clients.find((c) => c.id === newCompanyId);
    const client = tbStore.individualClients.find((c) => c.id === newClientId);
    addTbTodo({
      title: newTitle.trim(),
      done: false,
      priority: newPriority,
      dueDate: newDueDate || undefined,
      companyId: company?.id,
      companyName: company?.companyName,
      clientId: client?.id,
      clientName: client?.name,
    });
    refresh();
    setNewTitle('');
    setNewDueDate('');
    setNewPriority('medium');
    setNewCompanyId('');
    setNewClientId('');
  }, [newTitle, newPriority, newDueDate, newCompanyId, newClientId, refresh]);

  const handleToggle = useCallback((id: string) => {
    toggleTbTodo(id);
    refresh();
  }, [refresh]);

  const handleDelete = useCallback((id: string) => {
    deleteTbTodo(id);
    refresh();
  }, [refresh]);

  // ── Computed ──────────────────────────────────────────────────────────
  const filtered = todos.filter((t) => {
    if (filterStatus === 'active' && t.done) return false;
    if (filterStatus === 'done' && !t.done) return false;
    if (filterCompanyId && t.companyId !== filterCompanyId) return false;
    if (filterClientId && t.clientId !== filterClientId) return false;
    return true;
  });

  const activeCount = todos.filter((t) => !t.done).length;
  const doneCount = todos.filter((t) => t.done).length;

  const hasActiveFilters = !!filterCompanyId || !!filterClientId || filterStatus !== 'all';

  const handleClearFilters = useCallback(() => {
    setFilterStatus('all');
    setFilterCompanyId('');
    setFilterClientId('');
  }, []);

  return (
    <DashboardContent maxWidth="md">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">To-Do List</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {activeCount} active · {doneCount} completed
          </Typography>
        </Box>
      </Stack>

      {/* ── Add new task ── */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Add New Task</Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth size="small"
            placeholder="Task description…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            {/* Priority */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Priority</InputLabel>
              <Select value={newPriority} label="Priority" onChange={(e) => setNewPriority(e.target.value as TbTodoPriority)}>
                {(['high', 'medium', 'low'] as TbTodoPriority[]).map((p) => (
                  <MenuItem key={p} value={p}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: PRIORITY_COLOR[p], flexShrink: 0 }} />
                      <span style={{ textTransform: 'capitalize' }}>{p}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Due date */}
            <TextField
              size="small" type="date" label="Due Date"
              value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: 150 }}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            {/* Linked company */}
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel shrink>Linked Company</InputLabel>
              <Select notched displayEmpty value={newCompanyId} label="Linked Company" onChange={(e) => setNewCompanyId(e.target.value)}>
                <MenuItem value=""><em>None</em></MenuItem>
                {tbStore.clients.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.companyName}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Linked client */}
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel shrink>Linked Client</InputLabel>
              <Select notched displayEmpty value={newClientId} label="Linked Client" onChange={(e) => setNewClientId(e.target.value)}>
                <MenuItem value=""><em>None</em></MenuItem>
                {tbStore.individualClients.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Box>
                      <Typography variant="body2">{c.name}</Typography>
                      {c.companyName && <Typography variant="caption" color="text.secondary">{c.companyName}</Typography>}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Button
            variant="contained" startIcon={<Iconify icon="mingcute:add-line" width={16} />}
            onClick={handleAdd} disabled={!newTitle.trim()}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Task
          </Button>
        </Stack>
      </Paper>

      {/* ── Filters ── */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }} flexWrap="wrap" sx={{ mb: 2.5 }}>
        {/* Status chips */}
        <Stack direction="row" spacing={0.75}>
          {(['all', 'active', 'done'] as FilterStatus[]).map((f) => (
            <Chip
              key={f}
              size="small"
              label={f === 'all' ? `All (${todos.length})` : f === 'active' ? `Active (${activeCount})` : `Done (${doneCount})`}
              onClick={() => setFilterStatus(f)}
              variant={filterStatus === f ? 'filled' : 'outlined'}
              color={filterStatus === f ? 'primary' : 'default'}
              sx={{ cursor: 'pointer', textTransform: 'capitalize' }}
            />
          ))}
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

        {/* Company filter */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel shrink>Company</InputLabel>
          <Select notched displayEmpty value={filterCompanyId} label="Company" onChange={(e) => setFilterCompanyId(e.target.value)}>
            <MenuItem value="">All Companies</MenuItem>
            {tbStore.clients.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.companyName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Client filter */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel shrink>Client</InputLabel>
          <Select notched displayEmpty value={filterClientId} label="Client" onChange={(e) => setFilterClientId(e.target.value)}>
            <MenuItem value="">All Clients</MenuItem>
            {tbStore.individualClients.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button size="small" color="inherit" startIcon={<Iconify icon="mingcute:close-line" width={14} />} onClick={handleClearFilters}>
            Clear
          </Button>
        )}
      </Stack>

      {/* ── Task list ── */}
      <Stack spacing={1}>
        {filtered.length === 0 && (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="body2" color="text.disabled">
              {hasActiveFilters ? 'No tasks match the current filters.' : (filterStatus as string) === 'done' ? 'No completed tasks yet.' : 'No tasks here.'}
            </Typography>
          </Paper>
        )}

        {filtered.map((todo) => (
          <Paper
            key={todo.id}
            elevation={0}
            sx={{
              px: 2, py: 1.5,
              border: '1px solid', borderColor: 'divider',
              borderRadius: 1.5,
              bgcolor: todo.done ? 'background.neutral' : 'background.paper',
              opacity: todo.done ? 0.7 : 1,
            }}
          >
            <Stack direction="row" alignItems="flex-start" spacing={1.5}>
              <Checkbox
                checked={todo.done}
                onChange={() => handleToggle(todo.id)}
                size="small"
                sx={{ p: 0.5, mt: 0.25, color: todo.done ? 'success.main' : 'text.disabled', flexShrink: 0 }}
              />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Title + priority */}
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? 'text.disabled' : 'text.primary' }}
                  >
                    {todo.title}
                  </Typography>
                  <Chip
                    size="small"
                    label={todo.priority}
                    sx={{ height: 18, fontSize: 10, textTransform: 'capitalize', bgcolor: PRIORITY_BG[todo.priority], color: PRIORITY_TEXT[todo.priority] }}
                  />
                </Stack>

                {/* Company / client badges */}
                {(todo.companyName || todo.clientName) && (
                  <Stack direction="row" spacing={0.75} sx={{ mt: 0.5 }}>
                    {todo.companyName && (
                      <Chip
                        size="small"
                        icon={<Iconify icon="solar:eye-bold" width={12} />}
                        label={todo.companyName}
                        sx={{ height: 20, fontSize: 10, bgcolor: '#E0E7FF', color: '#3730A3', maxWidth: 200 }}
                      />
                    )}
                    {todo.clientName && (
                      <Chip
                        size="small"
                        icon={<Iconify icon="solar:eye-closed-bold" width={12} />}
                        label={todo.clientName}
                        sx={{ height: 20, fontSize: 10, bgcolor: '#D1FAE5', color: '#065F46', maxWidth: 200 }}
                      />
                    )}
                  </Stack>
                )}

                {/* Dates */}
                <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                  <Typography variant="caption" color="text.disabled">Created {fDate(todo.createdAt)}</Typography>
                  {todo.dueDate && (
                    <Typography
                      variant="caption"
                      sx={{ color: !todo.done && new Date(todo.dueDate) < new Date() ? '#EF4444' : 'text.disabled' }}
                    >
                      Due {fDate(todo.dueDate)}
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Tooltip title="Delete task">
                <IconButton
                  size="small"
                  onClick={() => handleDelete(todo.id)}
                  sx={{ flexShrink: 0, color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </DashboardContent>
  );
}
