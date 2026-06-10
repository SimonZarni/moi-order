import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { RestaurantPhoto } from '@/types/models';
import { styles } from './RestaurantPhotoCarousel.styles';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface RestaurantPhotoCarouselProps {
  photos: RestaurantPhoto[];
  coverPhotoUrl: string | null;
}

export function RestaurantPhotoCarousel({ photos, coverPhotoUrl }: RestaurantPhotoCarouselProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);

  const slideUrls = useMemo<(string | null)[]>(() => {
    if (photos.length > 0) {
      return [...photos].sort((a, b) => a.sort_order - b.sort_order).map((p) => p.url);
    }
    return [coverPhotoUrl];
  }, [photos, coverPhotoUrl]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  }, []);

  if (slideUrls.length <= 1) {
    return (
      <View style={styles.container}>
        <Image source={slideUrls[0] ? { uri: slideUrls[0] } : null} style={styles.slide} contentFit="cover" transition={200} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {slideUrls.map((url, index) => (
          <Image key={index} source={url ? { uri: url } : null} style={[styles.slide, { width: SCREEN_WIDTH }]} contentFit="cover" transition={200} />
        ))}
      </ScrollView>
      <View style={styles.dotsRow}>
        {slideUrls.map((_, index) => (
          <View key={index} style={[styles.dot, index === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}
