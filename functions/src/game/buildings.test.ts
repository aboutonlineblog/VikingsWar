import { accrueResources, completeUpgradeIfDue, upgradeCost } from './buildings';
import type { BuildingDef, BuildingState } from '../../../shared/types';

const farmDef: BuildingDef = {
  id: 'farm',
  name: 'Farm',
  description: 'Produces food',
  maxLevel: 10,
  produces: { food: 10 },
  perLevelRate: 1,
};

describe('buildings', () => {
  it('accrues food from a farm over elapsed time', () => {
    const farm: BuildingState = { id: 'farm', level: 2, upgradeCompletesAt: null };
    const gained = accrueResources(
      { farm, greatHall: { id: 'greatHall', level: 1, upgradeCompletesAt: null } } as never,
      [farmDef],
      0,
      60 * 60 * 1000,
    );
    expect(gained.food).toBe(20);
  });

  it('completes an upgrade when the timer has elapsed', () => {
    const building: BuildingState = {
      id: 'farm',
      level: 1,
      upgradeCompletesAt: 1000,
    };
    expect(completeUpgradeIfDue(building, 1000).level).toBe(2);
    expect(completeUpgradeIfDue(building, 999).level).toBe(1);
  });

  it('scales upgrade cost with level', () => {
    expect(upgradeCost(1).wood).toBe(80);
  });

  it('accrues the new rate only after an upgrade completes', () => {
    const farm: BuildingState = {
      id: 'farm',
      level: 1,
      upgradeCompletesAt: 30 * 60 * 1000,
    };
    const gained = accrueResources(
      { farm } as never,
      [farmDef],
      0,
      60 * 60 * 1000,
    );
    expect(gained.food).toBe(10);
  });

  it('does not accrue while an upgrade is still running', () => {
    const farm: BuildingState = {
      id: 'farm',
      level: 2,
      upgradeCompletesAt: 2 * 60 * 60 * 1000,
    };
    const gained = accrueResources({ farm } as never, [farmDef], 0, 60 * 60 * 1000);
    expect(gained.food ?? 0).toBe(0);
  });
});
