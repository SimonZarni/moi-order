import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HomeCard } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { navigateToCardScreen } from '@/features/home/utils/homeCardNavigation';
import { useLocale } from '@/shared/hooks/useLocale';
import { CardIcon } from './HomeCardIcons';
import { styles } from './HomeCardGroup.styles';

// ── Props ─────────────────────────────────────────────────────────────────────

interface HomeCardGroupProps {
  card: HomeCard;
  airportServiceTypeId: number | null;
  airportServiceId: number | null;
  airportServiceName: string | null;
  airportPrice: number | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HomeCardGroup({
  card,
  airportServiceTypeId,
  airportServiceId,
  airportServiceName,
  airportPrice,
}: HomeCardGroupProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { locale } = useLocale();

  const handleTilePress = useCallback(
    (child: HomeCard) => {
      if (child.is_coming_soon || child.navigation_screen === null) return;
      navigateToCardScreen(
        navigation,
        child.navigation_screen,
        child.route_type,
        child.route_url,
        { serviceTypeId: airportServiceTypeId, serviceId: airportServiceId, serviceName: airportServiceName, price: airportPrice },
        child.navigation_params,
      );
    },
    [navigation, airportServiceTypeId, airportServiceId, airportServiceName, airportPrice]
  );

  const title    = locale === 'mm' ? card.title_mm    : card.title_en;
  const subtitle = locale === 'mm' ? (card.subtitle_mm ?? card.subtitle_en) : card.subtitle_en;
  const tag      = locale === 'mm' ? card.tag_mm      : card.tag_en;
  // Myanmar syllable clusters break with any letterSpacing > 0.
  const isMM = locale === 'mm';

  return (
    <View style={[styles.card, { borderTopColor: card.border_color }]}>
      {/* Header — group icon sits absolute top-right */}
      <View style={styles.groupIcon}>
        <CardIcon iconKey={card.icon_key} iconType={card.icon_type} iconUrl={card.icon_url} iconColor={card.icon_color} />
      </View>

      <Text style={[styles.cardTag, { color: card.accent_color }, isMM && styles.mmCardTag]} allowFontScaling={!isMM}>{tag}</Text>
      <Text style={[styles.cardTitle, isMM && styles.mmCardTitle]} allowFontScaling={!isMM}>{title}</Text>
      {subtitle ? <Text style={[styles.cardSubtitle, isMM && styles.mmCardSubtitle]} allowFontScaling={!isMM}>{subtitle}</Text> : null}

      {/* Tile row — one tile per child service */}
      <View style={styles.tileRow}>
        {(card.children ?? []).map((child) => {
          const childTitle = locale === 'mm' ? child.title_mm : child.title_en;
          return (
            <Pressable
              key={child.id}
              style={[styles.tile, child.is_coming_soon && styles.tileDimmed]}
              onPress={() => handleTilePress(child)}
              accessibilityLabel={childTitle}
              accessibilityRole="button"
            >
              <View style={styles.tileIconWrap}>
                <CardIcon
                  iconKey={child.icon_key}
                  iconType={child.icon_type}
                  iconUrl={child.icon_url}
                  iconColor={child.icon_color}
                />
              </View>
              <Text
                style={[styles.tileLabel, { color: child.accent_color }, isMM && styles.mmTileLabel]}
                numberOfLines={2}
                ellipsizeMode="tail"
                allowFontScaling={!isMM}
              >
                {childTitle}
              </Text>
              {child.is_coming_soon && (
                <View style={styles.soonPill}>
                  <Text style={styles.soonText}>SOON</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
