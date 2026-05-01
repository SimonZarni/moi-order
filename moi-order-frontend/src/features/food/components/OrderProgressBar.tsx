import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { FOOD_ORDER_STATUS, FoodOrderStatus } from '@/types/enums';
import { styles } from './OrderProgressBar.styles';

// ─── Status index map ────────────────────────────────────────────────────────
const STATUS_INDEX: Record<FoodOrderStatus, number> = {
  [FOOD_ORDER_STATUS.OrderPlaced]:        0,
  [FOOD_ORDER_STATUS.WaitingForPayment]:  1,
  [FOOD_ORDER_STATUS.PaymentConfirmed]:   2,
  [FOOD_ORDER_STATUS.PreparingFood]:      3,
  [FOOD_ORDER_STATUS.WaitingForDelivery]: 4,
  [FOOD_ORDER_STATUS.DeliveryOnTheWay]:   5,
  [FOOD_ORDER_STATUS.Delivered]:          6,
  [FOOD_ORDER_STATUS.Completed]:          7,
  [FOOD_ORDER_STATUS.Cancelled]:          7,
};

// ─── Step definitions ─────────────────────────────────────────────────────────
// statusThreshold: the STATUS_INDEX value at which this step becomes "active"
// -1 = special: shown as "done" once statusIndex >= 1, never "active"
interface StepDef {
  label: string;
  statusThreshold: number;
  phase: 1 | 2;
}

const STEPS: StepDef[] = [
  { label: 'Order Placed',             statusThreshold: 0,  phase: 1 },
  { label: 'Confirmed by restaurant',  statusThreshold: -1, phase: 1 },
  { label: 'Waiting for payment',      statusThreshold: 1,  phase: 1 },
  { label: 'Payment confirmed',        statusThreshold: 2,  phase: 1 },
  { label: 'Preparing Food',           statusThreshold: 3,  phase: 2 },
  { label: 'Waiting for Delivery',     statusThreshold: 4,  phase: 2 },
  { label: 'Delivery on the way',      statusThreshold: 5,  phase: 2 },
  { label: 'Delivered',                statusThreshold: 6,  phase: 2 },
  { label: 'Completed',                statusThreshold: 7,  phase: 2 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStepState(step: StepDef, currentIdx: number): 'done' | 'active' | 'upcoming' {
  if (step.statusThreshold === -1) {
    return currentIdx >= 1 ? 'done' : 'upcoming';
  }
  if (currentIdx > step.statusThreshold) return 'done';
  if (currentIdx === step.statusThreshold) return 'active';
  return 'upcoming';
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  status: FoodOrderStatus;
  canShowPromptPay: boolean;
  onPromptPayPress: () => void;
}

// ─── Pulsing dot for active step ─────────────────────────────────────────────
function PulsingDot(): React.JSX.Element {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.35, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        styles.stepDot, styles.stepDotActive,
        { transform: [{ scale: pulse }] },
      ]}
    />
  );
}

// ─── Phase 2 animated wrapper ─────────────────────────────────────────────────
function AnimatedPhase2({ visible, children }: { visible: boolean; children: React.ReactNode }): React.JSX.Element {
  const opacity   = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(visible ? 0 : 16)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(opacity,    { toValue: 1, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, friction: 7, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  if (!visible) return <></>;

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

// ─── Single step row ─────────────────────────────────────────────────────────
function StepRow({ step, state, isLast }: { step: StepDef; state: 'done' | 'active' | 'upcoming'; isLast: boolean }): React.JSX.Element {
  const dotStyle = state === 'active' ? null : [
    styles.stepDot,
    state === 'done'     ? styles.stepDotDone     : styles.stepDotUpcoming,
  ];
  const lineStyle = [
    styles.stepLine,
    state === 'done'   ? styles.stepLineDone     :
    state === 'active' ? styles.stepLineActive   :
                         styles.stepLineUpcoming,
  ];
  const labelStyle = [
    styles.stepLabelText,
    state === 'active' ? styles.stepLabelTextActive :
    state === 'done'   ? styles.stepLabelTextDone   : null,
  ];

  return (
    <View>
      <View style={styles.stepRow}>
        <View style={styles.stepTrack}>
          {state === 'active' ? (
            <PulsingDot />
          ) : (
            <View style={dotStyle}>
              {state === 'done' && (
                <Ionicons name="checkmark" size={12} color={colours.primary} />
              )}
            </View>
          )}
        </View>
        <View style={styles.stepLabel}>
          <Text style={labelStyle}>{step.label}</Text>
        </View>
      </View>
      {!isLast && <View style={[{ marginLeft: 10 }, lineStyle]} />}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function OrderProgressBar({ status, canShowPromptPay, onPromptPayPress }: Props): React.JSX.Element {
  const currentIdx = STATUS_INDEX[status] ?? 0;
  const inPhase2   = currentIdx >= 3;

  const phase1Steps = STEPS.filter((s) => s.phase === 1);
  const phase2Steps = STEPS.filter((s) => s.phase === 2);

  return (
    <>
      {/* Phase 1 card */}
      <View style={styles.phaseCard}>
        <View style={styles.phaseHeaderRow}>
          <Text style={[styles.phaseTag, styles.phaseTagPhase1]}>Order & Payment</Text>
        </View>
        {phase1Steps.map((step, i) => (
          <StepRow
            key={step.label}
            step={step}
            state={getStepState(step, currentIdx)}
            isLast={i === phase1Steps.length - 1}
          />
        ))}
      </View>

      <View style={styles.phaseSpacer} />

      {/* Phase 2 card — animates in when order reaches preparing_food */}
      <AnimatedPhase2 visible={inPhase2}>
        <View style={styles.phaseCard}>
          <View style={styles.phaseHeaderRow}>
            <Text style={[styles.phaseTag, styles.phaseTagPhase2]}>Delivery</Text>
          </View>
          {phase2Steps.map((step, i) => (
            <StepRow
              key={step.label}
              step={step}
              state={getStepState(step, currentIdx)}
              isLast={i === phase2Steps.length - 1}
            />
          ))}
        </View>
      </AnimatedPhase2>

      {/* PromptPay CTA — shown when payment is pending */}
      {canShowPromptPay && (
        <Pressable
          style={styles.promptPayBtn}
          onPress={onPromptPayPress}
          accessibilityRole="button"
          accessibilityLabel="Pay via PromptPay"
        >
          <Text style={styles.promptPayText}>Pay via PromptPay</Text>
        </Pressable>
      )}
    </>
  );
}
