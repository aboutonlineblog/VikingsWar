import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/theme';

interface TimerProps {
  value: string;
  label?: string;
}

export function Timer({ value, label }: TimerProps) {
  return (
    <View style={styles.wrap} accessibilityLabel={label ? `${label} ${value}` : value}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bg,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
});
