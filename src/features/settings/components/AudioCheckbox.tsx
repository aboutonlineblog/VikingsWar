import type { ReactElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/theme';
import { Body } from '@/components/ui/Typography';

interface AudioCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  testID: string;
}

export function AudioCheckbox({
  label,
  checked,
  onChange,
  testID,
}: AudioCheckboxProps): ReactElement {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      testID={testID}
      onPress={() => onChange(!checked)}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <View style={styles.mark} /> : null}
      </View>
      <Body>{label}</Body>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    marginTop: spacing.xs,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.surface,
  },
  mark: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
});
