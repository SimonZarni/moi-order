import React from 'react';
import { Pressable, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { useHomeScreen } from '@/features/home/hooks/useHomeScreen';
import { styles } from './HomeScreen.styles';

export function HomeScreen(): React.JSX.Element {
  const {
    user,
    isLoggedIn,
    handleNavigateToNinetyDayReport,
    handleNavigateToTickets,
    handleNavigateToPlaces,
    handleNavigateToOtherServices,
    handleNavigateToLogin,
    handleLogout,
  } = useHomeScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          {/* Decorative orbs */}
          <View style={styles.orbLarge} />
          <View style={styles.orbSmall} />

          <View style={styles.heroTopRow}>
            <View style={styles.brandRow}>
              <View style={styles.brandDot} />
              <Text style={styles.brandLabel}>MOI Order</Text>
            </View>
            {isLoggedIn ? (
              <Pressable style={styles.authBtn} onPress={handleLogout}
                accessibilityLabel="Sign out" accessibilityRole="button">
                <Text style={styles.authBtnText}>Sign Out</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.authBtn} onPress={handleNavigateToLogin}
                accessibilityLabel="Sign in" accessibilityRole="button">
                <Text style={styles.authBtnText}>Sign In</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.heroTextBlock}>
            <Text style={styles.heroGreeting}>
              {user !== null ? `Hello, ${user.name.split(' ')[0]}` : 'Welcome'}
            </Text>
            <Text style={styles.heroTitle} numberOfLines={1} adjustsFontSizeToFit>
              Your all-in-one <Text style={styles.heroTitleAccent}>app</Text>
            </Text>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>Our Services</Text>
            <View style={styles.sectionLine} />
          </View>

          {/* Row 1 */}
          <View style={styles.gridRow}>
            <Pressable style={[styles.card, styles.cardAccentSage]}
              onPress={handleNavigateToNinetyDayReport}
              accessibilityLabel="90-Day Report service" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagSage]}>Immigration</Text>
              <Text style={styles.cardTitle}>90-Day{'\n'}Report</Text>
              <Text style={styles.cardSubtitle}>รายงานตัว 90 วัน</Text>
              <Ionicons name="calendar" size={28} color={colours.primary} style={styles.cardIcon} />
            </Pressable>

            <Pressable style={[styles.card, styles.cardAccentSlate]}
              onPress={handleNavigateToTickets}
              accessibilityLabel="Tickets" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagSlate]}>Attractions</Text>
              <Text style={styles.cardTitle}>Tickets</Text>
              <Text style={styles.cardSubtitle}>Theme parks & more</Text>
              <Ionicons name="pricetag" size={28} color={colours.medium} style={styles.cardIcon} />
            </Pressable>
          </View>

          {/* Row 2 */}
          <View style={styles.gridRow}>
            <Pressable style={[styles.card, styles.cardAccentGold]}
              onPress={handleNavigateToPlaces}
              accessibilityLabel="Places — immigration offices" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagGold]}>Explore</Text>
              <Text style={styles.cardTitle}>Places</Text>
              <Text style={styles.cardSubtitle}>Attractions & Landmarks</Text>
              <Ionicons name="location" size={28} color={colours.secondary} style={styles.cardIcon} />
            </Pressable>

            <Pressable style={[styles.card, styles.cardAccentTeal]}
              onPress={handleNavigateToOtherServices}
              accessibilityLabel="Other services" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagTeal]}>Registration</Text>
              <Text style={styles.cardTitle}>Other{'\n'}Services</Text>
              <Text style={styles.cardSubtitle}>Company & more</Text>
              <Ionicons name="flash" size={28} color={colours.tertiary} style={styles.cardIcon} />
            </Pressable>
          </View>
        </View>

      </ScrollView>
      <FloatingTabBar />
    </SafeAreaView>
  );
}
