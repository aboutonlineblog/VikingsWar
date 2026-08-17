import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme/theme';

export interface CombatProgressBarProps {
  variant: 'health' | 'speed';
  current: number;
  max: number;
  color: string;
  animated?: boolean;
  durationMs?: number;
  ready?: boolean;
  testID?: string;
}

function formatBarValue(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

export function CombatProgressBar({
  variant,
  current,
  max,
  color,
  animated = true,
  durationMs = 400,
  ready = false,
  testID,
}: CombatProgressBarProps) {
  const progress = max <= 0 ? 0 : Math.min(1, Math.max(0, current / max));
  const scale = useRef(new Animated.Value(progress)).current;

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

  const isHealth = variant === 'health';
  const trackStyle = isHealth ? styles.healthTrack : styles.speedTrack;
  const fillStyle = isHealth ? styles.healthFill : styles.speedFill;

  return (
    <View
      style={[styles.frame, ready && styles.frameReady]}
      testID={testID ?? `combat-progress-bar-${variant}`}
    >
      <View style={trackStyle}>
        <Animated.View
          testID={`${testID ?? `combat-progress-bar-${variant}`}-fill`}
          style={[
            fillStyle,
            {
              backgroundColor: color,
              transform: [{ scaleX: scale }],
            },
          ]}
        />
        {isHealth ? (
          <Text style={styles.healthText} pointerEvents="none">
            {formatBarValue(current)} / {formatBarValue(max)}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  frameReady: {
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.55,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  healthTrack: {
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  healthFill: {
    ...StyleSheet.absoluteFill,
    transformOrigin: 'left center',
  },
  healthText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 1,
  },
  speedTrack: {
    height: 8,
    overflow: 'hidden',
  },
  speedFill: {
    height: 8,
    width: '100%',
    transformOrigin: 'left center',
  },
});
