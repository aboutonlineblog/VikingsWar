import { StyleSheet, View } from 'react-native';
import { Body } from './Typography';
import { colors, spacing } from '@/theme/theme';

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Body>{title}</Body>
      <Body muted>{message}</Body>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
});
