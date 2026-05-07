import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View, ViewToken, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';

import { GALLERY_HEIGHT, styles } from './TicketGallery.styles';

interface TicketGalleryProps {
  images: string[];
  backSlot?: React.ReactNode;
}

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 50 };

export function TicketGallery({ images, backSlot }: TicketGalleryProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeIndexRef = useRef(0);

  const startTimer = useCallback(() => {
    if (images.length <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const next = (activeIndexRef.current + 1) % images.length;
      activeIndexRef.current = next;
      setActiveIndex(next);
      listRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3000);
  }, [images.length]);

  useEffect(() => {
    startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startTimer]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const idx = viewableItems[0]?.index ?? 0;
    activeIndexRef.current = idx;
    setActiveIndex(idx);
  }).current;

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={listRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={[styles.image, { width }]}
            contentFit="cover"
            cachePolicy="disk"
            priority="high"
          />
        )}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onScrollBeginDrag={() => { if (intervalRef.current) clearInterval(intervalRef.current); }}
        onMomentumScrollEnd={startTimer}
      />

      {backSlot}

      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}
