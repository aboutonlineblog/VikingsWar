import { Image, Pressable, StyleSheet, Text, type ImageSourcePropType } from 'react-native';
import { colors, radius, spacing } from '@/theme/theme';
import type { PlayerCombatAction } from '@shared/types';

const ACTION_COLORS: Record<PlayerCombatAction, string> = {
  attack: '#5C2A2A',
  special: '#6B4A1E',
  defend: '#1E3A5C',
  potion: '#1E4A2E',
};

export interface CombatActionButtonProps {
  action: PlayerCombatAction;
  label: string;
  source: ImageSourcePropType;
  disabled?: boolean;
  onPress: () => void;
  testID?: string;
}

export function CombatActionButton({
  action,
  label,
  source,
  disabled = false,
  onPress,
  testID,
}: CombatActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      testID={testID ?? `combat-action-${action}`}
      style={[styles.button, { backgroundColor: ACTION_COLORS[action] }, disabled && styles.disabled]}
    >
      <Image source={source} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    width: 44,
    height: 36,
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
