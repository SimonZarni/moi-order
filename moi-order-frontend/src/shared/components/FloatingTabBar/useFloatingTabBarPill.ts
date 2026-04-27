import { useRef, useEffect, useCallback } from 'react';
import { Animated, PanResponder } from 'react-native';

const TAB_COUNT = 4;
const DELAY_MS = 65;
const MAX_STRETCH_RATIO = 0.3;

const FAST = { tension: 220, friction: 12, useNativeDriver: false } as const;
const SLOW = { tension: 130, friction: 15, useNativeDriver: false } as const;
const SNAP = { tension: 280, friction: 18, useNativeDriver: false } as const;

export interface PillAnimationResult {
  pillLeft: Animated.Value;
  pillWidth: Animated.AnimatedSubtraction;
  onContainerLayout: (width: number) => void;
  panHandlers: ReturnType<typeof PanResponder.create>['panHandlers'];
}

export function useFloatingTabBarPill(
  activeIndex: number,
  onTabChange: (index: number) => void,
): PillAnimationResult {
  const containerWidth = useRef(0);
  const pillLeft  = useRef(new Animated.Value(-1000)).current;
  const pillRight = useRef(new Animated.Value(-900)).current;
  const pillWidth = useRef(Animated.subtract(pillRight, pillLeft)).current;
  const prevIndex      = useRef(activeIndex);
  const initialized    = useRef(false);
  const skipNextSpring = useRef(false);
  // Center of the active tab (in tabsRow px) captured at gesture start.
  // Using gs.dx instead of locationX avoids the child-Pressable coordinate bug
  // where locationX is relative to the touched child, not the container.
  const gestureStartCenter = useRef(0);
  const onTabChangeRef = useRef(onTabChange);

  useEffect(() => {
    onTabChangeRef.current = onTabChange;
  }, [onTabChange]);

  function tabWidth(): number {
    return containerWidth.current / TAB_COUNT;
  }

  function bounds(index: number): { left: number; right: number } {
    const tw = tabWidth();
    return { left: index * tw, right: (index + 1) * tw };
  }

  const onContainerLayout = useCallback((width: number) => {
    if (width === 0) return;
    containerWidth.current = width;
    const { left, right } = bounds(prevIndex.current);
    pillLeft.setValue(left);
    pillRight.setValue(right);
    initialized.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialized.current || containerWidth.current === 0) return;
    if (skipNextSpring.current) {
      skipNextSpring.current = false;
      prevIndex.current = activeIndex;
      return;
    }

    const { left: tL, right: tR } = bounds(activeIndex);
    const movingRight = activeIndex > prevIndex.current;
    prevIndex.current = activeIndex;

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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 5 && Math.abs(gs.dx) > Math.abs(gs.dy),

      onPanResponderGrant: () => {
        pillLeft.stopAnimation();
        pillRight.stopAnimation();
        // Anchor to the center of the currently active tab.
        // All subsequent moves are offsets from this point via gs.dx.
        gestureStartCenter.current = (prevIndex.current + 0.5) * tabWidth();
      },

      onPanResponderMove: (_, gs) => {
        if (!initialized.current) return;
        const w  = containerWidth.current;
        const tw = tabWidth();

        // gs.dx is total displacement from first touch — always relative to the
        // full screen, so it maps correctly regardless of which child was touched.
        const fx = Math.max(tw / 2, Math.min(w - tw / 2, gestureStartCenter.current + gs.dx));

        // Tab centres sit at 0.5, 1.5, 2.5, 3.5 in index-float space.
        // (idxFloat % 1) is 0.5 at every centre and 0 or 1 at every edge.
        // distFromCenter: 0 = on a tab centre, 1 = exactly between two centres.
        const idxFloat       = fx / tw;
        const distFromCenter = Math.abs((idxFloat % 1) - 0.5) * 2;
        const extra          = tw * MAX_STRETCH_RATIO * Math.sin(distFromCenter * (Math.PI / 2));
        const half           = tw / 2 + extra / 2;

        pillLeft.setValue(fx - half);
        pillRight.setValue(fx + half);
      },

      onPanResponderRelease: (_, gs) => {
        if (!initialized.current) return;
        const w  = containerWidth.current;
        const tw = tabWidth();
        const fx = Math.max(0, Math.min(w, gestureStartCenter.current + gs.dx));

        let targetIdx = Math.round(fx / tw);
        if (gs.vx >  0.3) targetIdx = Math.ceil(fx / tw);
        if (gs.vx < -0.3) targetIdx = Math.floor(fx / tw);
        targetIdx = Math.max(0, Math.min(TAB_COUNT - 1, targetIdx));

        const { left: tL, right: tR } = bounds(targetIdx);
        Animated.parallel([
          Animated.spring(pillLeft,  { toValue: tL, ...SNAP }),
          Animated.spring(pillRight, { toValue: tR, ...SNAP }),
        ]).start();

        if (targetIdx !== prevIndex.current) {
          prevIndex.current = targetIdx;
          skipNextSpring.current = true;
          onTabChangeRef.current(targetIdx);
        }
      },

      onPanResponderTerminate: () => {
        if (!initialized.current) return;
        pillLeft.stopAnimation();
        pillRight.stopAnimation();
        const { left: tL, right: tR } = bounds(prevIndex.current);
        Animated.parallel([
          Animated.spring(pillLeft,  { toValue: tL, ...SNAP }),
          Animated.spring(pillRight, { toValue: tR, ...SNAP }),
        ]).start();
      },
    }),
  ).current;

  return { pillLeft, pillWidth, onContainerLayout, panHandlers: panResponder.panHandlers };
}
