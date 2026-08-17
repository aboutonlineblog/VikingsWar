import { useEffect, useRef, type ReactElement } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/theme';

interface BloodOverlayProps {
  active: boolean;
  triggerKey: number;
}

export function BloodOverlay({ active, triggerKey }: BloodOverlayProps): ReactElement | null {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      opacity.setValue(0);
      return;
    }
    opacity.setValue(0);
    const animation = Animated.sequence([
      Animated.timing(opacity, { toValue: 0.82, duration: 90, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.45, duration: 160, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [active, opacity, triggerKey]);

  if (!active) {
    return null;
  }

  return (
    <Animated.View pointerEvents="none" testID="combat-blood-overlay" style={[styles.overlay, { opacity }]}>
      <View style={[styles.edge, styles.top]} />
      <View style={[styles.edge, styles.bottom]} />
      <View style={[styles.edge, styles.left]} />
      <View style={[styles.edge, styles.right]} />
      <View style={styles.splatA} />
      <View style={styles.splatB} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
  },
  edge: {
    position: 'absolute',
    backgroundColor: colors.blood,
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
    height: 54,
    opacity: 0.85,
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    opacity: 0.8,
  },
  left: {
    top: 0,
    bottom: 0,
    left: 0,
    width: 28,
    opacity: 0.7,
  },
  right: {
    top: 0,
    bottom: 0,
    right: 0,
    width: 28,
    opacity: 0.7,
  },
  splatA: {
    position: 'absolute',
    top: 72,
    left: 18,
    width: 34,
    height: 22,
    borderRadius: 16,
    backgroundColor: colors.danger,
    opacity: 0.7,
  },
  splatB: {
    position: 'absolute',
    bottom: 88,
    right: 22,
    width: 26,
    height: 18,
    borderRadius: 12,
    backgroundColor: colors.danger,
    opacity: 0.65,
  },
});
