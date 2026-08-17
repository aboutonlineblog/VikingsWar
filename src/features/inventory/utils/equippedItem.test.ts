import { emptyEquipment } from '@shared/types';
import type { ItemDef } from '@shared/types';
import { equippedItemForSlot, formatItemType, formatRarity, titleCaseLabel } from './equippedItem';

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

describe('equippedItemForSlot', () => {
  it('returns the catalog item for an equipped instance', () => {
    const equipment = { ...emptyEquipment(), weapon: 'i1' };
    const inventory = [{ instanceId: 'i1', itemId: 'iron_axe', equippedSlot: 'weapon' as const }];
    expect(equippedItemForSlot(equipment, inventory, { iron_axe: ironAxe }, 'weapon')).toEqual(ironAxe);
  });

  it('returns null when the slot is empty', () => {
    expect(equippedItemForSlot(emptyEquipment(), [], { iron_axe: ironAxe }, 'weapon')).toBeNull();
  });

  it('returns null when the instance or catalog entry is missing', () => {
    const equipment = { ...emptyEquipment(), weapon: 'missing' };
    expect(equippedItemForSlot(equipment, [], { iron_axe: ironAxe }, 'weapon')).toBeNull();

    const inventory = [{ instanceId: 'i1', itemId: 'unknown', equippedSlot: 'weapon' as const }];
    const equipped = { ...emptyEquipment(), weapon: 'i1' };
    expect(equippedItemForSlot(equipped, inventory, { iron_axe: ironAxe }, 'weapon')).toBeNull();
  });
});

describe('item labels', () => {
  it('formats slot and weapon type', () => {
    expect(formatItemType(ironAxe)).toBe('Weapon · Axe');
    expect(formatItemType({ ...ironAxe, slot: 'helmet', weaponType: undefined })).toBe('Helmet');
    expect(formatItemType({ ...ironAxe, weaponType: 'daneAxe' })).toBe('Weapon · Dane Axe');
    expect(formatRarity('epic')).toBe('Epic');
    expect(titleCaseLabel('headband')).toBe('Headband');
  });
});
