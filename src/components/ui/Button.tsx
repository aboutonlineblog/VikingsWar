import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '@/theme/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  testID?: string;
}

export function Button({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  testID,
}: ButtonProps) {
  const busy = Boolean(disabled || loading);
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={loading ? 'Loading' : label}
      accessibilityState={{ disabled: busy, busy: Boolean(loading) }}
      onPress={onPress}
      disabled={busy}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        variant === 'success' && styles.success,
        busy && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.bgElevated,
    borderColor: colors.gold,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: '#E8B4B4',
  },
  success: {
    backgroundColor: colors.success,
    borderColor: '#8FCB9B',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
