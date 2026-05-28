import React from 'react';
import { FlatList, Pressable, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UserAddress } from '@/types/models';
import { colours } from '@/shared/theme/colours';
import { AddressCard } from '../components/AddressCard';
import { useAddressListScreen } from '../hooks/useAddressListScreen';
import { styles } from './AddressListScreen.styles';

export function AddressListScreen(): React.JSX.Element {
  const {
    addresses, isLoading, mode,
    handleSelect, handleAddNew, handleEdit, handleDelete, handleBack,
  } = useAddressListScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {mode === 'select' ? 'Delivery Addresses' : 'My Addresses'}
        </Text>
        <Pressable style={styles.addBtn} onPress={handleAddNew} accessibilityRole="button" accessibilityLabel="Add new address">
          <Ionicons name="add" size={22} color={colours.textOnDark} />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colours.primary} />
        </View>
      ) : (
        <FlatList<UserAddress>
          data={addresses}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          accessibilityRole="list"
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="location-outline" size={40} color={colours.textMuted} />
              <Text style={styles.emptyTitle}>No addresses yet</Text>
              <Text style={styles.emptyBody}>Tap + to add your delivery address.</Text>
            </View>
          }
          renderItem={({ item }) =>
            mode === 'select' ? (
              <AddressCard address={item} onPress={() => handleSelect(item)} />
            ) : (
              <AddressCard
                address={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
              />
            )
          }
        />
      )}
    </SafeAreaView>
  );
}
