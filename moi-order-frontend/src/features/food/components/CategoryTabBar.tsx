import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MenuCategory } from '@/types/models';
import { styles } from './CategoryTabBar.styles';

interface Props {
  categories:       MenuCategory[];
  activeIndex:      number;
  onTabPress:       (index: number) => void;
  onHeightMeasured: (height: number) => void;
}

export function CategoryTabBar({ categories, activeIndex, onTabPress, onHeightMeasured }: Props): React.JSX.Element {
  const scrollRef       = useRef<ScrollView>(null);
  const tabXOffsetsRef  = useRef<number[]>([]);

  useEffect(() => {
    const x = tabXOffsetsRef.current[activeIndex] ?? 0;
    scrollRef.current?.scrollTo({ x: Math.max(0, x - 40), animated: true });
  }, [activeIndex]);

  const handleContainerLayout = useCallback(
    (e: { nativeEvent: { layout: { height: number } } }) => {
      onHeightMeasured(e.nativeEvent.layout.height);
    },
    [onHeightMeasured],
  );

  return (
    <View onLayout={handleContainerLayout} style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
