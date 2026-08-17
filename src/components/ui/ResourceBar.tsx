import { Image, StyleSheet, Text, View } from 'react-native';
import type { Currencies } from '@shared/types';
import { images, resourceIcon, type ResourceIconName } from '@/assets';
import { colors, spacing } from '@/theme/theme';
import { formatCompact } from '@/utils/progress';

interface ResourceBarProps {
  currencies: Currencies;
}

const BASE_ITEMS: Array<{ key: ResourceIconName; value: (c: Currencies) => number }> = [
  { key: 'silver', value: (c) => c.silver },
  { key: 'food', value: (c) => c.food },
  { key: 'wood', value: (c) => c.wood },
  { key: 'iron', value: (c) => c.iron },
  { key: 'runes', value: (c) => c.runes },
];

export function ResourceBar({ currencies }: ResourceBarProps) {
  const items = [...BASE_ITEMS];
  if (currencies.gold > 0) {
    items.splice(1, 0, { key: 'gold', value: (c) => c.gold });
  }

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.key} style={styles.item} accessibilityLabel={`${item.key} ${item.value(currencies)}`}>
          <Image
            source={item.key === 'gold' ? images.rankGold : resourceIcon(item.key)}
            style={styles.icon}
          />
          <Text style={[styles.value, item.key === 'runes' && styles.runes, item.key === 'gold' && styles.gold]}>
            {formatCompact(item.value(currencies))}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    width: 18,
    height: 18,
  },
  value: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  runes: {
    color: colors.gold,
  },
  gold: {
    color: colors.gold,
  },
});
