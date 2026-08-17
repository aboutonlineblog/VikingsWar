import { Image, Pressable, StyleSheet, View } from 'react-native';
import { images } from '@/assets';
import { colors } from '@/theme/theme';

interface HudCollapseTabProps {
  expanded: boolean;
  onPress: () => void;
}

export function HudCollapseTab({ expanded, onPress }: HudCollapseTabProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Collapse HUD' : 'Expand HUD'}
        testID="hud-chevron"
        onPress={onPress}
        style={styles.tab}
      >
        <Image
          source={images.hudChevronDown}
          style={[styles.icon, expanded && styles.iconExpanded]}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginTop: -10,
  },
  tab: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.hudFrame,
    backgroundColor: colors.hudSection,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 16,
    height: 16,
  },
  iconExpanded: {
    transform: [{ rotate: '180deg' }],
  },
});
