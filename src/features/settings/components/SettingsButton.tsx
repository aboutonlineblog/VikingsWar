import type { ReactElement } from 'react';
import { Image, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { images } from '@/assets';
import { useSettings } from '../hooks/useSettings';

interface SettingsButtonProps {
  variant?: 'default' | 'hud';
}

const HUD_ICON_WIDTH = 42;
const HUD_ICON_HEIGHT = 40;

export function SettingsButton({ variant = 'default' }: SettingsButtonProps): ReactElement {
  const { openSettings } = useSettings();
  const isHud = variant === 'hud';

  if (isHud) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Settings"
        testID="settings-button"
        hitSlop={8}
        onPress={openSettings}
        style={styles.buttonHud}
      >
        <Image
          source={images.hudSettings}
          style={styles.iconHud}
          resizeMode="contain"
        />
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Settings"
      testID="settings-button"
      hitSlop={8}
      onPress={openSettings}
      style={styles.button}
    >
      <Image source={images.navSettings} style={styles.icon} resizeMode="contain" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
  buttonHud: {
    width: HUD_ICON_WIDTH,
    height: HUD_ICON_HEIGHT,
  },
  icon: {
    width: 28,
    height: 28,
  },
  iconHud: {
    width: HUD_ICON_WIDTH,
    height: HUD_ICON_HEIGHT,
  },
});
