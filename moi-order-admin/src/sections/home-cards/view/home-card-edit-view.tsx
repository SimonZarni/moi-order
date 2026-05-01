import type { HomeCard } from 'src/types';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import { homeCardsApi } from 'src/api/home-cards';
import { DashboardContent } from 'src/layouts/dashboard';

import { HomeCardFormView } from './home-card-form-view';

// ----------------------------------------------------------------------

export function HomeCardEditView() {
  const { id } = useParams();

  const [card, setCard] = useState<HomeCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    homeCardsApi
      .get(Number(id))
      .then(setCard)
      .catch(() => setError('Failed to load card.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error || !card) {
    return (
      <DashboardContent>
        <Alert severity="error">{error || 'Card not found.'}</Alert>
      </DashboardContent>
    );
  }

  return <HomeCardFormView mode="edit" card={card} />;
}
