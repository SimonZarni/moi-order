import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './MenuItemCard.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { MENU_ITEM_STATUS, type MenuItemStatus } from '../../../types/enums';
import type { MenuItem } from '../../../types/models';

const STATUS_LABELS: Record<MenuItemStatus, string> = {
  [MENU_ITEM_STATUS.Available]: 'Available',
  [MENU_ITEM_STATUS.OutOfStock]: 'Sold Out',
  [MENU_ITEM_STATUS.Hidden]: 'Hidden',
};

const STATUS_COLOURS: Record<MenuItemStatus, string> = {
  [MENU_ITEM_STATUS.Available]: colours.success,
  [MENU_ITEM_STATUS.OutOfStock]: colours.warning,
  [MENU_ITEM_STATUS.Hidden]: colours.medium,
};

interface MenuItemCardProps {
  item: MenuItem;
  isGuarded: boolean;
  onToggleStatus: (id: number, status: MenuItemStatus) => void;
  onDelete: (id: number) => void;
  onEdit: (item: MenuItem) => void;
}

export function MenuItemCard({
  item,
  isGuarded,
  onToggleStatus,
  onDelete,
  onEdit,
}: MenuItemCardProps): React.JSX.Element {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingStatus, setConfirmingStatus] = useState(false);
  const [showGuard, setShowGuard] = useState(false);

  const statusColour = STATUS_COLOURS[item.status];
  const hasDiscount =
    item.original_price_cents !== null && item.original_price_cents > item.price_cents;

  const handleEditPress = useCallback(() => onEdit(item), [item, onEdit]);

  const handleDeletePress = useCallback(() => {
    if (isGuarded) { setShowGuard(true); return; }
    setConfirmingDelete(true);
  }, [isGuarded]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmingDelete(false);
    onDelete(item.id);
  }, [item.id, onDelete]);

  const handleSelectStatus = useCallback(
    (status: MenuItemStatus) => {
      setConfirmingStatus(false);
      onToggleStatus(item.id, status);
    },
    [item.id, onToggleStatus],
  );

  return (
    <View style={styles.card}>
      {/* ── Image ─────────────────────────────────────────────────────────── */}
      <View style={styles.imageWrap}>
        {item.photo_url !== null ? (
          <Image
            source={{ uri: item.photo_url }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={item.name}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="fast-food-outline" size={40} color={colours.textSubtle} />
          </View>
        )}

        {/* Status dot — top-right corner of image */}
        <View style={[styles.statusDot, { backgroundColor: statusColour }]} />

        {/* Discount ribbon */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>SALE</Text>
          </View>
        )}
      </View>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <View style={styles.body}>
        {/* Top group — name + description float to top */}
        <View style={styles.bodyTop}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          {item.description !== null && item.description.trim().length > 0 && (
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          )}
        </View>

        {/* Bottom group — price + actions always sit at bottom */}
        <View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(item.price_cents)}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>{formatPrice(item.original_price_cents!)}</Text>
          )}
        </View>

        <View style={styles.footer}>
          {/* Status chip — tap to open status picker */}
          <Pressable
            style={[styles.statusChip, { borderColor: statusColour + '44' }]}
            onPress={() => setConfirmingStatus(true)}
            accessibilityLabel={`Status: ${STATUS_LABELS[item.status]}, tap to change`}
            accessibilityRole="button"
          >
            <View style={[styles.statusDotSmall, { backgroundColor: statusColour }]} />
            <Text style={[styles.statusLabel, { color: statusColour }]} numberOfLines={1}>
              {STATUS_LABELS[item.status]}
            </Text>
          </Pressable>

          {/* Edit + delete icon buttons */}
          <View style={styles.iconRow}>
            <Pressable
              style={styles.iconBtn}
              onPress={handleEditPress}
              accessibilityLabel={`Edit ${item.name}`}
              accessibilityRole="button"
            >
              <Ionicons name="pencil-outline" size={16} color={colours.primary} />
            </Pressable>
            <Pressable
              style={[styles.iconBtn, styles.iconBtnDanger]}
              onPress={handleDeletePress}
              accessibilityLabel={`Delete ${item.name}`}
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={16} color={colours.error} />
            </Pressable>
          </View>
        </View>
        </View>{/* end bottom group */}
      </View>

      {/* ── Inline: delete confirmation ────────────────────────────────────── */}
      {confirmingDelete && (
        <View style={styles.actionBar}>
          <Text style={styles.actionBarText} numberOfLines={1}>Delete "{item.name}"?</Text>
          <View style={styles.actionBarBtns}>
            <Pressable
              style={styles.actionBtnDanger}
              onPress={handleConfirmDelete}
              accessibilityRole="button"
              accessibilityLabel="Confirm delete"
            >
              <Text style={styles.actionBtnDangerText}>Delete</Text>
            </Pressable>
            <Pressable
              style={styles.actionBtnCancel}
              onPress={() => setConfirmingDelete(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={styles.actionBtnCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ── Inline: status picker ──────────────────────────────────────────── */}
      {confirmingStatus && (
        <View style={styles.actionBar}>
          <Text style={styles.actionBarText}>Set status:</Text>
          <View style={styles.statusPickerRow}>
            <Pressable
              style={[styles.statusPickerOpt, { borderColor: colours.success }]}
              onPress={() => handleSelectStatus(MENU_ITEM_STATUS.Available)}
              accessibilityRole="button"
              accessibilityLabel="Set available"
            >
              <Text style={[styles.statusPickerText, { color: colours.success }]}>Available</Text>
            </Pressable>
            <Pressable
              style={[styles.statusPickerOpt, { borderColor: colours.warning }]}
              onPress={() => handleSelectStatus(MENU_ITEM_STATUS.OutOfStock)}
              accessibilityRole="button"
              accessibilityLabel="Set sold out"
            >
              <Text style={[styles.statusPickerText, { color: colours.warning }]}>Sold Out</Text>
            </Pressable>
            <Pressable
              style={[styles.statusPickerOpt, { borderColor: colours.medium }]}
              onPress={() => handleSelectStatus(MENU_ITEM_STATUS.Hidden)}
              accessibilityRole="button"
              accessibilityLabel="Set hidden"
            >
              <Text style={[styles.statusPickerText, { color: colours.medium }]}>Hidden</Text>
            </Pressable>
            <Pressable
              onPress={() => setConfirmingStatus(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancel status change"
              style={styles.statusPickerClose}
            >
              <Ionicons name="close" size={16} color={colours.textMuted} />
            </Pressable>
          </View>
        </View>
      )}

      {/* ── Inline: guard warning ──────────────────────────────────────────── */}
      {showGuard && (
        <View style={styles.actionBar}>
          <Text style={styles.actionBarText}>Must keep at least 1 item here.</Text>
          <View style={styles.actionBarBtns}>
            <Pressable
              style={styles.actionBtnPrimary}
              onPress={() => { setShowGuard(false); onEdit(item); }}
              accessibilityRole="button"
              accessibilityLabel="Edit item instead"
            >
              <Text style={styles.actionBtnPrimaryText}>Edit Instead</Text>
            </Pressable>
            <Pressable
              style={styles.actionBtnCancel}
              onPress={() => setShowGuard(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={styles.actionBtnCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
