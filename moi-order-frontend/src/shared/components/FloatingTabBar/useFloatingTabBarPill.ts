import { useRef, useEffect, useCallback } from 'react';
import { Animated } from 'react-native';

const TAB_COUNT = 4;
const DELAY_MS  = 65;

// Leading edge: snappy.  Trailing edge: dragging.  Together = liquid blob stretch.
const FAST = { tension: 220, friction: 12, useNativeDriver: false } as const;
const SLOW = { tension: 130, friction: 15, useNativeDriver: false } as const;

export interface PillAnimationResult {
  pillLeft: Animated.Value;
  pillWidth: Animated.AnimatedSubtraction;
  onContainerLayout: (width: number) => void;
}

export function useFloatingTabBarPill(activeIndex: number): PillAnimationResult {
  const containerWidth = useRef(0);
  const pillLeft  = useRef(new Animated.Value(-1000)).current;
  const pillRight = useRef(new Animated.Value(-900)).current;
  const pillWidth = useRef(Animated.subtract(pillRight, pillLeft)).current;
  const prevIndex  = useRef(activeIndex);
  const initialized = useRef(false);

  function bounds(index: number, width: number): { left: number; right: number } {
    const tabW = width / TAB_COUNT;
    return { left: index * tabW, right: (index + 1) * tabW };
  }

  const onContainerLayout = useCallback((width: number) => {
    if (width === 0) return;
    containerWidth.current = width;
    const { left, right } = bounds(prevIndex.current, width);
    pillLeft.setValue(left);
    pillRight.setValue(right);
    initialized.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialized.current || containerWidth.current === 0) return;

    const { left: tL, right: tR } = bounds(activeIndex, containerWidth.current);
    const movingRight = activeIndex > prevIndex.current;
    prevIndex.current = activeIndex;

    // Stop any in-flight springs first — new spring starts from current visual position.
    pillLeft.stopAnimation();
    pillRight.stopAnimation();

    if (movingRight) {
      Animated.parallel([
        Animated.spring(pillRight, { toValue: tR, ...FAST }),
        Animated.sequence([
          Animated.delay(DELAY_MS),
          Animated.spring(pillLeft, { toValue: tL, ...SLOW }),
        ]),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(pillLeft,  { toValue: tL, ...FAST }),
        Animated.sequence([
          Animated.delay(DELAY_MS),
          Animated.spring(pillRight, { toValue: tR, ...SLOW }),
        ]),
      ]).start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return { pillLeft, pillWidth, onContainerLayout };
}
