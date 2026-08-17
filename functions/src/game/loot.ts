import type { CollectionDef, ItemDef, LootTableDef } from '../../../shared/types';
import type { Rng } from './rng';

export function rollLootTable(
  table: LootTableDef,
  itemsById: Record<string, ItemDef>,
  rng: Rng,
): ItemDef | null {
  if (rng.next() > table.dropChance) {
    return null;
  }

  const totalWeight = table.entries.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight <= 0) {
    return null;
  }

  let roll = rng.next() * totalWeight;
  for (const entry of table.entries) {
    roll -= entry.weight;
    if (roll <= 0) {
      return itemsById[entry.itemId] ?? null;
    }
  }

  const last = table.entries[table.entries.length - 1];
  return last ? itemsById[last.itemId] ?? null : null;
}

export function recordItemInCollections(
  ownedItemIds: string[],
  sets: CollectionDef[],
): Record<string, string[]> {
  const owned = new Set(ownedItemIds);
  return Object.fromEntries(
    sets.map((set) => [set.id, set.itemIds.filter((id) => owned.has(id))]),
  );
}
