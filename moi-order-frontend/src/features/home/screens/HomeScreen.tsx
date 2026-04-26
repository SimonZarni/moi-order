import React from 'react';
import { Pressable, RefreshControl, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHomeScreen } from '@/features/home/hooks/useHomeScreen';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { colours } from '@/shared/theme/colours';
import { useLocale } from '@/shared/hooks/useLocale';
import { getHomeStrings } from '@/shared/constants/homeStrings';
import { AirportIcon, CalendarIcon, EmbassyIcon, FlashIcon, FoodIcon, LocationIcon, PassportIcon, TicketIcon } from '../components/HomeCardIcons';
import { styles } from './HomeScreen.styles';

export function HomeScreen(): React.JSX.Element {
  const {
    user,
    isRefreshing,
    handleRefresh,
    handleNavigateToNinetyDayReport,
    handleNavigateToTickets,
    handleNavigateToPlaces,
    handleNavigateToOtherServices,
    handleNavigateToEmbassyServices,
    handleNavigateToAirportFastTrack,
    handleNavigateToNotifications,
  } = useHomeScreen();

  const { locale } = useLocale();
  const t = getHomeStrings(locale);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colours.tertiary} />
          }
        >

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

          {/* Row 3 */}
          <View style={styles.gridRow}>
            <Pressable style={[styles.card, styles.cardAccentRose]}
              onPress={handleNavigateToEmbassyServices}
              accessibilityLabel="Embassy support letters" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagRose]}>Embassy</Text>
              <Text style={styles.cardTitle}>{t.embassyServices}</Text>
              <Text style={styles.cardSubtitle}>{t.embassyMore}</Text>
              <View style={styles.cardIcon}><EmbassyIcon /></View>
            </Pressable>

            <Pressable style={[styles.card, styles.cardAccentSky]}
              onPress={handleNavigateToAirportFastTrack}
              accessibilityLabel="Airport Fast Track service" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagSky]}>Travel</Text>
              <Text style={styles.cardTitle}>{t.airportFastTrack}</Text>
              <Text style={styles.cardSubtitle}>{t.airportSubtitle}</Text>
              <View style={styles.cardIcon}><AirportIcon /></View>
            </Pressable>
          </View>

          {/* Row 4 */}
          <View style={styles.gridRow}>
            <Pressable style={[styles.card, styles.cardAccentIndigo, styles.cardDimmed]}
              accessibilityLabel="Passport and CI services — coming soon" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagIndigo]}>Documents</Text>
              <Text style={styles.cardTitle}>{t.passport}</Text>
              <Text style={styles.cardSubtitle}>{t.passportSubtitle}</Text>
              <View style={styles.soonPill}><Text style={styles.soonText}>SOON</Text></View>
              <View style={styles.cardIcon}><PassportIcon /></View>
            </Pressable>

            <Pressable style={[styles.card, styles.cardAccentCoral, styles.cardDimmed]}
              accessibilityLabel="Food ordering — coming soon" accessibilityRole="button">
              <Text style={[styles.cardTag, styles.tagCoral]}>Food</Text>
              <Text style={styles.cardTitle}>{t.foodOrder}</Text>
              <Text style={styles.cardSubtitle}>{t.foodOrderSubtitle}</Text>
              <View style={styles.soonPill}><Text style={styles.soonText}>SOON</Text></View>
              <View style={styles.cardIcon}><FoodIcon /></View>
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
