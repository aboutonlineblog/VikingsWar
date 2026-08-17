import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme/theme';

interface HudPanelProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function HudPanel({ children, style, testID = 'hud-panel' }: HudPanelProps) {
  return (
    <View style={[styles.panel, style]} testID={testID}>
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
