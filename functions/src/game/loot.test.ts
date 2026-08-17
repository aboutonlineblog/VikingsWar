import { recordItemInCollections, rollLootTable } from './loot';
import { createRng } from './rng';
import type { ItemDef, LootTableDef } from '../../../shared/types';

const ironAxe: ItemDef = {
  id: 'iron_axe',
  name: 'Iron Axe',
  slot: 'weapon',
  rarity: 'common',
  weaponType: 'axe',
  attack: 18,
  defense: 0,
  health: 0,
  speed: 0,
};

const table: LootTableDef = {
  id: 'coastal',
  dropChance: 1,
  entries: [
    { itemId: 'iron_axe', weight: 10 },
    { itemId: 'missing', weight: 0 },
  ],
};

describe('rollLootTable', () => {
  it('returns an item from the table with a seeded rng', () => {
    const item = rollLootTable(table, { iron_axe: ironAxe }, createRng(7));
    expect(item?.id).toBe('iron_axe');
  });

  it('can drop nothing when dropChance fails', () => {
    const empty: LootTableDef = { ...table, dropChance: 0 };
    const item = rollLootTable(empty, { iron_axe: ironAxe }, createRng(7));
    expect(item).toBeNull();
  });
});

describe('recordItemInCollections', () => {
  it('only stores catalog collection ids, not dropped item ids', () => {
    const next = recordItemInCollections(['iron_axe', 'wolf_ring'], [
      {
        id: 'season1_trophies',
        name: 'Season 1 Trophies',
        itemIds: ['season1_cloak_pin', 'wolf_ring'],
        bonus: { defensePercent: 5 },
      },
    ]);
    expect(next).toEqual({ season1_trophies: ['wolf_ring'] });
    expect(next.iron_axe).toBeUndefined();
    expect(next.drops).toBeUndefined();
  });
});
