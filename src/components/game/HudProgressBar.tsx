import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/theme';

export type HudProgressBarVariant = 'xp' | 'stat';

interface HudProgressBarProps {
  current: number;
  max: number;
  color: string;
  variant?: HudProgressBarVariant;
  animated?: boolean;
  durationMs?: number;
  testID?: string;
}

export function HudProgressBar({
  current,
  max,
  color,
  variant = 'stat',
  animated = true,
  durationMs = 400,
  testID = 'hud-progress-bar',
}: HudProgressBarProps) {
  const progress = max <= 0 ? 0 : Math.min(1, Math.max(0, current / max));
  const scale = useRef(new Animated.Value(progress)).current;
  const isXp = variant === 'xp';
  const height = isXp ? 6 : 14;

  useEffect(() => {
    if (!animated) {
      scale.setValue(progress);
      return;
    }
    const animation = Animated.timing(scale, {
      toValue: progress,
      duration: Math.max(0, durationMs),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [animated, durationMs, progress, scale]);

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
        },
      ]}
      testID={testID}
    >
      <Animated.View
        testID={`${testID}-fill`}
        style={[
          styles.fill,
          {
            height,
            borderRadius: height / 2,
            backgroundColor: color,
            transform: [{ scaleX: scale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.hudTrack,
    overflow: 'hidden',
    borderRadius: 999,
  },
  fill: {
    width: '100%',
    transformOrigin: 'left center',
    overflow: 'hidden',
  },
});
