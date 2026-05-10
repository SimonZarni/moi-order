import React, { useEffect, useRef } from 'react';
import { Animated, ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { useMaintenanceScreen } from '../hooks/useMaintenanceScreen';
import { styles } from './MaintenanceScreen.styles';

function formatSeconds(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function MaintenanceScreen(): React.JSX.Element {
  const { message, details, secondsLeft, isChecking, handleRetry } = useMaintenanceScreen();

  const outerScale = useRef(new Animated.Value(1)).current;
  const innerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(outerScale, { toValue: 1.35, duration: 1400, useNativeDriver: true }),
        Animated.timing(outerScale, { toValue: 1,    duration: 1400, useNativeDriver: true }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(innerScale, { toValue: 1.2,  duration: 1200, useNativeDriver: true }),
        Animated.timing(innerScale, { toValue: 1,    duration: 1200, useNativeDriver: true }),
      ]),
    ).start();
  }, [outerScale, innerScale]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Pulsing rings + icon */}
      <Animated.View style={[styles.ringOuter, { transform: [{ scale: outerScale }] }]} />
      <Animated.View style={[styles.ringInner, { transform: [{ scale: innerScale }] }]} />

      <View style={styles.iconCircle}>
        <Ionicons name="construct-outline" size={48} color={colours.white} />
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text style={styles.title}>Under Maintenance</Text>
        <Text style={styles.subtitle}>{message}</Text>
        <Text style={styles.details}>{details}</Text>
      </View>

      {/* Countdown */}
      {secondsLeft !== null && secondsLeft > 0 && (
        <View style={styles.timerCard}>
          <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.5)" />
          <Text style={styles.timerText}>Estimated wait: </Text>
          <Text style={styles.timerValue}>{formatSeconds(secondsLeft)}</Text>
        </View>
      )}

      {/* Retry */}
      <Pressable
        style={styles.retryBtn}
        onPress={handleRetry}
        disabled={isChecking}
        accessibilityRole="button"
        accessibilityLabel="Check if service is restored"
      >
        {isChecking
          ? <ActivityIndicator size="small" color={colours.white} />
          : <Ionicons name="refresh-outline" size={18} color={colours.white} />
        }
        <Text style={styles.retryBtnText}>{isChecking ? 'Checking…' : 'Try Again'}</Text>
      </Pressable>

      {/* Branding */}
      <View style={styles.branding}>
        <View style={styles.brandingDot} />
        <Text style={styles.brandingName}>Moi Order</Text>
        <Text style={styles.brandingSub}>We'll be right back</Text>
      </View>
    </SafeAreaView>
  );
}
