import { createNewPlayer } from './createPlayer';
import { applyShopProduct, isEmulatorFulfillmentAllowed } from './shop';
import type { ShopProductDef } from '../../../shared/types';

const speedup: ShopProductDef = {
  id: 'speedup_building',
  name: "Builder's Horn",
  description: 'Finish the current building upgrade.',
  productType: 'speedup',
  runeCost: 15,
  powerAffecting: false,
};

const eventPass: ShopProductDef = {
  id: 'event_pass_ragnarok',
  name: 'Ragnarok Event Pass',
  description: 'Extra event rewards.',
  productType: 'eventPass',
  runeCost: 90,
  powerAffecting: false,
};

describe('isEmulatorFulfillmentAllowed', () => {
  it('is only true inside the Functions emulator', () => {
    expect(isEmulatorFulfillmentAllowed({ FUNCTIONS_EMULATOR: 'true' })).toBe(true);
    expect(isEmulatorFulfillmentAllowed({})).toBe(false);
  });
});

describe('applyShopProduct', () => {
  it('finishes a busy building upgrade', () => {
    const player = createNewPlayer('uid', 'Erik', 'wolf', 0);
    player.currencies.runes = 15;
    player.buildings.farm.upgradeCompletesAt = 60_000;
    applyShopProduct(player, speedup, 1_000);
    expect(player.buildings.farm.level).toBe(2);
    expect(player.buildings.farm.upgradeCompletesAt).toBeNull();
    expect(player.currencies.runes).toBe(0);
  });

  it('does not charge when nothing is upgrading', () => {
    const player = createNewPlayer('uid', 'Erik', 'wolf', 0);
    player.currencies.runes = 15;
    expect(() => applyShopProduct(player, speedup, 1_000)).toThrow('NOTHING_TO_SPEED_UP');
    expect(player.currencies.runes).toBe(15);
  });

  it('records an event pass instead of charging for nothing', () => {
    const player = createNewPlayer('uid', 'Erik', 'wolf', 0);
    player.currencies.runes = 90;
    applyShopProduct(player, eventPass, 1_000);
    expect(player.eventPasses).toEqual(['event_pass_ragnarok']);
    expect(player.currencies.runes).toBe(0);
  });
});
