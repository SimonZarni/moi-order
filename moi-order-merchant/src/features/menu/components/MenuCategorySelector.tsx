import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './MenuCategorySelector.styles';
import { colours } from '../../../shared/theme/colours';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { MenuCategory } from '../../../types/models';

interface MenuCategorySelectorProps {
  isDesktop: boolean;
  categories: MenuCategory[];
  totalCount: number;
  selectedCategoryId: number | 'all';
  onSelectCategory: (id: number | 'all') => void;
  onOpenRename: (id: number, name: string) => void;
  onOpenDelete: (id: number, name: string) => void;
  onAddCategory: () => void;
}

export function MenuCategorySelector({
  isDesktop, categories, totalCount, selectedCategoryId,
  onSelectCategory, onOpenRename, onOpenDelete, onAddCategory,
}: MenuCategorySelectorProps): React.JSX.Element {
  const t = useTranslation();

  if (isDesktop) {
    return (
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>{t('menu_categories_label')}</Text>
        <ScrollView style={styles.sidebarScroll} showsVerticalScrollIndicator={false}>
          <SidebarItem
            label={t('menu_all_category')}
            count={totalCount}
            isActive={selectedCategoryId === 'all'}
            onPress={() => onSelectCategory('all')}
          />
          {categories.map((cat) => (
            <SidebarItem
              key={cat.id}
              label={cat.name}
              count={cat.items.length}
              isSystem={cat.is_system}
              isActive={selectedCategoryId === cat.id}
              onPress={() => onSelectCategory(cat.id)}
              onEdit={cat.is_system ? undefined : () => onOpenRename(cat.id, cat.name)}
              onDelete={cat.is_system ? undefined : () => onOpenDelete(cat.id, cat.name)}
            />
          ))}
        </ScrollView>
        <View style={styles.sidebarFooter}>
          <Pressable style={styles.addCatBtn} onPress={onAddCategory} accessibilityRole="button" accessibilityLabel="Add category">
            <Ionicons name="add" size={14} color={colours.primaryDark} />
            <Text style={styles.addCatBtnText}>{t('menu_add_category')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabsOuter}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsContent}>
        <TabPill
          label={t('menu_all_category')}
          count={totalCount}
          isActive={selectedCategoryId === 'all'}
          onPress={() => onSelectCategory('all')}
        />
        {categories.map((cat) => (
          <TabPill
            key={cat.id}
            label={cat.name}
            count={cat.items.length}
            isActive={selectedCategoryId === cat.id}
            onPress={() => onSelectCategory(cat.id)}
            onEdit={cat.is_system ? undefined : () => onOpenRename(cat.id, cat.name)}
            onDelete={cat.is_system ? undefined : () => onOpenDelete(cat.id, cat.name)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface SidebarItemProps {
  label: string; count: number; isActive: boolean; isSystem?: boolean;
  onPress: () => void; onEdit?: () => void; onDelete?: () => void;
}

function SidebarItem({ label, count, isActive, isSystem, onPress, onEdit, onDelete }: SidebarItemProps): React.JSX.Element {
  return (
    <Pressable
      style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${label} category, ${count} items`}
    >
      {isActive && <View style={styles.sidebarAccent} />}
      <Text style={[styles.sidebarItemLabel, isActive && styles.sidebarItemLabelActive]} numberOfLines={1}>{label}</Text>
      {isSystem && <View style={styles.systemBadge}><Text style={styles.systemBadgeText}>sys</Text></View>}
      <View style={[styles.sidebarCount, isActive && styles.sidebarCountActive]}>
        <Text style={[styles.sidebarCountText, isActive && styles.sidebarCountTextActive]}>{count}</Text>
      </View>
      {!isSystem && (
        <View style={styles.sidebarActions}>
          {onEdit && (
            <Pressable style={styles.sidebarActionBtn} onPress={(e) => { e.stopPropagation?.(); onEdit(); }} accessibilityRole="button" accessibilityLabel={`Rename ${label}`}>
              <Ionicons name="pencil-outline" size={11} color={colours.textMuted} />
            </Pressable>
          )}
          {onDelete && (
            <Pressable style={styles.sidebarActionBtn} onPress={(e) => { e.stopPropagation?.(); onDelete(); }} accessibilityRole="button" accessibilityLabel={`Delete ${label}`}>
              <Ionicons name="trash-outline" size={11} color={colours.error} />
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}

interface TabPillProps {
  label: string; count: number; isActive: boolean;
  onPress: () => void; onEdit?: () => void; onDelete?: () => void;
}

function TabPill({ label, count, isActive, onPress, onEdit, onDelete }: TabPillProps): React.JSX.Element {
  return (
    <View style={[styles.tab, isActive && styles.tabActive]}>
      <Pressable style={styles.tabLabelArea} onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: isActive }} accessibilityLabel={`${label}, ${count} items`}>
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
        <View style={[styles.tabCount, isActive && styles.tabCountActive]}>
          <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>{count}</Text>
        </View>
      </Pressable>
      {onEdit && <Pressable style={styles.tabEditBtn} onPress={onEdit} accessibilityRole="button" accessibilityLabel={`Rename ${label}`}><Ionicons name="pencil" size={11} color={colours.primaryDark} /></Pressable>}
      {onDelete && <Pressable style={styles.tabDeleteBtn} onPress={onDelete} accessibilityRole="button" accessibilityLabel={`Delete ${label}`}><Ionicons name="trash-outline" size={11} color={colours.error} /></Pressable>}
    </View>
  );
}
