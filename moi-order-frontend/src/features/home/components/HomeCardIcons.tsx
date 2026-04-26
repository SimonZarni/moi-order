import React from 'react';
import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';

// ── 90-Day Report — sage green calendar ───────────────────────────────────────
export function CalendarIcon(): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Body */}
      <Rect x="2" y="7" width="36" height="30" rx="6" fill="#52796f" />
      {/* Header strip */}
      <Rect x="2" y="7" width="36" height="12" rx="6" fill="#3a5a52" />
      <Rect x="2" y="13" width="36" height="6" fill="#3a5a52" />
      {/* Calendar grid area */}
      <Rect x="5" y="20" width="30" height="14" rx="3" fill="#ddeee9" />
      {/* Binding pins */}
      <Rect x="11" y="3" width="4" height="9" rx="2" fill="#89b5ae" />
      <Rect x="25" y="3" width="4" height="9" rx="2" fill="#89b5ae" />
      {/* Date dots — row 1 */}
      <Circle cx="11" cy="25" r="2" fill="#89b5ae" />
      <Circle cx="20" cy="25" r="2.5" fill="#f0a500" />
      <Circle cx="29" cy="25" r="2" fill="#89b5ae" />
      {/* Date dots — row 2 */}
      <Circle cx="11" cy="31" r="2" fill="#89b5ae" />
      <Circle cx="20" cy="31" r="2" fill="#89b5ae" />
      <Circle cx="29" cy="31" r="2" fill="#89b5ae" />
    </Svg>
  );
}

// ── Tickets — slate price tag ─────────────────────────────────────────────────
export function TicketIcon(): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Tag body */}
      <Path d="M5 4 L35 4 Q38 4 38 7 L38 24 L20 37 L2 24 L2 7 Q2 4 5 4 Z" fill="#64748b" />
      {/* Header accent */}
      <Path d="M5 4 L35 4 Q38 4 38 7 L38 15 L2 15 L2 7 Q2 4 5 4 Z" fill="#7d93a8" />
      {/* Punch hole */}
      <Circle cx="20" cy="9.5" r="3.5" fill="#f0f4f7" />
      {/* Price lines */}
      <Rect x="10" y="19"   width="20" height="2.5" rx="1.25" fill="rgba(255,255,255,0.80)" />
      <Rect x="12" y="24"   width="16" height="2"   rx="1"    fill="rgba(255,255,255,0.45)" />
      <Rect x="14" y="28.5" width="12" height="2"   rx="1"    fill="rgba(255,255,255,0.30)" />
    </Svg>
  );
}

// ── Places — gold map pin ─────────────────────────────────────────────────────
export function LocationIcon(): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Pin drop body */}
      <Path
        d="M20 2 C12.3 2 6 8.3 6 16 C6 25 20 39 20 39 C20 39 34 25 34 16 C34 8.3 27.7 2 20 2 Z"
        fill="#b08d57"
      />
      {/* Top-edge highlight */}
      <Path
        d="M20 2 C13 2 7.5 7 6.5 13.5 C9 8 14 5 20 5 C23.5 5 26.7 6.3 29 8.5 C26.5 4.5 23.5 2 20 2 Z"
        fill="#d4a96a"
      />
      {/* Inner white ring */}
      <Circle cx="20" cy="16" r="7.5" fill="white" />
      {/* Centre dot */}
      <Circle cx="20" cy="16" r="3.5" fill="#b08d57" />
    </Svg>
  );
}

// ── Passport / CI — indigo booklet ───────────────────────────────────────────
export function PassportIcon(): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Booklet cover */}
      <Rect x="6" y="4" width="28" height="34" rx="3" fill="#5c5a8a" />
      {/* Spine */}
      <Rect x="6" y="4" width="6" height="34" rx="3" fill="#47456e" />
      <Rect x="9" y="4" width="3" height="34" fill="#47456e" />
      {/* Emblem circle */}
      <Circle cx="22" cy="17" r="7" fill="rgba(255,255,255,0.15)" />
      <Circle cx="22" cy="17" r="4.5" fill="rgba(255,255,255,0.25)" />
      <Circle cx="22" cy="17" r="2" fill="rgba(255,255,255,0.7)" />
      {/* Text lines */}
      <Rect x="13" y="27" width="18" height="2"   rx="1" fill="rgba(255,255,255,0.55)" />
      <Rect x="15" y="31" width="14" height="1.5" rx="0.75" fill="rgba(255,255,255,0.30)" />
    </Svg>
  );
}

