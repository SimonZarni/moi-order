import { useCallback, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { fetchOrderChat, sendOrderChatMessage } from '../../../api/chat';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import type { OrderChatMessage } from '../../../types/models';

interface UseOrderChatScreenResult {
  messages: OrderChatMessage[];
  isLoading: boolean;
  isError: boolean;
  text: string;
  isSending: boolean;
  bottomInset: number;
  listRef: React.RefObject<FlatList | null>;
  handleTextChange: (v: string) => void;
  handleSend: () => void;
  handlePickImage: () => Promise<void>;
}

export function useOrderChatScreen(orderId: number): UseOrderChatScreenResult {
  const queryClient = useQueryClient();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ORDER_CHAT(orderId),
    queryFn: () => fetchOrderChat(orderId),
    refetchInterval: 10_000,
  });

  const messages = data ?? [];

  const { mutate, isPending: isSending } = useMutation({
    mutationFn: ({ body, image }: { body: string | null; image: { uri: string; name: string; type: string } | null }) =>
      sendOrderChatMessage(orderId, body, image),
    onSuccess: (newMsg) => {
      queryClient.setQueryData<OrderChatMessage[]>(
        QUERY_KEYS.ORDER_CHAT(orderId),
        (prev) => [...(prev ?? []), newMsg],
      );
    },
  });

  const handleTextChange = useCallback((v: string) => setText(v), []);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    mutate({ body: trimmed, image: null });
    setText('');
  }, [text, isSending, mutate]);

  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;
    const ext = asset.uri.split('.').pop() ?? 'jpg';
    mutate({ body: null, image: { uri: asset.uri, name: `chat.${ext}`, type: `image/${ext}` } });
  }, [mutate]);

  return { messages, isLoading, isError, text, isSending, bottomInset, listRef, handleTextChange, handleSend, handlePickImage };
}
