import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HomeCard } from '@/types/models';
import { HOME_CARD_ICON_TYPE } from '@/types/enums';
import { RootStackParamList } from '@/types/navigation';
import { navigateToCardScreen } from '@/features/home/utils/homeCardNavigation';
import {
  AirportIcon,
  BusIcon,
  CalendarIcon,
  EmbassyIcon,
  FlashIcon,
  FoodIcon,
  LocationIcon,
  PassportIcon,
  TicketIcon,
} from './HomeCardIcons';
import { styles } from './HomeCardGrid.styles';

// ── Icon map ─────────────────────────────────────────────────────────────────

type IconComponent = () => React.JSX.Element;

const BUILTIN_ICON_MAP: Record<string, IconComponent> = {
  calendar: CalendarIcon,
  location: LocationIcon,
  flash:    FlashIcon,
  embassy:  EmbassyIcon,
  airport:  AirportIcon,
  bus:      BusIcon,
  passport: PassportIcon,
  food:     FoodIcon,
  ticket:   TicketIcon,
};

interface CardIconProps {
  iconKey: string;
  iconType: string;
  iconUrl: string | null;
  accentColor: string;
}

function CardIcon({ iconKey, iconType, iconUrl, accentColor }: CardIconProps): React.JSX.Element | null {
  if (iconType === HOME_CARD_ICON_TYPE.Custom && iconUrl) {
    return (
      <View style={[styles.customIconWrapper, { backgroundColor: accentColor + '25' }]}>
        <Image source={{ uri: iconUrl }} style={styles.customIconImage} contentFit="contain" />
      </View>
    );
  }
  const Icon = BUILTIN_ICON_MAP[iconKey];
  return Icon ? <Icon /> : null;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface HomeCardGridProps {
  cards: HomeCard[];
  airportServiceTypeId: number | null;
  airportPrice: number | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HomeCardGrid({
  cards,
  airportServiceTypeId,
  airportPrice,
}: HomeCardGridProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = useCallback(
    (card: HomeCard) => {
      if (card.is_coming_soon) return;
      navigateToCardScreen(navigation, card.navigation_screen, card.route_type, card.route_url, {
        serviceTypeId: airportServiceTypeId,
        price:         airportPrice,
      });
    },
    [navigation, airportServiceTypeId, airportPrice]
  );

  // Pair cards into rows of 2
  const rows: HomeCard[][] = [];
  for (let i = 0; i < cards.length; i += 2) {
    rows.push(cards.slice(i, i + 2));
  }

  return (
    <>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.gridRow}>
          {row.map((card) => (
            <Pressable
              key={card.id}
              style={[
                styles.card,
                { borderTopColor: card.accent_color },
                card.is_coming_soon && styles.cardDimmed,
              ]}
              onPress={() => handlePress(card)}
              accessibilityLabel={card.title_en}
              accessibilityRole="button"
            >
              <Text style={[styles.cardTag, { color: card.accent_color }]}>
                {card.tag_en}
              </Text>
              <Text style={styles.cardTitle}>{card.title_en}</Text>
              {card.subtitle_en ? (
                <Text style={styles.cardSubtitle}>{card.subtitle_en}</Text>
              ) : null}
              {card.is_coming_soon && (
                <View style={styles.soonPill}>
                  <Text style={styles.soonText}>SOON</Text>
                </View>
              )}
              <View style={styles.cardIcon}>
                <CardIcon iconKey={card.icon_key} iconType={card.icon_type} iconUrl={card.icon_url} accentColor={card.accent_color} />
              </View>
            </Pressable>
          ))}
          {/* Pad odd row so the last card doesn't stretch full width */}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function HomeCardGridSkeleton(): React.JSX.Element {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonRow}>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCard} />
        </View>
      ))}
    </>
  );
}
