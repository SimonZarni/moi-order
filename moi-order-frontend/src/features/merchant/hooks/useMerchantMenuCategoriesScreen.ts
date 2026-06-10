import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types/navigation';
import { MenuCategory } from '@/types/models';
import { useMerchantMenuCategoriesData } from './useMerchantMenuCategoriesData';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export interface UseMerchantMenuCategoriesScreenResult {
  categories:          MenuCategory[];
  isLoading:           boolean;
  isError:             boolean;
  isDeletingId:        number | null;
  isCreating:          boolean;
  isUpdating:          boolean;
  editingId:           number | null;
  editingName:         string;
  isAddingNew:         boolean;
  newCategoryName:     string;
  handleStartEdit:     (id: number, currentName: string) => void;
  handleEditNameChange:(text: string) => void;
  handleSaveEdit:      () => Promise<void>;
  handleCancelEdit:    () => void;
  handleDelete:        (id: number) => void;
  handleShowAdd:       () => void;
  handleNewNameChange: (text: string) => void;
  handleSaveNew:       () => Promise<void>;
  handleCancelAdd:     () => void;
  handleBack:          () => void;
}

export function useMerchantMenuCategoriesScreen(): UseMerchantMenuCategoriesScreenResult {
  const navigation = useNavigation<Nav>();

  const {
    categories, isLoading, isError, isDeletingId, isCreating, isUpdating,
    createCategory, updateCategory, deleteCategory,
  } = useMerchantMenuCategoriesData();

  const [editingId,       setEditingId]       = useState<number | null>(null);
  const [editingName,     setEditingName]     = useState('');
  const [isAddingNew,     setIsAddingNew]     = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleStartEdit = useCallback((id: number, currentName: string) => {
    setIsAddingNew(false);
    setEditingId(id);
    setEditingName(currentName);
  }, []);

  const handleEditNameChange = useCallback((text: string) => {
    setEditingName(text);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (editingId === null || !editingName.trim()) return;
    try {
      await updateCategory(editingId, editingName.trim());
      setEditingId(null);
    } catch {
      Alert.alert('Error', 'Could not save category name. Please try again.');
    }
  }, [editingId, editingName, updateCategory]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingName('');
  }, []);

  const handleDelete = useCallback((id: number) => {
    deleteCategory(id).catch(() => {});
  }, [deleteCategory]);

  const handleShowAdd = useCallback(() => {
    setEditingId(null);
    setNewCategoryName('');
    setIsAddingNew(true);
  }, []);

  const handleNewNameChange = useCallback((text: string) => {
    setNewCategoryName(text);
  }, []);

  const handleSaveNew = useCallback(async () => {
    if (!newCategoryName.trim()) return;
    try {
      await createCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddingNew(false);
    } catch {
      Alert.alert('Error', 'Could not create category. Please try again.');
    }
  }, [newCategoryName, createCategory]);

  const handleCancelAdd = useCallback(() => {
    setIsAddingNew(false);
    setNewCategoryName('');
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    categories, isLoading, isError, isDeletingId, isCreating, isUpdating,
    editingId, editingName, isAddingNew, newCategoryName,
    handleStartEdit, handleEditNameChange, handleSaveEdit, handleCancelEdit,
    handleDelete, handleShowAdd, handleNewNameChange, handleSaveNew,
    handleCancelAdd, handleBack,
  };
}
