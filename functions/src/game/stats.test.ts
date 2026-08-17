import { createNewPlayer } from './createPlayer';
import { computeCombatStats, equipmentBonuses } from './stats';
import type { ItemDef } from '../../../shared/types';

const helmet: ItemDef = {
  id: 'iron_helm',
  name: 'Iron Helm',
  slot: 'helmet',
  rarity: 'common',
  attack: 0,
  defense: 8,
  health: 10,
  speed: 20,
};

const ring: ItemDef = {
  id: 'wolf_ring',
  name: 'Wolf Ring',
  slot: 'ring',
  rarity: 'rare',
  attack: 8,
  defense: 4,
  health: 0,
  speed: 8,
};

describe('equipmentBonuses', () => {
  it('adds speed only from accessory slots', () => {
    const player = createNewPlayer('uid', 'Erik', 'wolf', 0);
    player.inventory = [
      { instanceId: 'helm-1', itemId: 'iron_helm', equippedSlot: 'helmet' },
      { instanceId: 'ring-1', itemId: 'wolf_ring', equippedSlot: 'ring' },
    ];
    player.equipment.helmet = 'helm-1';
    player.equipment.ring = 'ring-1';
    const gear = equipmentBonuses(player, { iron_helm: helmet, wolf_ring: ring });
    expect(gear.speed).toBe(8);
    expect(gear.defense).toBe(12);
  });
});

describe('computeCombatStats', () => {
  it('includes base speed from level plus accessory speed', () => {
    const player = createNewPlayer('uid', 'Erik', 'wolf', 0);
    player.inventory = [{ instanceId: 'ring-1', itemId: 'wolf_ring', equippedSlot: 'ring' }];
    player.equipment.ring = 'ring-1';
    const stats = computeCombatStats(player, { wolf_ring: ring }, []);
    expect(stats.speed).toBe(10 + 8);
    expect(stats.attack).toBe(14 + 8);
  });
});
