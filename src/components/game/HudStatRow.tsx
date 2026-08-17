import { StyleSheet, Text, View } from 'react-native';
import { HudProgressBar } from './HudProgressBar';
import { colors, spacing } from '@/theme/theme';

interface HudStatRowProps {
  label: string;
  current: number;
  max: number;
  color: string;
  timer?: string;
  testID?: string;
}

function formatValue(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

export function HudStatRow({
  label,
  current,
  max,
  color,
  timer,
  testID,
}: HudStatRowProps) {
  const rowTestId = testID ?? `hud-stat-${label.toLowerCase()}`;

  return (
    <View style={styles.container} testID={rowTestId}>
      <View style={styles.header}>
        <Text style={styles.label}>
          {label} {formatValue(current)}/{formatValue(max)}
        </Text>
        {timer ? <Text style={styles.timer}>{timer}</Text> : null}
      </View>
      <HudProgressBar
        current={current}
        max={max}
        color={color}
        variant="stat"
        testID={`${rowTestId}-bar`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  timer: {
    color: colors.hudLevel,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
