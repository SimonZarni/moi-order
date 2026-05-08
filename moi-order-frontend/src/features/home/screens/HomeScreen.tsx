import React from 'react';
import { Pressable, RefreshControl, Text, View, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHomeScreen } from '@/features/home/hooks/useHomeScreen';
import { HomeCardGrid, HomeCardGridSkeleton } from '@/features/home/components/HomeCardGrid';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { colours } from '@/shared/theme/colours';
import { useLocale } from '@/shared/hooks/useLocale';
import { getHomeStrings } from '@/shared/constants/homeStrings';
import { useStrings } from '@/shared/i18n';
import { styles } from './HomeScreen.styles';

export function HomeScreen(): React.JSX.Element {
  const {
    user,
    isRefreshing,
    cards,
    isLoadingCards,
    airportServiceTypeId,
    airportPrice,
    handleRefresh,
    handleNavigateToNotifications,
    handleNavigateToSearch,
  } = useHomeScreen();

  const { locale } = useLocale();
  const t = getHomeStrings(locale);
  const s = useStrings();

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
          <View style={styles.orbLarge} />
          <View style={styles.orbSmall} />

          <View style={styles.heroTopRow}>
            <Image
              source={require('../../../../assets/in-app-logo.png')}
              style={styles.brandLogo}
              contentFit="contain"
              cachePolicy="memory"
              accessibilityLabel="Moi Order logo"
            />
            <NotificationBell onPress={handleNavigateToNotifications} />
          </View>

          <View style={styles.heroTextBlock}>
            <Text style={styles.heroGreeting}>
              {user !== null ? s.home.hello.replace('{name}', user.name.split(' ')[0]!) : s.home.welcome}
            </Text>
            <Text style={styles.heroTitle} numberOfLines={1} adjustsFontSizeToFit>
              Your all-in-one <Text style={styles.heroTitleAccent}>app</Text>
            </Text>
          </View>

          <Pressable style={styles.searchBox} onPress={handleNavigateToSearch}
            accessibilityRole="button" accessibilityLabel={s.search.placeholder}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>{s.search.placeholder}</Text>
          </Pressable>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>{t.ourServices}</Text>
            <View style={styles.sectionLine} />
          </View>

          {isLoadingCards ? (
            <HomeCardGridSkeleton />
          ) : (
            <HomeCardGrid
              cards={cards}
              airportServiceTypeId={airportServiceTypeId}
              airportPrice={airportPrice}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
