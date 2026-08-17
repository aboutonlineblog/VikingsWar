import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { HudProgressBar } from './HudProgressBar';
import { colors, spacing } from '@/theme/theme';

interface HudIdentityHeaderProps {
  portrait: ImageSourcePropType;
  name: string;
  level: number;
  xp: number;
  xpMax: number;
  settingsSlot?: ReactNode;
}

function formatValue(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

const PORTRAIT_SIZE = 64;

export function HudIdentityHeader({
  portrait,
  name,
  level,
  xp,
  xpMax,
  settingsSlot,
}: HudIdentityHeaderProps) {
  return (
    <View style={styles.wrap} testID="hud-identity-header">
      {settingsSlot ? <View style={styles.settingsSlot}>{settingsSlot}</View> : null}

      <View style={styles.main}>
        <View style={styles.portraitWrap}>
          <Image source={portrait} style={styles.portrait} resizeMode="cover" />
        </View>

        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.levelLabel}>Lv {level}</Text>
          <Text style={styles.xpLabel} testID="hud-xp-label">
            XP {formatValue(xp)}/{formatValue(xpMax)}
          </Text>
          <HudProgressBar
            current={xp}
            max={xpMax}
            color={colors.hudXp}
            variant="xp"
            testID="hud-xp-bar"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.xs,
    position: 'relative',
    paddingRight: 44,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  portraitWrap: {
    width: PORTRAIT_SIZE,
    height: PORTRAIT_SIZE,
    borderRadius: PORTRAIT_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.hudFrame,
    overflow: 'hidden',
    backgroundColor: colors.hudTrack,
  },
  portrait: {
    width: PORTRAIT_SIZE,
    height: PORTRAIT_SIZE,
  },
  identity: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
    minWidth: 0,
  },
  name: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 0.2,
  },
  levelLabel: {
    color: colors.hudLevel,
    fontSize: 13,
    fontWeight: '700',
  },
  xpLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  settingsSlot: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
});
