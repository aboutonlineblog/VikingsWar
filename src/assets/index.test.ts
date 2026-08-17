import type { BuildingId, EquipSlot, TerritoryId, WarriorClass } from '@shared/types';
import {
  buildingArt,
  CATALOG_ITEM_IDS,
  itemArt,
  itemSlotArt,
  lootChestArt,
  prestigeRank,
  resourceIcon,
  territoryArt,
  warriorArt,
} from './index';

describe('asset registry', () => {
  it('maps each game currency to an icon', () => {
    expect(resourceIcon('silver')).toBeDefined();
    expect(resourceIcon('food')).toBeDefined();
    expect(resourceIcon('wood')).toBeDefined();
    expect(resourceIcon('iron')).toBeDefined();
    expect(resourceIcon('runes')).toBeDefined();
  });

  it('maps every building id, reusing closest art where needed', () => {
    const ids: BuildingId[] = [
      'greatHall',
      'farm',
      'lumberCamp',
      'ironMine',
      'blacksmith',
      'barracks',
      'shipyard',
      'tradingPost',
      'temple',
    ];
    ids.forEach((id) => {
      expect(buildingArt(id)).toBeDefined();
    });
    expect(buildingArt('lumberCamp')).toBe(buildingArt('farm'));
    expect(buildingArt('ironMine')).toBe(buildingArt('blacksmith'));
    expect(buildingArt('tradingPost')).toBe(buildingArt('greatHall'));
  });

  it('maps warrior classes and equipment slots', () => {
    const classes: WarriorClass[] = ['berserker', 'shieldmaiden', 'archer', 'raider'];
    classes.forEach((warriorClass) => {
      expect(warriorArt(warriorClass)).toBeDefined();
    });
    expect(warriorArt('raider')).toBe(warriorArt('berserker'));

    const slots: EquipSlot[] = [
      'weapon',
      'helmet',
      'armor',
      'shield',
      'boots',
      'ring',
      'amulet',
      'necklace',
      'bracelet',
      'earrings',
      'headband',
    ];
    slots.forEach((slot) => {
      expect(itemSlotArt(slot)).toBeDefined();
    });
  });

  it('maps every catalog item id and falls back to slot art', () => {
    CATALOG_ITEM_IDS.forEach((id) => {
      expect(itemArt(id)).toBeDefined();
    });
    expect(itemArt('unknown_relic', 'boots')).toBe(itemSlotArt('boots'));
    expect(itemArt('unknown_relic')).toBe(itemSlotArt('weapon'));
  });

  it('maps every territory to a panorama', () => {
    const ids: TerritoryId[] = [
      'village',
      'coastalLands',
      'northernForest',
      'frozenMountains',
      'enemyKingdom',
      'legendaryLands',
    ];
    ids.forEach((id) => {
      expect(territoryArt(id)).toBeDefined();
    });
  });

  it('maps prestige to rank names', () => {
    expect(prestigeRank(0)).toBe('bronze');
    expect(prestigeRank(100)).toBe('silver');
    expect(prestigeRank(250)).toBe('gold');
    expect(prestigeRank(500)).toBe('platinum');
    expect(prestigeRank(750)).toBe('diamond');
    expect(prestigeRank(1000)).toBe('champion');
  });

  it('picks a chest for loot display', () => {
    expect(lootChestArt(null)).toBeDefined();
    expect(lootChestArt('Dragon Shield')).toBeDefined();
    expect(lootChestArt("Thor's Hammer fragment")).toBeDefined();
  });
});
