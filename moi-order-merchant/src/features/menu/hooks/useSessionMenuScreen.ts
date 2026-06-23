import { useState, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MerchantStackParamList } from '../../../types/navigation';
import { useQuery } from '@tanstack/react-query';
import { getMenuCategories } from '../../../api/menu';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { useSessionMenuData } from './useSessionMenuData';
import type { MenuCategory } from '../../../types/models';
import type { MenuItemStatus } from '../../../types/enums';

export interface UseSessionMenuScreenResult {
  categories: MenuCategory[];
  defaultCategories: MenuCategory[];
  isLoading: boolean;
  isError: boolean;
  isCreating: boolean;
  isImporting: boolean;
  isRenaming: boolean;
  // Accordion
  isCategoryExpanded: (categoryId: number) => boolean;
  handleToggleExpanded: (categoryId: number) => void;
  // Add category modal
  showAddCategoryModal: boolean;
  newCategoryName: string;
  handleOpenAddModal: () => void;
  handleNewCategoryNameChange: (name: string) => void;
  handleConfirmAdd: () => void;
  handleCancelAdd: () => void;
  // Rename modal
  renamingCategoryId: number | null;
  renamingCategoryName: string;
  handleOpenRename: (id: number, name: string) => void;
  handleRenameNameChange: (name: string) => void;
  handleConfirmRename: () => void;
  handleCancelRename: () => void;
  // Delete category
  deletingCategoryId: number | null;
  deletingCategoryName: string;
  handleOpenDeleteConfirm: (id: number, name: string) => void;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
  // Import modal
  isImportModalVisible: boolean;
  selectedImportIds: number[];
  handleOpenImportModal: () => void;
  handleCloseImportModal: () => void;
  handleToggleImportId: (id: number) => void;
  handleConfirmImport: () => void;
  // Item actions
  handleToggleItemStatus: (itemId: number, status: MenuItemStatus) => void;
  handleDeleteItem: (itemId: number) => void;
  handleEditItem: (itemId: number) => void;
  // Navigation
  handleBack: () => void;
}

export function useSessionMenuScreen(
  openingHourId: number,
  onBackOverride?: () => void,
  onEditItemOverride?: (itemId: number) => void,
): UseSessionMenuScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();
  const data = useSessionMenuData(openingHourId);

  const { data: defaultCategories = [] } = useQuery({
    queryKey: QUERY_KEYS.MENU_CATEGORIES,
    queryFn: getMenuCategories,
    staleTime: 60_000,
  });

  // ── Add category modal ────────────────────────────────────────────────────
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleOpenAddModal = useCallback(() => {
    setNewCategoryName('');
    setShowAddCategoryModal(true);
  }, []);

  const handleNewCategoryNameChange = useCallback((name: string) => setNewCategoryName(name), []);

  const handleConfirmAdd = useCallback(() => {
    if (!newCategoryName.trim()) return;
    data.createCategory(newCategoryName.trim());
    setShowAddCategoryModal(false);
    setNewCategoryName('');
  }, [newCategoryName, data]);

  const handleCancelAdd = useCallback(() => {
    setShowAddCategoryModal(false);
    setNewCategoryName('');
  }, []);

  // ── Rename modal ──────────────────────────────────────────────────────────
  const [renamingCategoryId, setRenamingCategoryId] = useState<number | null>(null);
  const [renamingCategoryName, setRenamingCategoryName] = useState('');

  const handleOpenRename = useCallback((id: number, name: string) => {
    setRenamingCategoryId(id);
    setRenamingCategoryName(name);
  }, []);

  const handleRenameNameChange = useCallback((name: string) => setRenamingCategoryName(name), []);

  const handleConfirmRename = useCallback(() => {
    if (renamingCategoryId === null || !renamingCategoryName.trim()) return;
    data.updateCategory(renamingCategoryId, renamingCategoryName.trim());
    setRenamingCategoryId(null);
  }, [renamingCategoryId, renamingCategoryName, data]);

  const handleCancelRename = useCallback(() => setRenamingCategoryId(null), []);

  // ── Delete category ───────────────────────────────────────────────────────
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [deletingCategoryName, setDeletingCategoryName] = useState('');

  const handleOpenDeleteConfirm = useCallback((id: number, name: string) => {
    setDeletingCategoryId(id);
    setDeletingCategoryName(name);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deletingCategoryId === null) return;
    data.deleteCategory(deletingCategoryId);
    setDeletingCategoryId(null);
  }, [deletingCategoryId, data]);

  const handleCancelDelete = useCallback(() => setDeletingCategoryId(null), []);

  // ── Import modal ──────────────────────────────────────────────────────────
  const [isImportModalVisible, setImportModalVisible] = useState(false);
  const [selectedImportIds, setSelectedImportIds] = useState<number[]>([]);

  const handleOpenImportModal = useCallback(() => {
    setSelectedImportIds([]);
    setImportModalVisible(true);
  }, []);

  const handleCloseImportModal = useCallback(() => setImportModalVisible(false), []);

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

  // ── Accordion ─────────────────────────────────────────────────────────────
  // Tracks collapsed category IDs; empty = all expanded (default)
  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set());

  const handleToggleExpanded = useCallback((categoryId: number) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) { next.delete(categoryId); } else { next.add(categoryId); }
      return next;
    });
  }, []);

  const isCategoryExpanded = useCallback(
    (categoryId: number) => !collapsedIds.has(categoryId),
    [collapsedIds],
  );

  // ── Item actions ──────────────────────────────────────────────────────────
  const handleToggleItemStatus = useCallback(
    (itemId: number, status: MenuItemStatus) => data.toggleItemStatus(itemId, status),
    [data],
  );

  const handleDeleteItem = useCallback((itemId: number) => data.removeItem(itemId), [data]);

  const handleEditItem = useCallback((itemId: number) => {
    if (onEditItemOverride) {
      onEditItemOverride(itemId);
    } else {
      navigation.navigate('EditMenuItem', { itemId });
    }
  }, [navigation, onEditItemOverride]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    if (onBackOverride) { onBackOverride(); } else { navigation.goBack(); }
  }, [navigation, onBackOverride]);

  const importableCategories = useMemo(
    () => defaultCategories.filter((c) => c.opening_hour_id === null),
    [defaultCategories],
  );

  return {
    categories:            data.categories,
    defaultCategories:     importableCategories,
    isLoading:             data.isLoading,
    isError:               data.isError,
    isCreating:            data.isCreating,
    isImporting:           data.isImporting,
    isRenaming:            data.isRenaming,
    showAddCategoryModal,
    newCategoryName,
    handleOpenAddModal,
    handleNewCategoryNameChange,
    handleConfirmAdd,
    handleCancelAdd,
    renamingCategoryId,
    renamingCategoryName,
    handleOpenRename,
    handleRenameNameChange,
    handleConfirmRename,
    handleCancelRename,
    deletingCategoryId,
    deletingCategoryName,
    handleOpenDeleteConfirm,
    handleConfirmDelete,
    handleCancelDelete,
    isImportModalVisible,
    selectedImportIds,
    handleOpenImportModal,
    handleCloseImportModal,
    handleToggleImportId,
    handleConfirmImport,
    handleToggleItemStatus,
    handleDeleteItem,
    handleEditItem,
    isCategoryExpanded,
    handleToggleExpanded,
    handleBack,
  };
}
