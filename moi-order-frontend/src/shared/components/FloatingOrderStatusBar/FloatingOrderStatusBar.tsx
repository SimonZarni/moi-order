import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigationRef } from '@/shared/navigation/navigationRef';
import { useFoodActiveOrder } from '@/shared/hooks/useFoodActiveOrder';
import { STATUS_DOT_COLOURS, styles } from './FloatingOrderStatusBar.styles';

export function FloatingOrderStatusBar(): React.JSX.Element | null {
  const activeOrder = useFoodActiveOrder();
  const slideY = useRef(new Animated.Value(120)).current;
  const [isOnHome, setIsOnHome] = useState(false);

  // Slide in when order appears, slide out when it disappears.
  useEffect(() => {
    if (activeOrder !== null) {
      Animated.spring(slideY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }).start();
    } else {
      Animated.timing(slideY, {
        toValue: 120,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [activeOrder, slideY]);

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

  if (activeOrder === null || !isOnHome) return null;

  const dotColour = STATUS_DOT_COLOURS[activeOrder.status] ?? '#9ca3af';

  function handlePress(): void {
    if (!navigationRef.isReady()) return;
    navigationRef.navigate('FoodOrderDetail', { orderId: activeOrder!.id });
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideY }] }]}>
      <Pressable
        style={styles.bar}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Active order: ${activeOrder.status_label}`}
      >
        <View style={[styles.dot, { backgroundColor: dotColour }]} />
        <View style={styles.textGroup}>
          <Text style={styles.statusLabel} numberOfLines={1}>{activeOrder.status_label}</Text>
          {activeOrder.restaurant_name != null && (
            <>
              <Text style={styles.separator}>·</Text>
              <Text style={styles.restaurantName} numberOfLines={1}>{activeOrder.restaurant_name}</Text>
            </>
          )}
        </View>
        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.45)" />
      </Pressable>
    </Animated.View>
  );
}
