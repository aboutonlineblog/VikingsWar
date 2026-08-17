import { Image, Pressable, StyleSheet, View } from 'react-native';
import { images } from '@/assets';

interface HudCollapseTabProps {
  expanded: boolean;
  onPress: () => void;
}

const ICON_WIDTH = 56;
const ICON_HEIGHT = Math.round(ICON_WIDTH * (202 / 252));

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
          testID="hud-chevron-icon"
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
    marginTop: -18,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
  },
  iconExpanded: {
    transform: [{ rotate: '180deg' }],
  },
});
