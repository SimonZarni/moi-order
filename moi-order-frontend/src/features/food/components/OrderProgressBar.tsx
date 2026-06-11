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
import { Locale } from '@/shared/store/localeStore';
import { styles } from './OrderProgressBar.styles';

const LINE_GREEN = '#06C755';

// ─── Status index map ────────────────────────────────────────────────────────
const STATUS_INDEX: Record<FoodOrderStatus, number> = {
  [FOOD_ORDER_STATUS.OrderPlaced]:        0,
  [FOOD_ORDER_STATUS.WaitingForPayment]:  1,
  [FOOD_ORDER_STATUS.PaymentConfirmed]:   2,
  [FOOD_ORDER_STATUS.PreparingFood]:      3,
  [FOOD_ORDER_STATUS.WaitingForDelivery]: 4,
  [FOOD_ORDER_STATUS.DeliveryOnTheWay]:   5,
  [FOOD_ORDER_STATUS.Delivered]:          6,
  [FOOD_ORDER_STATUS.Completed]:          8,
  [FOOD_ORDER_STATUS.Cancelled]:          8,
  [FOOD_ORDER_STATUS.Expired]:            0, // never reaches phase 2; screen shows expiredCard instead
};

// ─── Step definitions ─────────────────────────────────────────────────────────
// statusThreshold: the STATUS_INDEX value at which this step becomes "active"
// -1 = special: shown as "done" once statusIndex >= 1, never "active"
interface StepDef {
  label: string;
  statusThreshold: number;
  phase: 1 | 2;
}

type StepLabels = [string, string, string, string, string, string, string, string, string];
type PhaseLabels = { phase1: string; phase2: string };

const STEP_LABELS: Record<Locale, StepLabels> = {
  en: [
    'Order Placed',
    'Confirmed by restaurant',
    'Waiting for payment',
    'Payment confirmed',
    'Preparing Food',
    'Waiting for Delivery',
    'Delivery on the way',
    'Delivered',
    'Completed',
  ],
  mm: [
    'မှာယူမှု တင်သွင်းပြီး',
    'စားသောက်ဆိုင်မှ အတည်ပြုပြီး',
    'ငွေပေးချေရန် စောင့်ဆိုင်းနေ',
    'ငွေပေးချေမှု အတည်ပြုပြီး',
    'အစားအစာ ပြင်ဆင်နေ',
    'ပို့ဆောင်မှုကို စောင့်ဆိုင်းနေ',
    'ပို့ဆောင်နေဆဲ',
    'ပို့ဆောင်ပြီး',
    'ပြီးဆုံးပြီး',
  ],
  th: [
    'สั่งอาหารแล้ว',
    'ร้านยืนยันแล้ว',
    'รอชำระเงิน',
    'ยืนยันการชำระเงินแล้ว',
    'กำลังเตรียมอาหาร',
    'รอการจัดส่ง',
    'กำลังจัดส่ง',
    'ส่งแล้ว',
    'เสร็จสิ้น',
  ],
};

const PHASE_LABELS: Record<Locale, PhaseLabels> = {
  en: { phase1: 'Order & Payment',           phase2: 'Delivery' },
  mm: { phase1: 'မှာယူမှုနှင့် ငွေပေးချေမှု', phase2: 'ပို့ဆောင်မှု' },
  th: { phase1: 'สั่งและชำระเงิน',             phase2: 'การจัดส่ง' },
};

function getSteps(locale: Locale): StepDef[] {
  const l = STEP_LABELS[locale];
  return [
    { label: l[0], statusThreshold: 0,  phase: 1 },
    { label: l[1], statusThreshold: -1, phase: 1 },
    { label: l[2], statusThreshold: 1,  phase: 1 },
    { label: l[3], statusThreshold: 2,  phase: 1 },
    { label: l[4], statusThreshold: 3,  phase: 2 },
    { label: l[5], statusThreshold: 4,  phase: 2 },
    { label: l[6], statusThreshold: 5,  phase: 2 },
    { label: l[7], statusThreshold: 6,  phase: 2 },
    { label: l[8], statusThreshold: 7,  phase: 2 },
  ];
}

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
  copyMessage: string | null;
  copyHint: string | null;
  hasCopied: boolean;
  onCopyPress: () => void;
  locale: Locale;
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
export function OrderProgressBar({
  status,
  canShowPromptPay,
  onPromptPayPress,
  copyMessage,
  copyHint,
  hasCopied,
  onCopyPress,
  locale,
}: Props): React.JSX.Element {
  const currentIdx = STATUS_INDEX[status] ?? 0;
  const inPhase2   = currentIdx >= 3;

  const steps      = getSteps(locale);
  const phase1Steps = steps.filter((s) => s.phase === 1);
  const phase2Steps = steps.filter((s) => s.phase === 2);
  const phaseLabels = PHASE_LABELS[locale];

  return (
    <>
      {/* Phase 1 card */}
      <View style={styles.phaseCard}>
        <View style={styles.phaseHeaderRow}>
          <Text style={[styles.phaseTag, styles.phaseTagPhase1]}>{phaseLabels.phase1}</Text>
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
            <Text style={[styles.phaseTag, styles.phaseTagPhase2]}>{phaseLabels.phase2}</Text>
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

      {/* Copy-to-clipboard helper + Pay via LINE button */}
      {canShowPromptPay && copyMessage && (
        <>
          <View style={styles.copyCard}>
            {copyHint ? (
              <Text style={styles.copyHint}>{copyHint}</Text>
            ) : null}
            <View style={styles.copyRow}>
              <Text style={styles.copyMessageText} selectable>{copyMessage}</Text>
              <Pressable
                style={styles.copyBtn}
                onPress={onCopyPress}
                accessibilityRole="button"
                accessibilityLabel="Copy message"
              >
                <Ionicons
                  name={hasCopied ? 'checkmark' : 'clipboard-outline'}
                  size={20}
                  color={hasCopied ? LINE_GREEN : colours.textMuted}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={styles.promptPayBtn}
            onPress={onPromptPayPress}
            accessibilityRole="button"
            accessibilityLabel="Pay via LINE"
          >
            <Ionicons name="chatbubble" size={18} color="#fff" />
            <Text style={styles.promptPayText}>Pay via LINE</Text>
          </Pressable>
        </>
      )}

      {canShowPromptPay && !copyMessage && (
        <Pressable
          style={styles.promptPayBtn}
          onPress={onPromptPayPress}
          accessibilityRole="button"
          accessibilityLabel="Pay via LINE"
        >
          <Ionicons name="chatbubble" size={18} color="#fff" />
          <Text style={styles.promptPayText}>Pay via LINE</Text>
        </Pressable>
      )}
    </>
  );
}
