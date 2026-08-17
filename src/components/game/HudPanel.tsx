import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/theme';

interface HudPanelProps {
  children: ReactNode;
  testID?: string;
}

export function HudPanel({ children, testID = 'hud-panel' }: HudPanelProps) {
  return (
    <View style={styles.panel} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.hudPanel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hudSectionBorder,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
});
