import { Image, StyleSheet, Text, View } from 'react-native';
import type { Currencies } from '@shared/types';
import { resourceIcon, type ResourceIconName } from '@/assets';
import { colors, spacing } from '@/theme/theme';

interface HudResourceRowProps {
  currencies: Currencies;
}

const RESOURCE_ORDER: ResourceIconName[] = ['silver', 'food', 'wood', 'iron', 'runes'];

const RESOURCE_VALUES: Record<ResourceIconName, (c: Currencies) => number> = {
  silver: (c) => c.silver,
  food: (c) => c.food,
  wood: (c) => c.wood,
  iron: (c) => c.iron,
  runes: (c) => c.runes,
  gold: (c) => c.gold,
};

function formatResourceValue(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

export function HudResourceRow({ currencies }: HudResourceRowProps) {
  return (
    <View style={styles.bar} testID="hud-resource-row">
      {RESOURCE_ORDER.map((key) => {
        const value = RESOURCE_VALUES[key](currencies);
        const isZero = value === 0;

        return (
          <View
            key={key}
            style={styles.item}
            accessibilityLabel={`${key} ${value}`}
          >
            <Image source={resourceIcon(key)} style={styles.icon} resizeMode="contain" />
            <Text style={[styles.value, isZero && styles.zeroValue]} numberOfLines={1}>
              {formatResourceValue(value)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 0,
  },
  icon: {
    width: 22,
    height: 22,
  },
  value: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
  },
  zeroValue: {
    color: colors.hudLevel,
  },
});
