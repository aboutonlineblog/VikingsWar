import type {
  CollectionDef,
  EquipSlot,
  InventoryItem,
  ItemDef,
  Player,
  Warrior,
} from '../../../shared/types';
import { EQUIP_SLOTS, SPEED_ACCESSORY_SLOTS } from '../../../shared/types';
import { baseStatsForLevel } from './xp';

const SPEED_SLOTS = new Set<EquipSlot>(SPEED_ACCESSORY_SLOTS);

export function warriorBonuses(warriors: Warrior[]): {
  attack: number;
  defense: number;
} {
  return warriors.reduce(
    (acc, warrior) => ({
      attack: acc.attack + warrior.attack,
      defense: acc.defense + warrior.defense,
    }),
    { attack: 0, defense: 0 },
  );
}

export function equipmentBonuses(
  player: Player,
  itemsById: Record<string, ItemDef>,
): { attack: number; defense: number; health: number; speed: number } {
  return EQUIP_SLOTS.reduce(
    (acc, slot) => {
      const instanceId = player.equipment[slot];
      if (!instanceId) {
        return acc;
      }
      const instance = player.inventory.find((item) => item.instanceId === instanceId);
      if (!instance) {
        return acc;
      }
      const def = itemsById[instance.itemId];
      if (!def) {
        return acc;
      }
      return {
        attack: acc.attack + def.attack,
        defense: acc.defense + def.defense,
        health: acc.health + def.health,
        speed: acc.speed + (SPEED_SLOTS.has(slot) ? (def.speed ?? 0) : 0),
      };
    },
    { attack: 0, defense: 0, health: 0, speed: 0 },
  );
}

export function collectionBonuses(
  player: Player,
  collections: CollectionDef[],
): { attackPercent: number; defensePercent: number } {
  return collections.reduce(
    (acc, set) => {
      const owned = new Set(player.collections[set.id] ?? []);
      const complete = set.itemIds.every((id) => owned.has(id));
      if (!complete) {
        return acc;
      }
      return {
        attackPercent: acc.attackPercent + (set.bonus.attackPercent ?? 0),
        defensePercent: acc.defensePercent + (set.bonus.defensePercent ?? 0),
      };
    },
    { attackPercent: 0, defensePercent: 0 },
  );
}

export function computeCombatStats(
  player: Player,
  itemsById: Record<string, ItemDef>,
  collections: CollectionDef[],
): { health: number; attack: number; defense: number; speed: number } {
  const base = baseStatsForLevel(player.level);
  const gear = equipmentBonuses(player, itemsById);
  const warband = warriorBonuses(player.warriors);
  const sets = collectionBonuses(player, collections);
  const attack = Math.round(
    (base.attack + gear.attack + warband.attack) * (1 + sets.attackPercent / 100),
  );
  const defense = Math.round(
    (base.defense + gear.defense + warband.defense) * (1 + sets.defensePercent / 100),
  );
  const health = base.health + gear.health;
  const speed = Math.max(1, base.speed + gear.speed);
  return { health, attack, defense, speed };
}

export function applyCombatStats(
  player: Player,
  itemsById: Record<string, ItemDef>,
  collections: CollectionDef[],
): void {
  const stats = computeCombatStats(player, itemsById, collections);
  player.attack = stats.attack;
  player.defense = stats.defense;
  player.maxHealth = stats.health;
  player.speed = stats.speed;
}

export function findInventoryItem(
  inventory: InventoryItem[],
  instanceId: string,
): InventoryItem | undefined {
  return inventory.find((item) => item.instanceId === instanceId);
}
