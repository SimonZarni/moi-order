import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal, Pressable, ScrollView, Text, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { formatPrice } from '@/shared/utils/formatCurrency';
import type { MenuItem, MenuItemOption, MenuItemOptionGroup } from '@/types/models';
import type { SelectedOption } from '@/shared/store/cartStore';
import { styles } from './ModifierSheet.styles';

interface Props {
  item: MenuItem | null;
  onClose: () => void;
  onConfirm: (item: MenuItem, selectedOptions: SelectedOption[]) => void;
}

/** Map from optionGroupId → selected optionId(s). */
type SelectionMap = Record<number, number[]>;

function isGroupSatisfied(group: MenuItemOptionGroup, selection: number[]): boolean {
  if (!group.is_required) return true;
  return selection.length >= Math.max(1, group.min_selections);
}

function allGroupsSatisfied(groups: MenuItemOptionGroup[], map: SelectionMap): boolean {
  return groups.every((g) => isGroupSatisfied(g, map[g.id] ?? []));
}

function computeAdditional(groups: MenuItemOptionGroup[], map: SelectionMap): number {
  return groups.flatMap((g) =>
    (map[g.id] ?? []).map((optId) => {
      const opt = g.options.find((o) => o.id === optId);
      return opt?.additional_price_cents ?? 0;
    }),
  ).reduce((a, b) => a + b, 0);
}

function buildSelectedOptions(groups: MenuItemOptionGroup[], map: SelectionMap): SelectedOption[] {
  return groups.flatMap((g) =>
    (map[g.id] ?? []).map((optId) => {
      const opt = g.options.find((o) => o.id === optId) as MenuItemOption;
      return {
        optionGroupId:       g.id,
        optionGroupName:     g.name,
        optionId:            opt.id,
        optionName:          opt.name,
        additionalPriceCents: opt.additional_price_cents,
      };
    }),
  );
}

function OptionRow({
  group, option, selected, onToggle,
}: {
  group: MenuItemOptionGroup;
  option: MenuItemOption;
  selected: boolean;
  onToggle: (groupId: number, optionId: number, multiSelect: boolean) => void;
}): React.JSX.Element {
  const multiSelect = group.max_selections > 1;
  return (
    <Pressable
      style={styles.optionRow}
      onPress={() => onToggle(group.id, option.id, multiSelect)}
      accessibilityRole={multiSelect ? 'checkbox' : 'radio'}
      accessibilityLabel={option.name}
      accessibilityState={{ checked: selected }}
    >
      <View style={[styles.optionIndicator, selected && styles.optionIndicatorSelected]}>
        {selected && (
          <Ionicons
            name={multiSelect ? 'checkmark' : 'ellipse'}
            size={multiSelect ? 12 : 8}
            color={colours.white}
          />
        )}
      </View>
      <Text style={styles.optionName}>{option.name}</Text>
      {option.additional_price_cents > 0 && (
        <Text style={styles.optionPrice}>+{formatPrice(option.additional_price_cents / 100)}</Text>
      )}
    </Pressable>
  );
}

export function ModifierSheet({ item, onClose, onConfirm }: Props): React.JSX.Element {
  const [selectionMap, setSelectionMap] = useState<SelectionMap>({});

  useEffect(() => {
    if (item) setSelectionMap({});
  }, [item]);

  const handleToggle = useCallback((groupId: number, optionId: number, multiSelect: boolean) => {
    setSelectionMap((prev) => {
      const current = prev[groupId] ?? [];
      if (multiSelect) {
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [groupId]: next };
      }
      return { ...prev, [groupId]: current[0] === optionId ? [] : [optionId] };
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (!item) return;
    onConfirm(item, buildSelectedOptions(item.option_groups, selectionMap));
  }, [item, selectionMap, onConfirm]);

  if (!item) return <></>;

  const groups = item.option_groups.filter((g) => g.options.some((o) => o.is_available));
  const canConfirm = allGroupsSatisfied(groups, selectionMap);
  const additionalCents = computeAdditional(groups, selectionMap);
  const totalCents = item.price_cents + additionalCents;

  return (
    <Modal
      visible={item !== null}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Pressable style={styles.closeBtn} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
            <Ionicons name="close" size={22} color={colours.textMuted} />
          </Pressable>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {groups.map((group) => (
            <View key={group.id} style={styles.groupSection}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{group.name}</Text>
                <View style={[styles.groupBadge, group.is_required ? styles.groupBadgeRequired : styles.groupBadgeOptional]}>
                  <Text style={[styles.groupBadgeText, group.is_required ? styles.groupBadgeTextRequired : styles.groupBadgeTextOptional]}>
                    {group.is_required ? 'Required' : 'Optional'}
                  </Text>
                </View>
              </View>
              {group.max_selections > 1 && (
                <Text style={styles.groupHint}>Choose up to {group.max_selections}</Text>
              )}
              {group.options.filter((o) => o.is_available).map((option) => (
                <OptionRow
                  key={option.id}
                  group={group}
                  option={option}
                  selected={(selectionMap[group.id] ?? []).includes(option.id)}
                  onToggle={handleToggle}
                />
              ))}
            </View>
          ))}
          <View style={styles.scrollBottom} />
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{formatPrice(totalCents / 100)}</Text>
          <Pressable
            style={[styles.addBtn, !canConfirm && styles.addBtnDisabled]}
            onPress={handleConfirm}
            disabled={!canConfirm}
            accessibilityRole="button"
            accessibilityLabel="Add to cart"
          >
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
