import React from 'react';
import { View } from 'react-native';

import { SkeletonBox } from '@/shared/components/SkeletonBox/SkeletonBox';
import { radius } from '@/shared/theme/radius';
import { styles } from './PlaceCardSkeleton.styles';

// Must match PlaceCard.styles.ts card height
const CARD_HEIGHT = 220;

export function PlaceCardSkeleton(): React.JSX.Element {
  return (
    <View style={styles.shadowWrap}>
      {/* Separate clip wrapper — overflow:hidden can't live on shadowWrap or it kills shadow */}
      <View style={styles.cardClip}>
        <SkeletonBox
          height={CARD_HEIGHT}
          borderRadius={0}
          baseColor="#1a2e2c"
          shimmerColor="rgba(255,255,255,0.06)"
        />
        {/* Simulated glass panel: category pill + name + meta */}
        <View style={styles.metaStrip}>
          <SkeletonBox
            height={18}
            borderRadius={radius.full}
            baseColor="#253e3b"
            shimmerColor="rgba(255,255,255,0.06)"
            style={{ width: 72 }}
          />
          <SkeletonBox
            height={14}
            borderRadius={radius.sm}
            baseColor="#253e3b"
            shimmerColor="rgba(255,255,255,0.06)"
            style={{ width: '58%' }}
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
    </View>
  );
}
