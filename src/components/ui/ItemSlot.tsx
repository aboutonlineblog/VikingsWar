import type { ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { EquipSlot } from '@shared/types';
import { itemArt, itemSlotArt } from '@/assets';
import { colors, radius, spacing } from '@/theme/theme';

interface ItemSlotProps {
  slot: EquipSlot;
  itemId?: string;
  label?: string;
  selected?: boolean;
  onPress?: () => void;
}

export function ItemSlot({ slot, itemId, label, selected, onPress }: ItemSlotProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.slot, selected && styles.selected]}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label ?? slot}
    >
      <Image source={itemId ? itemArt(itemId, slot) : itemSlotArt(slot)} style={styles.art} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

export function ItemSlotGrid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  slot: {
    width: 72,
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  selected: {
    borderColor: colors.gold,
  },
  art: {
    width: 56,
    height: 56,
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
});
