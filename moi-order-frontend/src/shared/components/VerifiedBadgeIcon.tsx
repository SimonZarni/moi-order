import React from 'react';
import Svg, { Path, Polyline } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

function buildGearPath(cx: number, cy: number, outerR: number, innerR: number, teeth: number): string {
  const step = (Math.PI * 2) / (teeth * 2);
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const angle = i * step - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(3)},${(cy + r * Math.sin(angle)).toFixed(3)}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

export function VerifiedBadgeIcon({ size = 24, color = '#1D9BF0' }: Props): React.JSX.Element {
  const c  = size / 2;
  // 16 teeth with gentle depth — outer/inner ≈ 1.16 gives a clear gear look
  const gearPath = buildGearPath(c, c, c * 0.92, c * 0.79, 16);

  // Checkmark scaled proportionally to size
  const s = size / 24;
  const checkPoints = `${6.5 * s},${12.5 * s} ${10.5 * s},${16 * s} ${17.5 * s},${9 * s}`;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Path d={gearPath} fill={color} />
      <Polyline
        points={checkPoints}
        fill="none"
        stroke="white"
        strokeWidth={2 * s}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
