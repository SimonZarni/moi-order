import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Image } from 'expo-image';

import { HOME_CARD_ICON_TYPE } from '@/types/enums';
import { styles } from './HomeCardGrid.styles';

// ── Shared prop ───────────────────────────────────────────────────────────────

interface IconProps {
  color: string;
}

// ── 90-Day Report — calendar ──────────────────────────────────────────────────
export function CalendarIcon({ color }: IconProps): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Body */}
      <Rect x="2" y="7" width="36" height="30" rx="6" fill={color} />
      {/* Header strip — same base + darkening overlay */}
      <Rect x="2" y="7" width="36" height="12" rx="6" fill={color} />
      <Rect x="2" y="13" width="36" height="6" fill={color} />
      <Rect x="2" y="7" width="36" height="12" rx="6" fill="black" fillOpacity={0.28} />
      <Rect x="2" y="13" width="36" height="6" fill="black" fillOpacity={0.28} />
      {/* Calendar grid area */}
      <Rect x="5" y="20" width="30" height="14" rx="3" fill="white" fillOpacity={0.88} />
      {/* Binding pins */}
      <Rect x="11" y="3" width="4" height="9" rx="2" fill="white" fillOpacity={0.55} />
      <Rect x="25" y="3" width="4" height="9" rx="2" fill="white" fillOpacity={0.55} />
      {/* Date dots — row 1 */}
      <Circle cx="11" cy="25" r="2" fill="white" fillOpacity={0.5} />
      <Circle cx="20" cy="25" r="2.5" fill="#f0a500" />
      <Circle cx="29" cy="25" r="2" fill="white" fillOpacity={0.5} />
      {/* Date dots — row 2 */}
      <Circle cx="11" cy="31" r="2" fill="white" fillOpacity={0.5} />
      <Circle cx="20" cy="31" r="2" fill="white" fillOpacity={0.5} />
      <Circle cx="29" cy="31" r="2" fill="white" fillOpacity={0.5} />
    </Svg>
  );
}

// ── Tickets — price tag ───────────────────────────────────────────────────────
export function TicketIcon({ color }: IconProps): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Tag body */}
      <Path d="M5 4 L35 4 Q38 4 38 7 L38 24 L20 37 L2 24 L2 7 Q2 4 5 4 Z" fill={color} />
      {/* Header accent — lightening overlay */}
      <Path d="M5 4 L35 4 Q38 4 38 7 L38 15 L2 15 L2 7 Q2 4 5 4 Z" fill="white" fillOpacity={0.22} />
      {/* Punch hole */}
      <Circle cx="20" cy="9.5" r="3.5" fill="white" />
      {/* Price lines */}
      <Rect x="10" y="19"   width="20" height="2.5" rx="1.25" fill="rgba(255,255,255,0.80)" />
      <Rect x="12" y="24"   width="16" height="2"   rx="1"    fill="rgba(255,255,255,0.45)" />
      <Rect x="14" y="28.5" width="12" height="2"   rx="1"    fill="rgba(255,255,255,0.30)" />
    </Svg>
  );
}

// ── Places — map pin ──────────────────────────────────────────────────────────
export function LocationIcon({ color }: IconProps): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Pin drop body */}
      <Path
        d="M20 2 C12.3 2 6 8.3 6 16 C6 25 20 39 20 39 C20 39 34 25 34 16 C34 8.3 27.7 2 20 2 Z"
        fill={color}
      />
      {/* Top-edge highlight */}
      <Path
        d="M20 2 C13 2 7.5 7 6.5 13.5 C9 8 14 5 20 5 C23.5 5 26.7 6.3 29 8.5 C26.5 4.5 23.5 2 20 2 Z"
        fill="white" fillOpacity={0.3}
      />
      {/* Inner white ring */}
      <Circle cx="20" cy="16" r="7.5" fill="white" />
      {/* Centre dot */}
      <Circle cx="20" cy="16" r="3.5" fill={color} />
    </Svg>
  );
}

