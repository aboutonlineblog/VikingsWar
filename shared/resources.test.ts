import { accrueResources, hasUncollected, pendingResourceEntries } from './resources';
import type { BuildingDef, BuildingState } from './types';

const farmDef: BuildingDef = {
  id: 'farm',
  name: 'Farm',
  description: 'Produces food',
  maxLevel: 10,
  produces: { food: 10 },
  perLevelRate: 1,
};

const farm: BuildingState = { id: 'farm', level: 2, upgradeCompletesAt: null };

describe('hasUncollected', () => {
  it('is false when every currency is zero or missing', () => {
    expect(hasUncollected({})).toBe(false);
    expect(hasUncollected({ food: 0, wood: 0 })).toBe(false);
  });

  it('is true when any collectable currency is pending', () => {
    expect(hasUncollected({ food: 3 })).toBe(true);
  });
});

describe('pendingResourceEntries', () => {
  it('lists only currencies with a positive amount', () => {
    expect(pendingResourceEntries({ food: 4, wood: 0, silver: 12 })).toEqual([
      { key: 'silver', amount: 12 },
      { key: 'food', amount: 4 },
    ]);
  });
});

describe('accrueResources', () => {
  it('accrues food from a farm over elapsed time', () => {
    const gained = accrueResources(
      { farm, greatHall: { id: 'greatHall', level: 1, upgradeCompletesAt: null } } as never,
      [farmDef],
      0,
      60 * 60 * 1000,
    );
    expect(gained.food).toBe(20);
    expect(hasUncollected(gained)).toBe(true);
  });
});
