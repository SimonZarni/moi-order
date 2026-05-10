import React, { useCallback } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { MenuCategory, MenuItem } from '@/types/models';
import { useStrings } from '@/shared/i18n';
import { MenuItemRow } from './MenuItemRow';
import { styles } from './MenuCategorySection.styles';

interface Props {
  category:         MenuCategory;
  sectionIndex:     number;
  onSectionMeasured: (index: number, y: number) => void;
  getQuantity:      (menuItemId: number) => number;
  onAdd:            (item: MenuItem) => void;
  onRemove:         (cartKey: string) => void;
  onPress:          (item: MenuItem) => void;
}

export function MenuCategorySection({
  category, sectionIndex, onSectionMeasured, getQuantity, onAdd, onRemove, onPress,
}: Props): React.JSX.Element {
  const s = useStrings();
  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => onSectionMeasured(sectionIndex, e.nativeEvent.layout.y),
    [sectionIndex, onSectionMeasured],
  );

  return (
    <View onLayout={handleLayout}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{category.name}</Text>
      </View>
      <View style={styles.itemsCard}>
        {(category.items ?? []).map((item) => (
          <MenuItemRow
            key={item.id}
            item={item}
            quantity={getQuantity(item.id)}
            onAdd={onAdd}
            onRemove={onRemove}
            onPress={onPress}
          />
        ))}
        {(category.items ?? []).length === 0 && (
          <Text style={styles.emptyText}>{s.restaurant.noItemsYet}</Text>
        )}
      </View>
    </View>
  );
}
