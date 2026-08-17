import { Image, StyleSheet, Text, View } from 'react-native';
import { hudStatIcon } from '@/assets';
import { hudStyles } from './hudStyles';
import { colors, spacing } from '@/theme/theme';

interface HudCombatStatsProps {
  attack: number;
  defense: number;
  speed: number;
}

function formatStat(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

interface CombatStatColumnProps {
  label: string;
  value: number;
  color: string;
  iconName: 'attack' | 'defense' | 'speed';
}

function CombatStatColumn({ label, value, color, iconName }: CombatStatColumnProps) {
  return (
    <View style={styles.column} testID={`hud-combat-${label.toLowerCase()}`}>
      <Image source={hudStatIcon(iconName)} style={styles.icon} resizeMode="contain" />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.value, { color }]}>{formatStat(value)}</Text>
    </View>
  );
}

export function HudCombatStats({ attack, defense, speed }: HudCombatStatsProps) {
  return (
    <View style={[hudStyles.recessed, styles.row]} testID="hud-combat-stats">
      <CombatStatColumn label="ATK" value={attack} color={colors.hudAtk} iconName="attack" />
      <View style={[hudStyles.goldDivider, styles.separator]} />
      <CombatStatColumn label="DEF" value={defense} color={colors.hudDef} iconName="defense" />
      <View style={[hudStyles.goldDivider, styles.separator]} />
      <CombatStatColumn label="SPD" value={speed} color={colors.hudSpd} iconName="speed" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  separator: {
    height: 48,
  },
  icon: {
    width: 30,
    height: 30,
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