// ── Passport / CI — booklet ───────────────────────────────────────────────────
export function PassportIcon({ color }: IconProps): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Booklet cover */}
      <Rect x="6" y="4" width="28" height="34" rx="3" fill={color} />
      {/* Spine — darkening overlay */}
      <Rect x="6" y="4" width="6" height="34" rx="3" fill={color} />
      <Rect x="9" y="4" width="3" height="34" fill={color} />
      <Rect x="6" y="4" width="6" height="34" rx="3" fill="black" fillOpacity={0.25} />
      <Rect x="9" y="4" width="3" height="34" fill="black" fillOpacity={0.25} />
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

// ── Food ordering — bowl ──────────────────────────────────────────────────────
export function FoodIcon({ color }: IconProps): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Bowl body */}
      <Path d="M6 18 Q6 34 20 34 Q34 34 34 18 Z" fill={color} />
      {/* Bowl rim — lightening overlay */}
      <Rect x="5" y="15" width="30" height="4" rx="2" fill={color} />
      <Rect x="5" y="15" width="30" height="4" rx="2" fill="white" fillOpacity={0.22} />
      {/* Steam lines */}
      <Path d="M14 11 Q15 8 14 5" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <Path d="M20 10 Q21 7 20 4" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <Path d="M26 11 Q27 8 26 5" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Shine */}
      <Path d="M10 22 Q13 20 16 22" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

// ── Airport Fast Track — plane ────────────────────────────────────────────────
export function AirportIcon({ color }: IconProps): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Sky glow */}
      <Circle cx="20" cy="20" r="14" fill={color} fillOpacity={0.18} />
      {/* Plane body */}
      <Path d="M6 21 L28 10 Q34 8 33 14 L20 22 L22 33 L17 31 L16 23 L9 26 Z" fill={color} />
      {/* Wing highlight */}
      <Path d="M6 21 L28 10 Q31 9 31 11 L16 20 Z" fill="white" fillOpacity={0.3} />
    </Svg>
  );
}

// ── Embassy Services — document with seal ─────────────────────────────────────
export function EmbassyIcon({ color }: IconProps): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Document body */}
      <Rect x="6" y="3" width="28" height="34" rx="4" fill={color} />
      {/* Header strip — darkening overlay */}
      <Rect x="6" y="3" width="28" height="10" rx="4" fill={color} />
      <Rect x="6" y="9" width="28" height="4" fill={color} />
      <Rect x="6" y="3" width="28" height="10" rx="4" fill="black" fillOpacity={0.25} />
      <Rect x="6" y="9" width="28" height="4" fill="black" fillOpacity={0.25} />
      {/* Text lines */}
      <Rect x="11" y="17" width="18" height="2.5" rx="1.25" fill="rgba(255,255,255,0.75)" />
      <Rect x="11" y="22" width="14" height="2"   rx="1"    fill="rgba(255,255,255,0.45)" />
      <Rect x="11" y="26.5" width="16" height="2" rx="1"    fill="rgba(255,255,255,0.35)" />
      {/* Seal */}
      <Circle cx="27" cy="32" r="5.5" fill="white" fillOpacity={0.25} />
      <Circle cx="27" cy="32" r="3.5" fill={color} />
      <Circle cx="27" cy="32" r="1.5" fill="rgba(255,255,255,0.8)" />
    </Svg>
  );
}

// ── Bus Tickets — bus ─────────────────────────────────────────────────────────
export function BusIcon({ color }: IconProps): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Body */}
      <Rect x="3" y="12" width="34" height="18" rx="3" fill={color} />
      {/* Roof — lightening overlay */}
      <Rect x="5" y="9" width="30" height="6" rx="3" fill={color} />
      <Rect x="5" y="9" width="30" height="6" rx="3" fill="white" fillOpacity={0.22} />
      {/* Windows */}
      <Rect x="7"  y="16" width="7" height="6" rx="2" fill="rgba(255,255,255,0.65)" />
      <Rect x="16" y="16" width="8" height="6" rx="2" fill="rgba(255,255,255,0.65)" />
      <Rect x="26" y="16" width="7" height="6" rx="2" fill="rgba(255,255,255,0.65)" />
      {/* Side stripe */}
      <Rect x="3" y="24" width="34" height="3" fill="white" fillOpacity={0.15} />
      {/* Door */}
      <Rect x="18" y="25" width="5" height="5" rx="1" fill="white" fillOpacity={0.22} />
      <Rect x="18.5" y="25.5" width="1.8" height="4" rx="0.5" fill="rgba(255,255,255,0.3)" />
      <Rect x="21" y="25.5" width="1.8" height="4" rx="0.5" fill="rgba(255,255,255,0.3)" />
      {/* Undercarriage — darkening overlay */}
      <Rect x="6" y="30" width="28" height="3" rx="1" fill="black" fillOpacity={0.35} />
      {/* Wheels */}
      <Circle cx="11" cy="34" r="4" fill="black" fillOpacity={0.5} />
      <Circle cx="11" cy="34" r="2" fill="white" fillOpacity={0.22} />
      <Circle cx="29" cy="34" r="4" fill="black" fillOpacity={0.5} />
      <Circle cx="29" cy="34" r="2" fill="white" fillOpacity={0.22} />
    </Svg>
  );
}

