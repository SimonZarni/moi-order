import React, { useCallback, useEffect, useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent, Pressable, ScrollView, Text, View } from 'react-native';
import { MenuCategory } from '@/types/models';
import { styles } from './CategoryTabBar.styles';

interface Props {
  categories:       MenuCategory[];
  activeIndex:      number;
  onTabPress:       (index: number) => void;
  onHeightMeasured: (height: number) => void;
}

export function CategoryTabBar({ categories, activeIndex, onTabPress, onHeightMeasured }: Props): React.JSX.Element {
  const scrollRef      = useRef<ScrollView>(null);
  const tabXOffsetsRef = useRef<number[]>([]);
  const scrollXRef     = useRef(0);

  useEffect(() => {
    const x      = tabXOffsetsRef.current[activeIndex] ?? 0;
    const target = Math.max(0, x - 40);
    if (target < scrollXRef.current) {
      // Backward (left) scroll: Android ignores a programmatic scrollTo during or
      // immediately after an animated forward scroll. Stop the in-flight scroll at
      // its current position first, then issue the leftward jump next frame.
      scrollRef.current?.scrollTo({ x: scrollXRef.current, animated: false });
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ x: target, animated: true });
      });
    } else {
      scrollRef.current?.scrollTo({ x: target, animated: true });
    }
  }, [activeIndex]);

  const handleContainerLayout = useCallback(
    (e: { nativeEvent: { layout: { height: number } } }) => {
      onHeightMeasured(e.nativeEvent.layout.height);
    },
    [onHeightMeasured],
  );

  const handleTabBarScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollXRef.current = e.nativeEvent.contentOffset.x;
    },
    [],
  );

  return (
    <View onLayout={handleContainerLayout} style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={handleTabBarScroll}
      >
        {categories.map((cat, i) => (
          <Pressable
            key={cat.id}
            style={styles.tab}
            onPress={() => onTabPress(i)}
            onLayout={(e) => { tabXOffsetsRef.current[i] = e.nativeEvent.layout.x; }}
            accessibilityRole="tab"
            accessibilityLabel={cat.name}
            accessibilityState={{ selected: i === activeIndex }}
          >
            <Text style={[styles.tabLabel, i === activeIndex && styles.tabLabelActive]}>
              {cat.name}
            </Text>
            {i === activeIndex && <View style={styles.activeBar} />}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
