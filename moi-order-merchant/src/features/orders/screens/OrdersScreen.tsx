import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrdersScreen } from '../hooks/useOrdersScreen';
import { OrdersHeader } from '../components/OrdersHeader';
import { OrdersControlBar } from '../components/OrdersControlBar';
import { OrdersSectionGroup } from '../components/OrdersSectionGroup';
import { PrepTimeModal } from '../components/PrepTimeModal';
import { Skeleton } from '../../../shared/components/Skeleton';
import { styles } from './OrdersScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { useTranslation } from '../../../shared/hooks/useTranslation';

interface OrdersScreenProps {
  onSelectOrder?: (orderId: string) => void;
  onCancelledOrders?: () => void;
}

export function OrdersScreen({ onSelectOrder, onCancelledOrders }: OrdersScreenProps): React.JSX.Element {
  const t = useTranslation();
  const {
    sections, isLoading, statusFilter, datePreset, dateFilter,
    isToday, isRangePreset, totalVisible, tabCounts, searchQuery,
    isActionsOpen, prepTimeModalVisible, prepTimeMinutes, pending,
    handleUpdateStatus, handleStartPreparing, handlePrepTimeSelect,
    handleConfirmPrepTime, handleCancelPrepTime, handleStatusFilterChange,
    handleDatePreset, handleDatePrev, handleDateNext, handleDateToday,
    handleSearchChange, handleExportCsv, handleToggleActions, handleCloseActions,
  } = useOrdersScreen();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <OrdersHeader
        pending={pending} isActionsOpen={isActionsOpen}
        onPendingPress={() => handleStatusFilterChange('new')}
        onToggle={handleToggleActions} onClose={handleCloseActions}
        onCancelled={onCancelledOrders} onExport={handleExportCsv}
      />
      <OrdersControlBar
        statusFilter={statusFilter} datePreset={datePreset} dateFilter={dateFilter}
        isToday={isToday} isRangePreset={isRangePreset} totalVisible={totalVisible}
        tabCounts={tabCounts} searchQuery={searchQuery}
        onStatusChange={handleStatusFilterChange} onDatePreset={handleDatePreset}
        onDatePrev={handleDatePrev} onDateNext={handleDateNext}
        onDateToday={handleDateToday} onSearch={handleSearchChange}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading
          ? <View style={styles.skeletonPad}>{[1,2,3].map((i) => <Skeleton key={i} height={86} width="100%" borderRadius={16} style={styles.skeletonItem} />)}</View>
          : totalVisible === 0
          ? <View style={styles.empty}>
              <View style={styles.emptyIcon}><Ionicons name="receipt-outline" size={26} color={colours.textSubtle} /></View>
              <Text style={styles.emptyTitle}>{t('orders_no_orders_found')}</Text>
              <Text style={styles.emptyBody}>{searchQuery ? t('orders_no_orders_body_search') : t('orders_no_orders_body_filter')}</Text>
            </View>
          : sections.map((section) => (
              <OrdersSectionGroup key={section.title} section={section} onUpdateStatus={handleUpdateStatus} onStartPreparing={handleStartPreparing} onSelectOrder={onSelectOrder} />
            ))
        }
      </ScrollView>
      <PrepTimeModal visible={prepTimeModalVisible} selectedMinutes={prepTimeMinutes} onSelectMinutes={handlePrepTimeSelect} onConfirm={handleConfirmPrepTime} onCancel={handleCancelPrepTime} />
    </SafeAreaView>
  );
}