// ── Food ordering — coral bowl ────────────────────────────────────────────────
export function FoodIcon(): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Bowl body */}
      <Path d="M6 18 Q6 34 20 34 Q34 34 34 18 Z" fill="#b85c45" />
      {/* Bowl rim */}
      <Rect x="5" y="15" width="30" height="4" rx="2" fill="#d4785e" />
      {/* Steam lines */}
      <Path d="M14 11 Q15 8 14 5" stroke="#b85c45" strokeWidth="2" strokeLinecap="round" fill="none" />
      <Path d="M20 10 Q21 7 20 4" stroke="#b85c45" strokeWidth="2" strokeLinecap="round" fill="none" />
      <Path d="M26 11 Q27 8 26 5" stroke="#b85c45" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Shine */}
      <Path d="M10 22 Q13 20 16 22" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

// ── Airport Fast Track — sky blue plane ───────────────────────────────────────
export function AirportIcon(): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Sky glow */}
      <Circle cx="20" cy="20" r="14" fill="rgba(74,127,165,0.18)" />
      {/* Plane body */}
      <Path d="M6 21 L28 10 Q34 8 33 14 L20 22 L22 33 L17 31 L16 23 L9 26 Z" fill="#4a7fa5" />
      {/* Wing highlight */}
      <Path d="M6 21 L28 10 Q31 9 31 11 L16 20 Z" fill="#7aaec8" />
    </Svg>
  );
}

// ── Embassy Services — rose document with seal ────────────────────────────────
export function EmbassyIcon(): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Document body */}
      <Rect x="6" y="3" width="28" height="34" rx="4" fill="#8b4353" />
      {/* Header strip */}
      <Rect x="6" y="3" width="28" height="10" rx="4" fill="#6e3342" />
      <Rect x="6" y="9" width="28" height="4" fill="#6e3342" />
      {/* Text lines */}
      <Rect x="11" y="17" width="18" height="2.5" rx="1.25" fill="rgba(255,255,255,0.75)" />
      <Rect x="11" y="22" width="14" height="2"   rx="1"    fill="rgba(255,255,255,0.45)" />
      <Rect x="11" y="26.5" width="16" height="2" rx="1"    fill="rgba(255,255,255,0.35)" />
      {/* Seal circle */}
      <Circle cx="27" cy="32" r="5.5" fill="#c47a8a" />
      <Circle cx="27" cy="32" r="3.5" fill="#8b4353" />
      <Circle cx="27" cy="32" r="1.5" fill="rgba(255,255,255,0.8)" />
    </Svg>
  );
}

// ── Bus Tickets — navy bus ────────────────────────────────────────────────────
export function BusIcon(): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Body */}
      <Rect x="3" y="12" width="34" height="18" rx="3" fill="#1e3d6b" />
      {/* Roof */}
      <Rect x="5" y="9" width="30" height="6" rx="3" fill="#2a5190" />
      {/* Windows */}
      <Rect x="7"  y="16" width="7" height="6" rx="2" fill="rgba(255,255,255,0.65)" />
      <Rect x="16" y="16" width="8" height="6" rx="2" fill="rgba(255,255,255,0.65)" />
      <Rect x="26" y="16" width="7" height="6" rx="2" fill="rgba(255,255,255,0.65)" />
      {/* Side stripe */}
      <Rect x="3" y="24" width="34" height="3" rx="0" fill="#2a5190" opacity={0.55} />
      {/* Door */}
      <Rect x="18" y="25" width="5" height="5" rx="1" fill="#2a5190" />
      <Rect x="18.5" y="25.5" width="1.8" height="4" rx="0.5" fill="rgba(255,255,255,0.3)" />
      <Rect x="21" y="25.5" width="1.8" height="4" rx="0.5" fill="rgba(255,255,255,0.3)" />
      {/* Undercarriage */}
      <Rect x="6" y="30" width="28" height="3" rx="1" fill="#0f2035" />
      {/* Wheels */}
      <Circle cx="11" cy="34" r="4" fill="#0f2035" />
      <Circle cx="11" cy="34" r="2" fill="#2a5190" />
      <Circle cx="29" cy="34" r="4" fill="#0f2035" />
      <Circle cx="29" cy="34" r="2" fill="#2a5190" />
    </Svg>
  );
}

// ── Other Services — teal lightning bolt ──────────────────────────────────────
export function FlashIcon(): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Soft glow */}
      <Circle cx="20" cy="20" r="14" fill="rgba(107,158,148,0.18)" />
      {/* Bolt body */}
      <Path d="M23 3 L10 22 L19 22 L17 38 L30 19 L21 19 Z" fill="#6b9e94" />
      {/* Leading-edge highlight */}
      <Path d="M23 3 L10 22 L15 22 L22 8 Z" fill="#9dc5be" />
    </Svg>
  );
}
