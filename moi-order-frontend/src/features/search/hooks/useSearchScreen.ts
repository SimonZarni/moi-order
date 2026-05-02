import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPlaces } from '@/shared/api/places';
import { fetchTickets } from '@/shared/api/tickets';
import { fetchServices } from '@/shared/api/services';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { CACHE_TTL } from '@/shared/constants/config';
import { RootStackParamList } from '@/types/navigation';
import type { Place, Ticket, Service } from '@/types/models';

export type SearchTab = 'all' | 'places' | 'tickets' | 'services';

export interface SearchResult {
  type:   'place' | 'ticket' | 'service';
  id:     number;
  title:  string;
  subtitle: string;
  image:  string | null;
}

export interface UseSearchScreenResult {
  query:          string;
  activeTab:      SearchTab;
  results:        SearchResult[];
  isLoading:      boolean;
  handleQueryChange: (q: string) => void;
  handleTabChange:   (tab: SearchTab) => void;
  handleResultPress: (result: SearchResult) => void;
  handleBack:        () => void;
}

function toSearchResults(
  places: Place[], tickets: Ticket[], services: Service[], query: string, tab: SearchTab,
): SearchResult[] {
  const q = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  if (tab === 'all' || tab === 'places') {
    places
      .filter(p =>
        p.name_en.toLowerCase().includes(q) ||
        p.name_my.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.category?.name_en.toLowerCase().includes(q)
      )
      .forEach(p => results.push({
        type: 'place', id: p.id,
        title: p.name_en,
        subtitle: [p.category?.name_en, p.city].filter(Boolean).join(' · '),
        image: p.cover_image,
      }));
  }

  if (tab === 'all' || tab === 'tickets') {
    tickets
      .filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.city?.toLowerCase().includes(q) ||
        t.province?.toLowerCase().includes(q)
      )
      .forEach(t => results.push({
        type: 'ticket', id: t.id,
        title: t.name,
        subtitle: [t.city, t.province].filter(Boolean).join(', '),
        image: t.cover_image_url ?? null,
      }));
  }

  if (tab === 'all' || tab === 'services') {
    services
      .filter(s =>
        s.name_en.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
      )
      .forEach(s => results.push({
        type: 'service', id: s.id,
        title: s.name_en || s.name,
        subtitle: 'Service',
        image: null,
      }));
  }

  return results;
}

export function useSearchScreen(): UseSearchScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery]       = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');

  const { data: allPlaces, isLoading: placesLoading } = useQuery({
    queryKey: QUERY_KEYS.PLACES.ALL(),
    queryFn:  fetchAllPlaces,
    staleTime: CACHE_TTL.USER_DATA,
  });
  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: QUERY_KEYS.TICKETS.LIST,
    queryFn:  () => fetchTickets(1),
    staleTime: CACHE_TTL.STATIC_DATA,
  });
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: QUERY_KEYS.SERVICES.LIST,
    queryFn:  fetchServices,
    staleTime: CACHE_TTL.STATIC_DATA,
  });

  const isLoading = placesLoading || ticketsLoading || servicesLoading;

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return toSearchResults(
      allPlaces ?? [],
      ticketsData?.data ?? [],
      servicesData ?? [],
      query,
      activeTab,
    );
  }, [query, activeTab, allPlaces, ticketsData, servicesData]);

  const handleQueryChange = useCallback((q: string) => setQuery(q), []);
  const handleTabChange   = useCallback((tab: SearchTab) => setActiveTab(tab), []);
  const handleBack        = useCallback(() => navigation.goBack(), [navigation]);

  const handleResultPress = useCallback((result: SearchResult) => {
    if (result.type === 'place') {
      navigation.navigate('PlaceDetail', { placeId: result.id });
    } else if (result.type === 'ticket') {
      navigation.navigate('TicketDetail', { ticketId: result.id });
    } else if (result.type === 'service') {
      navigation.navigate('OtherServices');
    }
  }, [navigation]);

  return {
    query, activeTab, results, isLoading,
    handleQueryChange, handleTabChange, handleResultPress, handleBack,
  };
}
