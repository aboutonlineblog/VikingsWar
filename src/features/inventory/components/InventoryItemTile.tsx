import type { ReactElement } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { EquipSlot, Rarity } from '@shared/types';
import { itemArt } from '@/assets';
import { rarityStyle } from '@/theme/rarity';
import { colors, radius, spacing } from '@/theme/theme';

interface InventoryItemTileProps {
  name: string;
  itemId: string;
  slot: EquipSlot;
  rarity: Rarity;
  equipped?: boolean;
  loading?: boolean;
  onPress: () => void;
}

export function InventoryItemTile({
  name,
  itemId,
  slot,
  rarity,
  equipped = false,
  loading = false,
  onPress,
}: InventoryItemTileProps): ReactElement {
  const tone = rarityStyle(rarity);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityState={{ selected: equipped, busy: loading }}
      testID={`inventory-tile-${itemId}`}
      onPress={onPress}
      disabled={loading}
      style={styles.tile}
    >
      <View
        testID={`inventory-tile-frame-${rarity}`}
        style={[styles.frame, { borderColor: tone.border, backgroundColor: tone.fill }]}
      >
        {rarity === 'celestial' ? (
          <>
            <View style={[styles.celestialHighlight, { backgroundColor: tone.highlight }]} />
            <View style={[styles.celestialShade, { backgroundColor: tone.shade }]} />
          </>
        ) : null}
        <Image
          source={itemArt(itemId, slot)}
          accessibilityLabel={`${name} image`}
          resizeMode="cover"
          style={styles.art}
        />
        {equipped ? <View testID="inventory-tile-equipped" style={styles.equippedMark} /> : null}
      </View>
      <Text numberOfLines={2} style={styles.name}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  frame: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  art: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  celestialHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    opacity: 0.7,
  },
  celestialShade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    opacity: 0.45,
  },
  equippedMark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    borderWidth: 1,
    borderColor: colors.bg,
    zIndex: 2,
  },
  name: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});
