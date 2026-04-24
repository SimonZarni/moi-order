import React from 'react';
import { Pressable, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHomeScreen } from '@/features/home/hooks/useHomeScreen';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { useLocale } from '@/shared/hooks/useLocale';
import { getHomeStrings } from '@/shared/constants/homeStrings';
import { CalendarIcon, FlashIcon, LocationIcon, TicketIcon } from '../components/HomeCardIcons';
import { styles } from './HomeScreen.styles';

export function HomeScreen(): React.JSX.Element {
  const {
    user,
    handleNavigateToNinetyDayReport,
    handleNavigateToTickets,
    handleNavigateToPlaces,
    handleNavigateToOtherServices,
    handleNavigateToNotifications,
  } = useHomeScreen();

  const { locale } = useLocale();
  const t = getHomeStrings(locale);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

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
            <NotificationBell onPress={handleNavigateToNotifications} />
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
            <Text style={styles.sectionLabel}>{t.ourServices}</Text>
            <View style={styles.sectionLine} />
          </View>

          {/* Row 1 */}
          <View style={styles.gridRow}>
            <Pressable style={[styles.card, styles.cardAccentSage]}
              onPress={handleNavigateToNinetyDayReport}
              accessibilityLabel="90-Day Report service" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagSage]}>Immigration</Text>
              <Text style={styles.cardTitle}>{t.ninetyDayReport}</Text>
              <View style={styles.cardIcon}><CalendarIcon /></View>
            </Pressable>

            <Pressable style={[styles.card, styles.cardAccentSlate]}
              onPress={handleNavigateToTickets}
              accessibilityLabel="Tickets" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagSlate]}>Attractions</Text>
              <Text style={styles.cardTitle}>{t.tickets}</Text>
              <Text style={styles.cardSubtitle}>{t.themeParks}</Text>
              <View style={styles.cardIcon}><TicketIcon /></View>
            </Pressable>
          </View>

          {/* Row 2 */}
          <View style={styles.gridRow}>
            <Pressable style={[styles.card, styles.cardAccentGold]}
              onPress={handleNavigateToPlaces}
              accessibilityLabel="Places — immigration offices" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagGold]}>Explore</Text>
              <Text style={styles.cardTitle}>{t.places}</Text>
              <Text style={styles.cardSubtitle}>{t.attractionsLandmarks}</Text>
              <View style={styles.cardIcon}><LocationIcon /></View>
            </Pressable>

            <Pressable style={[styles.card, styles.cardAccentTeal]}
              onPress={handleNavigateToOtherServices}
              accessibilityLabel="Other services" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagTeal]}>Registration</Text>
              <Text style={styles.cardTitle}>{t.otherServices}</Text>
              <Text style={styles.cardSubtitle}>{t.companyMore}</Text>
              <View style={styles.cardIcon}><FlashIcon /></View>
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
