import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '@/types/navigation';
import { useOrderChatData, useSendChatMessage } from './useOrderChatData';

type Route = RouteProp<RootStackParamList, 'OrderChat'>;

export interface UseOrderChatScreenResult {
  orderId: string;
  orderNumber: string | null;
  restaurantName: string | null;
  messages: ReturnType<typeof useOrderChatData>['messages'];
  isLoading: boolean;
  isError: boolean;
  sendError: string | null;
  text: string;
  isSending: boolean;
  inputBarPadding: number;
  selectedPhoto: string | null;
  listRef: React.RefObject<FlatList | null>;
  handleBack: () => void;
  handleTextChange: (v: string) => void;
  handleSend: () => void;
  handlePickImage: () => Promise<void>;
  handlePhotoPress: (uri: string) => void;
  handlePhotoClose: () => void;
}

export function useOrderChatScreen(): UseOrderChatScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Route>();
  const { orderId, orderNumber, restaurantName } = route.params;
  const { bottom: bottomInset } = useSafeAreaInsets();

  const { messages, isLoading, isError } = useOrderChatData(orderId);
  const sendMutation = useSendChatMessage();
  const [text, setText] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

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

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleTextChange = useCallback((v: string) => setText(v), []);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || sendMutation.isPending) return;
    setSendError(null);
    sendMutation.mutate(
      { orderId, body: trimmed, image: null },
      { onError: () => setSendError('Failed to send. Tap to retry.') },
    );
    setText('');
  }, [text, sendMutation, orderId]);

  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;
    const ext = asset.uri.split('.').pop() ?? 'jpg';
    setSendError(null);
    sendMutation.mutate(
      { orderId, body: null, image: { uri: asset.uri, name: `chat.${ext}`, type: `image/${ext}` } },
      { onError: () => setSendError('Failed to send image. Please try again.') },
    );
  }, [sendMutation, orderId]);

  const handlePhotoPress = useCallback((uri: string) => setSelectedPhoto(uri), []);
  const handlePhotoClose = useCallback(() => setSelectedPhoto(null), []);

  return {
    orderId,
    orderNumber,
    restaurantName,
    messages,
    isLoading,
    isError,
    sendError,
    text,
    isSending: sendMutation.isPending,
    inputBarPadding,
    selectedPhoto,
    listRef,
    handleBack,
    handleTextChange,
    handleSend,
    handlePickImage,
    handlePhotoPress,
    handlePhotoClose,
  };
}
