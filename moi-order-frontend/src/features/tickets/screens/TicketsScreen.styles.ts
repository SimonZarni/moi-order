import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundDark },
  flatList: { backgroundColor: colours.backgroundLight },

  bodyGap: {
    height: spacing.xl,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -spacing.xl,
  },

  list: {
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: colours.backgroundLight,
  },

  cardsContainer: {
    paddingHorizontal: spacing.lg,
  },

  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: colours.backgroundLight,
  },
  stateIcon:     { fontSize: 36, marginBottom: spacing.sm, opacity: 0.5 },
  stateTitle:    { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight, marginBottom: 4 },
  stateSubtitle: { fontSize: typography.sm, color: colours.textMuted },
  spinner:       { color: colours.tertiary } as unknown as { color: string },
  listFooter:    { paddingVertical: spacing.lg },
});