// ── Other Services — lightning bolt ───────────────────────────────────────────
export function FlashIcon({ color }: IconProps): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Soft glow */}
      <Circle cx="20" cy="20" r="14" fill={color} fillOpacity={0.18} />
      {/* Bolt body */}
      <Path d="M23 3 L10 22 L19 22 L17 38 L30 19 L21 19 Z" fill={color} />
      {/* Leading-edge highlight */}
      <Path d="M23 3 L10 22 L15 22 L22 8 Z" fill="white" fillOpacity={0.3} />
    </Svg>
  );
}

// ── Company Services — building ───────────────────────────────────────────────
export function CompanyIcon({ color }: IconProps): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      {/* Building body */}
      <Rect x="6" y="13" width="28" height="25" rx="2" fill={color} />
      {/* Roof band — lightening overlay */}
      <Rect x="4" y="10" width="32" height="6" rx="2" fill={color} />
      <Rect x="4" y="10" width="32" height="6" rx="2" fill="white" fillOpacity={0.22} />
      {/* Windows row 1 */}
      <Rect x="10" y="19" width="5" height="5" rx="1" fill="rgba(255,255,255,0.65)" />
      <Rect x="18" y="19" width="5" height="5" rx="1" fill="rgba(255,255,255,0.65)" />
      <Rect x="26" y="19" width="5" height="5" rx="1" fill="rgba(255,255,255,0.65)" />
      {/* Windows row 2 */}
      <Rect x="10" y="27" width="5" height="5" rx="1" fill="rgba(255,255,255,0.40)" />
      <Rect x="26" y="27" width="5" height="5" rx="1" fill="rgba(255,255,255,0.40)" />
      {/* Door */}
      <Rect x="17" y="28" width="7" height="10" rx="1" fill="rgba(255,255,255,0.25)" />
      <Circle cx="22.5" cy="33" r="1" fill="rgba(255,255,255,0.65)" />
      {/* Flag pole */}
      <Rect x="19.5" y="3" width="1.5" height="9" rx="0.75" fill="white" fillOpacity={0.55} />
      {/* Flag */}
      <Path d="M21 3 L29 5.5 L21 8 Z" fill="white" fillOpacity={0.3} />
    </Svg>
  );
}

// ── Shared icon map + CardIcon used by both HomeCardGrid and HomeCardGroup ────

type IconComponent = (props: IconProps) => React.JSX.Element;

export const BUILTIN_ICON_MAP: Record<string, IconComponent> = {
  calendar: CalendarIcon,
  location: LocationIcon,
  flash:    FlashIcon,
  embassy:  EmbassyIcon,
  airport:  AirportIcon,
  bus:      BusIcon,
  passport: PassportIcon,
  food:     FoodIcon,
  ticket:   TicketIcon,
  company:  CompanyIcon,
};

export interface CardIconProps {
  iconKey: string;
  iconType: string;
  iconUrl: string | null;
  iconColor: string;
}

export function CardIcon({ iconKey, iconType, iconUrl, iconColor }: CardIconProps): React.JSX.Element | null {
  if (iconType === HOME_CARD_ICON_TYPE.Custom && iconUrl) {
    return <Image source={{ uri: iconUrl }} style={styles.customIconImage} contentFit="contain" />;
  }
  const Icon = BUILTIN_ICON_MAP[iconKey];
  return Icon ? <Icon color={iconColor} /> : null;
}
