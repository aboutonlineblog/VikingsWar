import { useEffect, useRef, type ReactElement } from 'react';
import { Animated, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { CachedRemoteImage } from '@/components/ui/CachedRemoteImage';
import { CombatProgressBar } from '@/features/combat/components/CombatProgressBar';
import { images } from '@/assets';
import { colors, spacing } from '@/theme/theme';

export interface CombatFighterPanelProps {
  name: string;
  portrait?: ImageSourcePropType;
  portraitUri?: string;
  hp: number;
  hpMax: number;
  atb: number;
  hpColor: string;
  side: 'left' | 'right';
  durationMs: number;
  hitKey: number;
  lungeDir: number;
  freezeAtb: boolean;
  speedReady?: boolean;
  testID?: string;
}

export function CombatFighterPanel({
  name,
  portrait,
  portraitUri,
  hp,
  hpMax,
  atb,
  hpColor,
  side,
  durationMs,
  hitKey,
  lungeDir,
  freezeAtb,
  speedReady = false,
  testID,
}: CombatFighterPanelProps): ReactElement {
  const shakeX = useRef(new Animated.Value(0)).current;
  const lungeX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const isLeft = side === 'left';

  useEffect(() => {
    if (!hitKey) {
      return;
    }
    shakeX.setValue(0);
    scale.setValue(1);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(shakeX, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 3, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.08, duration: 90, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }),
      ]),
    ]).start();
  }, [hitKey, scale, shakeX]);

  useEffect(() => {
    if (!lungeDir) {
      lungeX.setValue(0);
      return;
    }
    lungeX.setValue(0);
    Animated.sequence([
      Animated.timing(lungeX, { toValue: 18 * lungeDir, duration: 120, useNativeDriver: true }),
      Animated.timing(lungeX, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [lungeDir, lungeX]);

  const portraitNode = portraitUri ? (
    <Animated.View style={{ transform: [{ translateX: Animated.add(shakeX, lungeX) }, { scale }] }}>
      <CachedRemoteImage
        uri={portraitUri}
        fallback={portrait ?? images.warriorBerserker}
        style={styles.portrait}
      />
    </Animated.View>
  ) : (
    <Animated.Image
      source={portrait ?? images.warriorBerserker}
      style={[styles.portrait, { transform: [{ translateX: Animated.add(shakeX, lungeX) }, { scale }] }]}
    />
  );

  const info = (
    <View style={styles.info}>
      <Text style={[styles.name, !isLeft && styles.nameRight]} numberOfLines={1}>
        {name}
      </Text>
      <CombatProgressBar
        variant="health"
        current={hp}
        max={hpMax}
        color={hpColor}
        animated
        durationMs={durationMs}
        testID={`${testID ?? side}-health-bar`}
      />
      <CombatProgressBar
        variant="speed"
        current={atb}
        max={100}
        color={colors.gold}
        animated={!freezeAtb}
        durationMs={durationMs}
        ready={speedReady}
        testID={`${testID ?? side}-speed-bar`}
      />
    </View>
  );

  return (
    <View style={styles.panel} testID={testID ?? `combat-fighter-${side}`}>
      {isLeft ? (
        <>
          {portraitNode}
          {info}
        </>
      ) : (
        <>
          {info}
          {portraitNode}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  portrait: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  nameRight: {
    textAlign: 'right',
  },
});
