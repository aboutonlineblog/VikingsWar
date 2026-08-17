import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/theme';

interface StatBarProps {
  label: string;
  current: number;
  max: number;
  color: string;
  timer?: string;
  animated?: boolean;
  durationMs?: number;
}

export function StatBar({
  label,
  current,
  max,
  color,
  timer,
  animated = true,
  durationMs = 400,
}: StatBarProps) {
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

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>
          {label} {Math.round(current)}/{max}
        </Text>
        {timer ? <Text style={styles.timer}>{timer}</Text> : null}
      </View>
      <View style={styles.track}>
        <Animated.View
          testID="stat-bar-fill"
          style={[
            styles.fill,
            {
              backgroundColor: color,
              transform: [{ scaleX: scale }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  timer: {
    color: colors.gold,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 10,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  fill: {
    height: 10,
    width: '100%',
    borderRadius: radius.sm,
    transformOrigin: 'left center',
  },
});
