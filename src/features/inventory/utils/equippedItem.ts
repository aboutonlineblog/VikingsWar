import type { EquipSlot, InventoryItem, ItemDef } from '@shared/types';

export function titleCaseLabel(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (char) => char.toUpperCase());
}

export function formatItemType(item: ItemDef): string {
  const slotLabel = titleCaseLabel(item.slot);
  if (!item.weaponType) {
    return slotLabel;
  }
  return `${slotLabel} · ${titleCaseLabel(item.weaponType)}`;
}

export function formatRarity(rarity: ItemDef['rarity']): string {
  return titleCaseLabel(rarity);
}

export function equippedItemForSlot(
  equipment: Record<EquipSlot, string | null>,
  inventory: InventoryItem[],
  itemsById: Record<string, ItemDef>,
  slot: EquipSlot,
): ItemDef | null {
  const instanceId = equipment[slot];
  if (!instanceId) {
    return null;
  }

  const instance = inventory.find((entry) => entry.instanceId === instanceId);
  if (!instance) {
    return null;
  }

  return itemsById[instance.itemId] ?? null;
}
