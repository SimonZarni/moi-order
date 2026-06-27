import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

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
  list:             { flex: 1 },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingTop:        spacing.xs,
    paddingBottom:     spacing.xxl + spacing.lg,
  },

  // ── Card ───────────────────────────────────────────────────────────────────
  card: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colours.secondary,
    borderRadius:    radius.lg,
    marginBottom:    spacing.sm,
    padding:         spacing.sm,
  },
  cardPressed: { opacity: 0.72 },

  // ── Thumbnail ──────────────────────────────────────────────────────────────
  thumb: {
    width:           64,
    height:          64,
    borderRadius:    radius.md,
    backgroundColor: colours.dark,
  },
  thumbPlaceholder: {
    width:           64,
    height:          64,
    borderRadius:    radius.md,
    backgroundColor: colours.dark,
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
    fontSize:     typography.md,
    fontWeight:   '700',
    color:        colours.textOnDark,
    lineHeight:   44,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginTop:     2,
  },
  tagDot: {
    width:           6,
    height:          6,
    borderRadius:    radius.full,
    backgroundColor: colours.success,
    marginRight:     spacing.xs,
  },
  tagText: {
    fontSize:  typography.xs,
    color:     'rgba(255,255,255,0.65)',
    lineHeight: 18,
  },
  address: {
    fontSize:  typography.xs,
    color:     'rgba(255,255,255,0.4)',
    lineHeight: 18,
    marginTop:  2,
  },

  // ── Call button ────────────────────────────────────────────────────────────
  callBtn: {
    width:           40,
    height:          40,
    borderRadius:    radius.full,
    borderWidth:     1.5,
    borderColor:     'rgba(255,255,255,0.35)',
    alignItems:      'center',
    justifyContent:  'center',
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
    color:     'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 44,
  },
  footer: {
    paddingVertical: spacing.md,
    alignItems:      'center',
  },
});
