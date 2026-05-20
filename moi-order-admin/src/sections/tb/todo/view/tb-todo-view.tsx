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
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
};
const PRIORITY_BG: Record<TbTodoPriority, string> = {
  high: '#FEE2E2',
  medium: '#FEF3C7',
  low: '#D1FAE5',
};
const PRIORITY_TEXT: Record<TbTodoPriority, string> = {
  high: '#991B1B',
  medium: '#92400E',
  low: '#065F46',
};

type FilterTab = 'all' | 'active' | 'done';

// ----------------------------------------------------------------------

export function TBTodoView() {
  const [todos, setTodos] = useState<TbTodo[]>(() => [...tbStore.todos]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TbTodoPriority>('medium');
  const [newDueDate, setNewDueDate] = useState('');

  const refresh = useCallback(() => setTodos([...tbStore.todos]), []);

  const handleAdd = useCallback(() => {
    if (!newTitle.trim()) return;
    addTbTodo({ title: newTitle.trim(), done: false, priority: newPriority, dueDate: newDueDate || undefined });
    refresh();
    setNewTitle('');
    setNewDueDate('');
    setNewPriority('medium');
  }, [newTitle, newPriority, newDueDate, refresh]);

  const handleToggle = useCallback((id: string) => {
    toggleTbTodo(id);
    refresh();
  }, [refresh]);

  const handleDelete = useCallback((id: string) => {
    deleteTbTodo(id);
    refresh();
  }, [refresh]);

  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const activeCount = todos.filter((t) => !t.done).length;
  const doneCount = todos.filter((t) => t.done).length;

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

      {/* Add new task */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Add New Task</Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Task description…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 130 }}>
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
            <TextField
              size="small"
              type="date"
              label="Due Date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: 160 }}
            />
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" width={16} />}
              onClick={handleAdd}
              disabled={!newTitle.trim()}
              sx={{ flexShrink: 0 }}
            >
              Add Task
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Filter tabs */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {(['all', 'active', 'done'] as FilterTab[]).map((f) => (
          <Chip
            key={f}
            label={f === 'all' ? `All (${todos.length})` : f === 'active' ? `Active (${activeCount})` : `Done (${doneCount})`}
            onClick={() => setFilter(f)}
            variant={filter === f ? 'filled' : 'outlined'}
            color={filter === f ? 'primary' : 'default'}
            size="small"
            sx={{ cursor: 'pointer', textTransform: 'capitalize' }}
          />
        ))}
      </Stack>

      {/* Task list */}
      <Stack spacing={1}>
        {filtered.length === 0 && (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="body2" color="text.disabled">
              {filter === 'done' ? 'No completed tasks yet.' : 'No tasks here.'}
            </Typography>
          </Paper>
        )}

        {filtered.map((todo, idx) => (
          <Paper
            key={todo.id}
            elevation={0}
            sx={{
              px: 2, py: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              bgcolor: todo.done ? 'background.neutral' : 'background.paper',
              opacity: todo.done ? 0.7 : 1,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Checkbox
                checked={todo.done}
                onChange={() => handleToggle(todo.id)}
                size="small"
                sx={{ p: 0.5, color: todo.done ? 'success.main' : 'text.disabled' }}
              />

              <Box sx={{ flex: 1, minWidth: 0 }}>
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
                    sx={{
                      height: 18, fontSize: 10, textTransform: 'capitalize',
                      bgcolor: PRIORITY_BG[todo.priority],
                      color: PRIORITY_TEXT[todo.priority],
                    }}
                  />
                </Stack>
                <Stack direction="row" spacing={1.5} sx={{ mt: 0.25 }}>
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
                <IconButton size="small" onClick={() => handleDelete(todo.id)} sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                  <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                </IconButton>
              </Tooltip>
            </Stack>

            {idx < filtered.length - 1 && <Divider sx={{ mt: 0, display: 'none' }} />}
          </Paper>
        ))}
      </Stack>
    </DashboardContent>
  );
}
