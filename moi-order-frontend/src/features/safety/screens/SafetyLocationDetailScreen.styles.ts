import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

const CREAM = '#F5F0E8';

export const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: colours.dark },
  scroll: { flex: 1 },

  // ── Loading / error states ─────────────────────────────────────────────────
  compactHeader: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: spacing.sm,
    paddingVertical:   spacing.sm,
    backgroundColor:   colours.dark,
  },
  backBtn: {
    width:           44,
    height:          44,
    alignItems:      'center',
    justifyContent:  'center',
  },
  centered: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    padding:         spacing.xl,
    backgroundColor: CREAM,
  },
  errorText: {
    fontSize:  typography.md,
    color:     colours.textMuted,
    textAlign: 'center',
    lineHeight: 44,
  },

  // ── Gallery ────────────────────────────────────────────────────────────────
  galleryImage: {
    height:          300,
    backgroundColor: colours.dark,
  },
  galleryPlaceholder: {
    height:          300,
    backgroundColor: colours.dark,
    alignItems:      'center',
    justifyContent:  'center',
  },
  galleryBack: {
    position:        'absolute',
    top:             spacing.sm,
    left:            spacing.md,
    width:           40,
    height:          40,
    borderRadius:    radius.full,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  dotsRow: {
    position:       'absolute',
    bottom:         spacing.sm,
    left:           0,
    right:          0,
    flexDirection:  'row',
    justifyContent: 'center',
    gap:            spacing.xs,
  },
  dot: {
    width:           6,
    height:          6,
    borderRadius:    radius.full,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    backgroundColor: colours.white,
    width:           18,
  },

  // ── Body ───────────────────────────────────────────────────────────────────
  body: {
    backgroundColor: CREAM,
    padding:         spacing.lg,
    paddingBottom:   spacing.xxl,
  },
  name: {
    fontSize:     typography.xl,
    fontWeight:   '800',
    color:        colours.textOnLight,
    lineHeight:   60,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize:     typography.sm,
    fontWeight:   '600',
    color:        colours.primary,
    lineHeight:   22,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize:     typography.sm,
    color:        colours.textMuted,
    lineHeight:   22,
    marginBottom: spacing.lg,
  },

  // ── Info section ───────────────────────────────────────────────────────────
  infoSection: {
    backgroundColor: colours.white,
    borderRadius:    radius.lg,
    overflow:        'hidden',
    marginTop:       spacing.sm,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.07,
    shadowRadius:    4,
    elevation:       2,
  },
  infoRow: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.md,
    gap:               spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: CREAM,
  },
  infoText: {
    flex:       1,
    fontSize:   typography.sm,
    color:      colours.textOnLight,
    lineHeight: 22,
  },
  infoTextLink: {
    flex:       1,
    fontSize:   typography.sm,
    color:      colours.primary,
    lineHeight: 22,
  },
});
