import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HomeCard } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { navigateToCardScreen } from '@/features/home/utils/homeCardNavigation';
import { SkeletonBox } from '@/shared/components/SkeletonBox/SkeletonBox';
import { useLocale } from '@/shared/hooks/useLocale';
import { CardIcon } from './HomeCardIcons';
import { HomeCardGroup } from './HomeCardGroup';
import { styles } from './HomeCardGrid.styles';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface HomeCardGridProps {
  cards: HomeCard[];
  activeOrderCount: number;
  airportServiceTypeId: number | null;
  airportServiceId: number | null;
  airportServiceName: string | null;
  airportPrice: number | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HomeCardGrid({
  cards,
  activeOrderCount,
  airportServiceTypeId,
  airportServiceId,
  airportServiceName,
  airportPrice,
}: HomeCardGridProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { locale } = useLocale();

  const handlePress = useCallback(
    (card: HomeCard) => {
      if (card.is_coming_soon || card.navigation_screen === null) return;
      navigateToCardScreen(
        navigation,
        card.navigation_screen,
        card.route_type,
        card.route_url,
        { serviceTypeId: airportServiceTypeId, serviceId: airportServiceId, serviceName: airportServiceName, price: airportPrice },
        card.navigation_params,
      );
    },
    [navigation, airportServiceTypeId, airportServiceId, airportServiceName, airportPrice]
  );

  const items: React.JSX.Element[] = [];
  let i = 0;

  while (i < cards.length) {
    const card: HomeCard | undefined = cards[i];
    if (card === undefined) break;

    if ((card.children?.length ?? 0) > 0) {
      // Full-width group card — renders its own children as mini tiles
      items.push(
        <HomeCardGroup
          key={card.id}
          card={card}
          airportServiceTypeId={airportServiceTypeId}
          airportServiceId={airportServiceId}
          airportServiceName={airportServiceName}
          airportPrice={airportPrice}
        />
      );
      i++;
    } else {
      // Pair consecutive single cards into a 2-column row
      const candidate: HomeCard | undefined = cards[i + 1];
      const pairedCard: HomeCard | null =
        candidate !== undefined && (candidate.children?.length ?? 0) === 0 ? candidate : null;

      items.push(
        <View key={`row-${i}`} style={styles.gridRow}>
          <SingleCard card={card} locale={locale} onPress={handlePress}
            orderCount={card.navigation_screen === 'Food' ? activeOrderCount : 0} />
          {pairedCard !== null
            ? <SingleCard card={pairedCard} locale={locale} onPress={handlePress}
                orderCount={pairedCard.navigation_screen === 'Food' ? activeOrderCount : 0} />
            : <View style={{ flex: 1 }} />
          }
        </View>
      );

      i += pairedCard !== null ? 2 : 1;
    }
  }

  return <>{items}</>;
}

// ── SingleCard ────────────────────────────────────────────────────────────────

interface SingleCardProps {
  card: HomeCard;
  locale: string;
  orderCount: number;
  onPress: (card: HomeCard) => void;
}

function SingleCard({ card, locale, orderCount, onPress }: SingleCardProps): React.JSX.Element {
  const title    = locale === 'mm' ? card.title_mm    : card.title_en;
  const tag      = locale === 'mm' ? card.tag_mm      : card.tag_en;
  const subtitle = locale === 'mm' ? (card.subtitle_mm ?? card.subtitle_en) : card.subtitle_en;
  // Myanmar syllable clusters break with any letterSpacing; also needs taller lineHeight.
  const isMM = locale === 'mm';

  return (
    <Pressable
      style={[styles.card, { borderTopColor: card.border_color }, card.is_coming_soon && styles.cardDimmed]}
      onPress={() => onPress(card)}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <Text style={[styles.cardTag, { color: card.accent_color }, isMM && styles.mmCardTag]} allowFontScaling={!isMM}>{tag}</Text>
      <Text style={[styles.cardTitle, isMM && styles.mmCardTitle]} allowFontScaling={!isMM}>{title}</Text>
      {subtitle ? <Text style={[styles.cardSubtitle, isMM && styles.mmCardSubtitle]} allowFontScaling={!isMM}>{subtitle}</Text> : null}
      {card.is_coming_soon && (
        <View style={styles.soonPill}>
          <Text style={styles.soonText}>SOON</Text>
        </View>
      )}
      {orderCount > 0 && (
        <View style={styles.orderBadge}>
          <Text style={styles.orderBadgeText}>{orderCount}</Text>
        </View>
      )}
      <View style={styles.cardIcon}>
        <CardIcon iconKey={card.icon_key} iconType={card.icon_type} iconUrl={card.icon_url} iconColor={card.icon_color} />
      </View>
    </Pressable>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

const SKEL_BASE  = '#e8eae9';
const SKEL_SHINE = 'rgba(255,255,255,0.65)';

function HomeSkeletonCard(): React.JSX.Element {
  return (
    <View style={styles.skeletonCardWrap}>
      <SkeletonBox height={148} baseColor={SKEL_BASE} shimmerColor={SKEL_SHINE} />
    </View>
  );
}

function HomeSkeletonGroupCard(): React.JSX.Element {
  return (
    <View style={[styles.skeletonCardWrap, { marginBottom: 12 }]}>
      <SkeletonBox height={192} baseColor={SKEL_BASE} shimmerColor={SKEL_SHINE} />
    </View>
  );
}

export function HomeCardGridSkeleton(): React.JSX.Element {
  return (
    <>
      <HomeSkeletonGroupCard />
      <HomeSkeletonGroupCard />
      {[0, 1].map((i) => (
        <View key={i} style={styles.gridRow}>
          <HomeSkeletonCard />
          <HomeSkeletonCard />
        </View>
      ))}
    </>
  );
}
