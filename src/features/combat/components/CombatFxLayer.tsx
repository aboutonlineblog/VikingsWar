import { useEffect, useRef, type ReactElement } from 'react';
import { Animated, Easing, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { images } from '@/assets';
import { colors } from '@/theme/theme';
import type { CombatFx } from '../playback';

interface CombatFxLayerProps {
  fx: CombatFx | null;
}

export function CombatFxLayer({ fx }: CombatFxLayerProps): ReactElement | null {
  if (!fx) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.layer} testID={`combat-fx-${fx.action}`}>
      {fx.action === 'attack' || fx.action === 'special' ? (
        <SlashFx special={fx.action === 'special'} fromPlayer={fx.actor === 'player'} />
      ) : null}
      {fx.action === 'defend' ? <IconBurst source={images.combatDefend} fromPlayer={fx.actor === 'player'} /> : null}
      {fx.action === 'potion' ? <PotionFx fromPlayer={fx.actor === 'player'} /> : null}
    </View>
  );
}

function SlashFx({ special, fromPlayer }: { special: boolean; fromPlayer: boolean }): ReactElement {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: fromPlayer ? [-48, 56] : [48, -56],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <>
      <Animated.View
        style={[
          styles.slash,
          special && styles.slashSpecial,
          {
            opacity,
            transform: [{ translateX }, { rotate: fromPlayer ? '-32deg' : '32deg' }],
          },
        ]}
      />
      {special ? (
        <Animated.View
          style={[
            styles.burst,
            {
              opacity,
              transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.4] }) }],
            },
          ]}
        />
      ) : null}
    </>
  );
}

function IconBurst({
  source,
  fromPlayer,
}: {
  source: ImageSourcePropType;
  fromPlayer: boolean;
}): ReactElement {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.back(1.4)),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  return (
    <Animated.Image
      source={source}
      style={[
        styles.icon,
        fromPlayer ? styles.iconLeft : styles.iconRight,
        {
          opacity: progress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
          transform: [
            { scale: progress.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0.6, 1.25, 1] }) },
          ],
        },
      ]}
    />
  );
}

function PotionFx({ fromPlayer }: { fromPlayer: boolean }): ReactElement {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 560,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const rise = progress.interpolate({ inputRange: [0, 1], outputRange: [18, -28] });
  const opacity = progress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] });

  return (
    <View style={[styles.potionWrap, fromPlayer ? styles.iconLeft : styles.iconRight]}>
      <IconBurst source={images.combatPotion} fromPlayer={fromPlayer} />
      {[0, 1, 2].map((spark) => (
        <Animated.View
          key={spark}
          style={[
            styles.spark,
            {
              left: 10 + spark * 12,
              opacity,
              transform: [{ translateY: rise }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slash: {
    position: 'absolute',
    width: 150,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  slashSpecial: {
    height: 8,
    width: 170,
    backgroundColor: '#F4E8D0',
    shadowColor: colors.gold,
  },
  burst: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: 'rgba(201, 162, 39, 0.18)',
  },
  icon: {
    width: 56,
    height: 48,
    position: 'absolute',
  },
  iconLeft: {
    left: 24,
  },
  iconRight: {
    right: 24,
  },
  potionWrap: {
    position: 'absolute',
    width: 64,
    height: 64,
  },
  spark: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
});
