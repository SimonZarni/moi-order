/**
 * Principle: SRP — renders a single shimmer placeholder matching PlaceCard's layout.
 * Uses dark baseColor + dim shimmer so it reads correctly on the list's dark card background.
 */
import React from 'react';
import { View } from 'react-native';

import { SkeletonBox } from '@/shared/components/SkeletonBox/SkeletonBox';
import { radius } from '@/shared/theme/radius';
import { styles } from './PlaceCardSkeleton.styles';

// Must match PlaceCard.styles.ts card height
const CARD_HEIGHT = 160;

export function PlaceCardSkeleton(): React.JSX.Element {
  return (
    <View style={styles.shadowWrap}>
      {/* Full-card shimmer — same height as the real image card */}
      <SkeletonBox
        height={CARD_HEIGHT}
        baseColor="#1a2e2c"
        shimmerColor="rgba(255,255,255,0.06)"
      />
      {/* Simulated bottom meta (name line + city line) so the shape feels populated */}
      <View style={styles.metaStrip}>
        <SkeletonBox
          height={14}
          borderRadius={radius.sm}
          baseColor="#253e3b"
          shimmerColor="rgba(255,255,255,0.06)"
          style={{ width: '60%' }}
        />
        <SkeletonBox
          height={11}
          borderRadius={radius.sm}
          baseColor="#253e3b"
          shimmerColor="rgba(255,255,255,0.06)"
          style={{ width: '35%' }}
        />
      </View>
    </View>
  );
}
