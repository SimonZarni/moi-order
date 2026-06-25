import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.xs,
  },
  headerDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.xxs,
    fontWeight: '800',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  headerBadge: {
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
  },
  headerCount: {
    fontSize: 10,
    fontWeight: '700',
  },
});
