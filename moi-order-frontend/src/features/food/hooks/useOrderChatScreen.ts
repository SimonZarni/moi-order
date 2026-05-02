import { useCallback, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '@/types/navigation';
import { useOrderChatData, useSendChatMessage } from './useOrderChatData';

type Route = RouteProp<RootStackParamList, 'OrderChat'>;

export interface UseOrderChatScreenResult {
  orderId: number;
  orderNumber: string | null;
  messages: ReturnType<typeof useOrderChatData>['messages'];
  isLoading: boolean;
  isError: boolean;
  text: string;
  isSending: boolean;
  bottomInset: number;
  listRef: React.RefObject<FlatList | null>;
  handleBack: () => void;
  handleTextChange: (v: string) => void;
  handleSend: () => void;
  handlePickImage: () => Promise<void>;
}

export function useOrderChatScreen(): UseOrderChatScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Route>();
  const { orderId, orderNumber } = route.params;
  const { bottom: bottomInset } = useSafeAreaInsets();

  const { messages, isLoading, isError } = useOrderChatData(orderId);
  const sendMutation = useSendChatMessage();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleTextChange = useCallback((v: string) => setText(v), []);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || sendMutation.isPending) return;
    sendMutation.mutate({ orderId, body: trimmed, image: null });
    setText('');
  }, [text, sendMutation, orderId]);

  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;
    const ext = asset.uri.split('.').pop() ?? 'jpg';
    sendMutation.mutate({
      orderId,
      body: null,
      image: { uri: asset.uri, name: `chat.${ext}`, type: `image/${ext}` },
    });
  }, [sendMutation, orderId]);

  return {
    orderId,
    orderNumber,
    messages,
    isLoading,
    isError,
    text,
    isSending: sendMutation.isPending,
    bottomInset,
    listRef,
    handleBack,
    handleTextChange,
    handleSend,
    handlePickImage,
  };
}
