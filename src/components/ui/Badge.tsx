import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/theme';

interface BadgeProps {
  label: string;
  tone?: 'gold' | 'success' | 'danger' | 'muted';
}

export function Badge({ label, tone = 'gold' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[tone]]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  gold: {
    backgroundColor: colors.gold,
  },
  success: {
    backgroundColor: colors.success,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  muted: {
    backgroundColor: colors.border,
  },
  label: {
    color: colors.bg,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
