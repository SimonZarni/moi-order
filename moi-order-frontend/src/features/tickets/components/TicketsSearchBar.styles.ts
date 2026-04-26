import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  // Same positioning contract as PlacesSearchBar — sits in the dark hero area
  // between HeroHeader and bodyGap, using the same marginTop/paddingBottom offsets.
  container: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl + spacing.sm,
    marginTop: -spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl + spacing.sm,
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.inputBg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.inputBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
    minHeight: 44,
  },
  searchIcon: {
    fontSize: 15,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnDark,
    padding: 0,
  },
  placeholder: {
    color: colours.medium,
  } as unknown as { color: string },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
