import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

const CREAM = '#F5F0E8';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.dark },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
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
  headerTitle: {
    flex:       1,
    fontSize:   typography.lg,
    fontWeight: '700',
    color:      colours.textOnDark,
    lineHeight: 50,
  },
  headerSpacer: { width: 44 },

  // ── List ───────────────────────────────────────────────────────────────────
  list:             { flex: 1, backgroundColor: CREAM },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingTop:        spacing.md,
    paddingBottom:     spacing.xxl + spacing.lg,
    backgroundColor:   CREAM,
  },

  // ── Card ───────────────────────────────────────────────────────────────────
  card: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colours.white,
    borderRadius:    radius.lg,
    marginBottom:    spacing.sm,
    padding:         spacing.sm,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.07,
    shadowRadius:    4,
    elevation:       2,
  },
  cardPressed: { opacity: 0.78 },

  // ── Thumbnail ──────────────────────────────────────────────────────────────
  thumb: {
    width:           64,
    height:          64,
    borderRadius:    radius.md,
    backgroundColor: CREAM,
  },
  thumbPlaceholder: {
    width:           64,
    height:          64,
    borderRadius:    radius.md,
    backgroundColor: CREAM,
    alignItems:      'center',
    justifyContent:  'center',
  },

  // ── Info ───────────────────────────────────────────────────────────────────
  info: {
    flex:        1,
    marginLeft:  spacing.sm,
    marginRight: spacing.xs,
  },
  name: {
    fontSize:   typography.md,
    fontWeight: '700',
    color:      colours.textOnLight,
    lineHeight: 44,
  },
  category: {
    fontSize:     typography.xs,
    fontWeight:   '600',
    color:        colours.primary,
    lineHeight:   18,
    marginBottom: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginTop:     2,
  },
  phone: {
    fontSize:   typography.sm,
    color:      colours.primary,
    fontWeight: '500',
    lineHeight: 20,
    marginLeft: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginTop:     2,
  },
  address: {
    fontSize:  typography.xs,
    color:     colours.textMuted,
    lineHeight: 18,
    marginLeft: 4,
    flex:       1,
  },

  // ── Call button ────────────────────────────────────────────────────────────
  callBtn: {
    width:           40,
    height:          40,
    borderRadius:    radius.full,
    borderWidth:     1.5,
    borderColor:     colours.primary,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: colours.infoBg,
  },
  callBtnPressed: { opacity: 0.55 },
  callBtnSpacer:  { width: 40 },

  // ── Empty / footer ─────────────────────────────────────────────────────────
  empty: {
    marginTop:         spacing.xxl,
    alignItems:        'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize:  typography.md,
    color:     colours.textMuted,
    textAlign: 'center',
    lineHeight: 44,
  },
  footer: {
    paddingVertical: spacing.md,
    alignItems:      'center',
  },
});
