import type { BuildingState } from '../../../shared/types';
import { accrueResources, hourlyRate } from '../../../shared/resources';

export { accrueResources, hourlyRate };

export function upgradeCost(level: number): { wood: number; iron: number; silver: number } {
  const next = level + 1;
  return {
    wood: 40 * next,
    iron: 20 * next,
    silver: 50 * next,
  };
}

export function upgradeDurationMs(level: number): number {
  return 30_000 * (level + 1);
}

export function isBuildingBusy(building: BuildingState, nowMs: number): boolean {
  return building.upgradeCompletesAt !== null && building.upgradeCompletesAt > nowMs;
}

export function completeUpgradeIfDue(
  building: BuildingState,
  nowMs: number,
): BuildingState {
  if (building.upgradeCompletesAt !== null && building.upgradeCompletesAt <= nowMs) {
    return {
      ...building,
      level: building.level + 1,
      upgradeCompletesAt: null,
    };
  }
  return building;
}
