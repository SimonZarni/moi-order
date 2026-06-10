import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Keyboard } from 'react-native';
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
  sendError: string | null;
  text: string;
  isSending: boolean;
  inputBarPadding: number;
  selectedPhoto: string | null;
  listRef: React.RefObject<FlatList | null>;
  handleTextChange: (v: string) => void;
  handleSend: () => void;
  handleAttachPress: () => void;
  handlePhotoPress: (uri: string) => void;
  handlePhotoClose: () => void;
}

export function useOrderChatScreen(orderId: number): UseOrderChatScreenResult {
  const queryClient = useQueryClient();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ORDER_CHAT(orderId),
    queryFn: () => fetchOrderChat(orderId),
    refetchInterval: 10_000,
  });

  const messages = data ?? [];

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Collapse safe-area gap when keyboard is visible (keyboard fills that space)
  const inputBarPadding = keyboardVisible ? 8 : Math.max(bottomInset, 8) + 8;

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
    setSendError(null);
    mutate(
      { body: trimmed, image: null },
      { onError: () => setSendError('Failed to send. Please try again.') },
    );
    setText('');
  }, [text, isSending, mutate]);

  const sendImageAsset = useCallback((asset: ImagePicker.ImagePickerAsset) => {
    const ext = asset.uri.split('.').pop() ?? 'jpg';
    setSendError(null);
    mutate(
      { body: null, image: { uri: asset.uri, name: `chat.${ext}`, type: `image/${ext}` } },
      { onError: () => setSendError('Failed to send image. Please try again.') },
    );
  }, [mutate]);

  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;
    sendImageAsset(asset);
  }, [sendImageAsset]);

  const handleTakePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera permission needed', 'Please allow camera access to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;
    sendImageAsset(asset);
  }, [sendImageAsset]);

  const handleAttachPress = useCallback(() => {
    Alert.alert('Add Photo', undefined, [
      { text: 'Take Photo', onPress: () => { void handleTakePhoto(); } },
      { text: 'Choose from Library', onPress: () => { void handlePickImage(); } },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [handleTakePhoto, handlePickImage]);

  const handlePhotoPress = useCallback((uri: string) => setSelectedPhoto(uri), []);
  const handlePhotoClose = useCallback(() => setSelectedPhoto(null), []);

  return {
    messages, isLoading, isError, sendError, text, isSending,
    inputBarPadding, selectedPhoto, listRef,
    handleTextChange, handleSend, handleAttachPress,
    handlePhotoPress, handlePhotoClose,
  };
}
