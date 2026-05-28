import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigationRef } from '@/shared/navigation/navigationRef';
import { useFoodActiveOrder } from '@/shared/hooks/useFoodActiveOrder';
import { TAB_BAR_BOTTOM_OFFSET, TAB_BAR_HEIGHT } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';
import { STATUS_DOT_COLOURS, styles } from './FloatingOrderStatusBar.styles';

export function FloatingOrderStatusBar(): React.JSX.Element | null {
  const activeOrders = useFoodActiveOrder();
  const insets       = useSafeAreaInsets();
  const slideY       = useRef(new Animated.Value(120)).current;
  const [isOnHome, setIsOnHome]     = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const barBottom = TAB_BAR_BOTTOM_OFFSET + insets.bottom + TAB_BAR_HEIGHT;
  const hasOrders = activeOrders.length > 0;
  const multi     = activeOrders.length > 1;

  // Clamp index when the order list changes (e.g. one order completes).
  useEffect(() => {
    if (activeOrders.length > 0) {
      setCurrentIndex((i) => Math.min(i, activeOrders.length - 1));
    }
  }, [activeOrders.length]);

  // Slide in when orders appear, slide out when none remain.
  useEffect(() => {
    if (hasOrders) {
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }).start();
    } else {
      Animated.timing(slideY, { toValue: 120, duration: 250, useNativeDriver: true }).start();
    }
  }, [hasOrders, slideY]);

  // Only show on the Home tab screen.
  useEffect(() => {
    function check(): void {
      if (!navigationRef.isReady()) return;
      const route = navigationRef.getCurrentRoute();
      setIsOnHome(route?.name === 'Home');
    }
    check();
    const unsub = navigationRef.addListener('state', check);
    return unsub;
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + activeOrders.length) % activeOrders.length);
  }, [activeOrders.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % activeOrders.length);
  }, [activeOrders.length]);

  if (!hasOrders || !isOnHome) return null;

  const activeOrder = activeOrders[currentIndex]!;
  const dotColour   = STATUS_DOT_COLOURS[activeOrder.status] ?? '#9ca3af';

  function handlePress(): void {
    if (!navigationRef.isReady()) return;
    navigationRef.navigate('FoodOrderDetail', { orderId: activeOrder.id });
  }

  return (
    <Animated.View style={[styles.container, { bottom: barBottom, transform: [{ translateY: slideY }] }]}>
      <View style={styles.bar}>
        {multi && (
          <Pressable
            style={styles.arrowBtn}
            onPress={handlePrev}
            accessibilityRole="button"
            accessibilityLabel="Previous order"
          >
            <Ionicons name="chevron-back" size={16} color="rgba(255,255,255,0.55)" />
          </Pressable>
        )}

        <Pressable
          style={styles.textGroup}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={`Active order: ${activeOrder.status_label}`}
        >
          <View style={[styles.dot, { backgroundColor: dotColour }]} />
          <Text style={styles.statusLabel} numberOfLines={1}>{activeOrder.status_label}</Text>
          {activeOrder.restaurant_name != null && (
            <>
              <Text style={styles.separator}>·</Text>
              <Text style={styles.restaurantName} numberOfLines={1}>{activeOrder.restaurant_name}</Text>
            </>
          )}
        </Pressable>

        {multi && (
          <Pressable
            style={styles.arrowBtn}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next order"
          >
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.55)" />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}
