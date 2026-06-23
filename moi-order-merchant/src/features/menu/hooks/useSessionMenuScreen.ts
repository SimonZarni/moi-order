import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MerchantStackParamList } from '../../../types/navigation';
import { useQuery } from '@tanstack/react-query';
import { getMenuCategories } from '../../../api/menu';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { useSessionMenuData } from './useSessionMenuData';
import type { MenuCategory } from '../../../types/models';

export interface UseSessionMenuScreenResult {
  categories: MenuCategory[];
  defaultCategories: MenuCategory[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isCreating: boolean;
  isImporting: boolean;
  isDeleting: boolean;
  isImportModalVisible: boolean;
  selectedImportIds: number[];
  handleBack: () => void;
  handleAddCategory: (name: string) => void;
  handleRenameCategory: (categoryId: number, name: string) => void;
  handleDeleteCategory: (categoryId: number, categoryName: string) => void;
  handleOpenImportModal: () => void;
  handleCloseImportModal: () => void;
  handleToggleImportId: (id: number) => void;
  handleConfirmImport: () => void;
}

export function useSessionMenuScreen(openingHourId: number): UseSessionMenuScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();

  const data = useSessionMenuData(openingHourId);

  const { data: defaultCategories = [] } = useQuery({
    queryKey: QUERY_KEYS.MENU_CATEGORIES,
    queryFn: getMenuCategories,
    staleTime: 60_000,
  });

  const [isImportModalVisible, setImportModalVisible] = useState(false);
  const [selectedImportIds, setSelectedImportIds] = useState<number[]>([]);

  const handleBack = useCallback(() => { navigation.goBack(); }, [navigation]);

  const handleAddCategory = useCallback((name: string) => {
    data.createCategory(name);
  }, [data]);

  const handleRenameCategory = useCallback((categoryId: number, name: string) => {
    data.updateCategory(categoryId, name);
  }, [data]);

  const handleDeleteCategory = useCallback((categoryId: number, categoryName: string) => {
    Alert.alert(
      'Delete Category',
      `Delete "${categoryName}" and all its items from this session menu?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => data.deleteCategory(categoryId),
        },
      ],
    );
  }, [data]);

  const handleOpenImportModal = useCallback(() => {
    setSelectedImportIds([]);
    setImportModalVisible(true);
  }, []);

  const handleCloseImportModal = useCallback(() => {
    setImportModalVisible(false);
  }, []);

  const handleToggleImportId = useCallback((id: number) => {
    setSelectedImportIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const handleConfirmImport = useCallback(() => {
    if (selectedImportIds.length === 0) return;
    data.importCategories(selectedImportIds);
    setImportModalVisible(false);
  }, [selectedImportIds, data]);

  const importableCategories = useMemo(
    () => defaultCategories.filter((c) => c.opening_hour_id === null),
    [defaultCategories],
  );

  return {
    categories:           data.categories,
    defaultCategories:    importableCategories,
    isLoading:            data.isLoading,
    isError:              data.isError,
    error:                data.error,
    isCreating:           data.isCreating,
    isImporting:          data.isImporting,
    isDeleting:           data.isDeleting,
    isImportModalVisible,
    selectedImportIds,
    handleBack,
    handleAddCategory,
    handleRenameCategory,
    handleDeleteCategory,
    handleOpenImportModal,
    handleCloseImportModal,
    handleToggleImportId,
    handleConfirmImport,
  };
}
