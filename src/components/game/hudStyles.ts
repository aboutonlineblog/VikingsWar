import { Platform, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme/theme';

/** Shared inset-well styling used across HUD sections. */
export const hudStyles = StyleSheet.create({
  outerFrame: {
    borderWidth: 2,
    borderColor: colors.hudFrame,
    borderRadius: radius.md + 2,
    padding: 2,
    backgroundColor: colors.hudFrameShadow,
    ...Platform.select({
      ios: {
        shadowColor: colors.hudFrame,
        shadowOpacity: 0.35,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  panel: {
    backgroundColor: colors.hudPanel,
    borderWidth: 1,
    borderColor: colors.hudFrameInner,
    borderRadius: radius.md,
    borderBottomLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
  },
  recessed: {
    backgroundColor: colors.hudSection,
    borderWidth: 1,
    borderColor: colors.hudSectionBorder,
    borderTopColor: colors.hudInsetTop,
    borderBottomColor: colors.hudInsetBottom,
    borderRadius: radius.sm,
  },
  recessedPill: {
    backgroundColor: colors.hudSection,
    borderWidth: 1,
    borderColor: colors.hudSectionBorder,
    borderTopColor: colors.hudInsetTop,
    borderBottomColor: colors.hudInsetBottom,
    borderRadius: 999,
  },
  resourceSlot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minWidth: 0,
    backgroundColor: colors.hudSection,
    borderWidth: 1,
    borderColor: colors.hudSectionBorder,
    borderTopColor: colors.hudInsetTop,
    borderBottomColor: colors.hudInsetBottom,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  goldDivider: {
    width: 1,
    backgroundColor: colors.hudDivider,
    opacity: 0.85,
  },
});

export function hudGlow(color: string, intensity: 'soft' | 'strong' = 'strong') {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOpacity: intensity === 'strong' ? 0.85 : 0.55,
      shadowRadius: intensity === 'strong' ? 6 : 3,
      shadowOffset: { width: 0, height: 0 },
    },
    android: {
      elevation: intensity === 'strong' ? 4 : 2,
    },
  });
}
