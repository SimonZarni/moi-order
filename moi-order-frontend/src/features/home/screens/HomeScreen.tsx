import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHomeScreen } from '@/features/home/hooks/useHomeScreen';
import { styles } from './HomeScreen.styles';

export function HomeScreen(): React.JSX.Element {
  const { user, handleNavigateToNinetyDayReport, handleNavigateToOtherServices, handleLogout } = useHomeScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <Text style={styles.brandLabel}>MOI Order</Text>
            <Pressable
              style={styles.logoutBtn}
              onPress={handleLogout}
              accessibilityLabel="Sign out"
              accessibilityRole="button"
            >
              <Text style={styles.logoutText}>Sign Out</Text>
            </Pressable>
          </View>
          <Text style={styles.heroGreeting}>
            {user !== null ? `Hello, ${user.name.split(' ')[0]}` : 'Welcome'}
          </Text>
          <Text style={styles.heroTitle}>
            Immigration{'\n'}
            <Text style={styles.heroTitleAccent}>Services</Text>, Simplified.
          </Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.sectionLabel}>Our Services</Text>

          {/* 90-Day Report card */}
          <Pressable
            style={styles.serviceCard}
            onPress={handleNavigateToNinetyDayReport}
            accessibilityLabel="90-Day Report service"
            accessibilityRole="button"
          >
            <View style={styles.serviceCardContent}>
              <View style={styles.serviceCardBadge}>
                <Text style={styles.serviceCardBadgeText}>Immigration</Text>
              </View>
              <Text style={styles.serviceCardTitle}>90-Day Report</Text>
              <Text style={styles.serviceCardSubtitle}>รายงานตัว 90 วัน</Text>
              <View style={styles.serviceCardTypesRow}>
                {['Default', 'Big Visa', 'Big Visa / Region'].map((type) => (
                  <View key={type} style={styles.serviceCardTypeTag}>
                    <Text style={styles.serviceCardTypeTagText}>{type}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.serviceCardArrow}>
              <Text style={styles.serviceCardArrowText}>›</Text>
            </View>
          </Pressable>

          {/* Other Services card */}
          <Pressable
            style={styles.otherServicesCard}
            onPress={handleNavigateToOtherServices}
            accessibilityLabel="Other services"
            accessibilityRole="button"
          >
            <View style={styles.serviceCardContent}>
              <View style={styles.otherServicesBadge}>
                <Text style={styles.otherServicesBadgeText}>Registration &amp; More</Text>
              </View>
              <Text style={styles.otherServicesTitle}>Other Services</Text>
              <Text style={styles.otherServicesSubtitle}>Company registration and more</Text>
            </View>
            <View style={styles.otherServicesArrow}>
              <Text style={styles.otherServicesArrowText}>›</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
