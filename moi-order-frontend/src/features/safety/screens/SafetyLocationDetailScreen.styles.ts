import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: colours.backgroundDark },
  scroll: { flex: 1, backgroundColor: colours.backgroundLight },

  centered: {
    flex:            1,
    justifyContent:  'center',
    alignItems:      'center',
    padding:         spacing.xl,
  },
  errorText: {
    fontSize:   typography.sm,
    color:      colours.textMuted,
    textAlign:  'center',
    lineHeight: 22,
  },

  heroImage: {
    width:           '100%',
    height:          240,
    backgroundColor: colours.backgroundDark,
  },

  body: {
    padding: spacing.lg,
  },
  title: {
    fontSize:     typography.xl,
    fontWeight:   '800',
    color:        colours.textOnLight,
    marginBottom: spacing.xs,
    lineHeight:   60,
  },
  subCategory: {
    fontSize:     typography.md,
    fontWeight:   '600',
    marginBottom: spacing.sm,
    lineHeight:   44,
  },
  description: {
    fontSize:     typography.sm,
    color:        colours.textMuted,
    lineHeight:   22,
    marginBottom: spacing.lg,
  },

  infoSection: {
    backgroundColor: colours.card,
    borderRadius:    radius.md,
    overflow:        'hidden',
    marginBottom:    spacing.lg,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    4,
    elevation:       2,
  },
  infoRow: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap:             spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.backgroundLight,
  },
  infoText: {
    flex:       1,
    fontSize:   typography.sm,
    color:      colours.textOnLight,
    lineHeight: 20,
  },
  infoTextLink: {
    flex:       1,
    fontSize:   typography.sm,
    color:      colours.primary,
    lineHeight: 20,
  },

  gallerySection: {
    marginBottom: spacing.lg,
  },
  galleryTitle: {
    fontSize:     typography.sm,
    fontWeight:   '700',
    color:        colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom:  spacing.sm,
  },
  galleryScroll: {
    gap: spacing.sm,
  },
  galleryImage: {
    width:         140,
    height:        100,
    borderRadius:  radius.sm,
    backgroundColor: colours.backgroundDark,
  },
});
