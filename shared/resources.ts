import type {
  BuildingDef,
  BuildingId,
  BuildingState,
  Currencies,
} from './types';

export const HOUR_MS = 60 * 60 * 1000;

export const COLLECTABLE_RESOURCES = ['silver', 'food', 'wood', 'iron', 'runes'] as const;

export type CollectableResource = (typeof COLLECTABLE_RESOURCES)[number];

export interface PendingResource {
  key: CollectableResource;
  amount: number;
}

export function hourlyRate(
  building: BuildingState,
  def: BuildingDef,
): Partial<Currencies> {
  if (building.level <= 0 || !def.produces) {
    return {};
  }
  const produced: Partial<Currencies> = {};
  (Object.keys(def.produces) as Array<keyof Currencies>).forEach((key) => {
    const base = def.produces?.[key as keyof typeof def.produces];
    if (typeof base === 'number') {
      produced[key] = base * def.perLevelRate * building.level;
    }
  });
  return produced;
}

function addRates(
  totals: Partial<Currencies>,
  rates: Partial<Currencies>,
  hours: number,
): void {
  (Object.keys(rates) as Array<keyof Currencies>).forEach((key) => {
    const amount = rates[key] ?? 0;
    totals[key] = (totals[key] ?? 0) + Math.floor(amount * hours);
  });
}

export function accrueResources(
  buildings: Record<BuildingId, BuildingState>,
  defs: BuildingDef[],
  lastCollectedAt: number,
  nowMs: number,
): Partial<Currencies> {
  const totals: Partial<Currencies> = {};
  const defsById = Object.fromEntries(defs.map((def) => [def.id, def]));

  (Object.keys(buildings) as BuildingId[]).forEach((id) => {
    const def = defsById[id];
    const building = buildings[id];
    if (!def || !building) {
      return;
    }
    if (building.upgradeCompletesAt && building.upgradeCompletesAt > nowMs) {
      return;
    }
    if (building.upgradeCompletesAt && building.upgradeCompletesAt <= nowMs) {
      const hoursAfter =
        Math.max(0, nowMs - Math.max(lastCollectedAt, building.upgradeCompletesAt)) / HOUR_MS;
      addRates(
        totals,
        hourlyRate({ ...building, level: building.level + 1 }, def),
        hoursAfter,
      );
      return;
    }
    const hours = Math.max(0, nowMs - lastCollectedAt) / HOUR_MS;
    addRates(totals, hourlyRate(building, def), hours);
  });

  return totals;
}

export function pendingResourceEntries(pending: Partial<Currencies>): PendingResource[] {
  return COLLECTABLE_RESOURCES.filter((key) => (pending[key] ?? 0) > 0).map((key) => ({
    key,
    amount: pending[key] ?? 0,
  }));
}

export function hasUncollected(pending: Partial<Currencies>): boolean {
  return pendingResourceEntries(pending).length > 0;
}
