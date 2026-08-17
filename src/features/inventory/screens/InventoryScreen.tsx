import { FlatList, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Title } from '@/components/ui/Typography';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePlayer } from '@/features/player';
import { useEquipItem, useItemsCatalog } from '@/features/inventory/hooks/useGear';
import { InventoryItemTile } from '@/features/inventory/components/InventoryItemTile';
import { spacing } from '@/theme/theme';
import type { InventoryItem } from '@shared/types';

const GRID_COLUMNS = 5;

export function InventoryScreen() {
  const player = usePlayer();
  const items = useItemsCatalog();
  const equip = useEquipItem();
  const byId = Object.fromEntries((items.data ?? []).map((item) => [item.id, item]));
  const inventory = player.data?.inventory ?? [];

  function renderItem({ item: instance }: { item: InventoryItem }) {
    const def = byId[instance.itemId];
    return (
      <InventoryItemTile
        name={def?.name ?? instance.itemId}
        itemId={def?.id ?? instance.itemId}
        slot={def?.slot ?? 'weapon'}
        rarity={def?.rarity ?? 'common'}
        equipped={Boolean(instance.equippedSlot)}
        loading={equip.isPending && equip.variables === instance.instanceId}
        onPress={() => equip.mutate(instance.instanceId)}
      />
    );
  }

  return (
    <Screen scroll={false}>
      <FlatList
        testID="inventory-grid"
        accessibilityLabel="Inventory, 5 columns"
        data={inventory}
        keyExtractor={(instance) => instance.instanceId}
        numColumns={GRID_COLUMNS}
        renderItem={renderItem}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Title>Inventory</Title>}
        ListEmptyComponent={
          <EmptyState title="Empty packs" message="No loot yet. Raid, hunt, and complete quests." />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  row: {
    gap: spacing.sm,
  },
});
