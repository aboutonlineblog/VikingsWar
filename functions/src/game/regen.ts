import type { RegeneratingPool } from '../../../shared/types';

export const ENERGY_INTERVAL_MS = 5 * 60 * 1000;
export const STAMINA_INTERVAL_MS = 15 * 60 * 1000;
export const DEFAULT_ENERGY_MAX = 100;
export const DEFAULT_STAMINA_MAX = 20;

export function regeneratePool(
  pool: RegeneratingPool,
  nowMs: number,
  intervalMs: number,
  amountPerTick = 1,
): RegeneratingPool {
  if (pool.current >= pool.max) {
    return {
      current: pool.max,
      max: pool.max,
      lastUpdatedAt: nowMs,
    };
  }

  const elapsed = Math.max(0, nowMs - pool.lastUpdatedAt);
  const ticks = Math.floor(elapsed / intervalMs);
  if (ticks <= 0) {
    return pool;
  }

  const current = Math.min(pool.max, pool.current + ticks * amountPerTick);
  const lastUpdatedAt =
    current >= pool.max ? nowMs : pool.lastUpdatedAt + ticks * intervalMs;

  return {
    current,
    max: pool.max,
    lastUpdatedAt,
  };
}

export function spendPool(
  pool: RegeneratingPool,
  cost: number,
  nowMs: number,
  intervalMs: number,
): RegeneratingPool {
  const regenerated = regeneratePool(pool, nowMs, intervalMs);
  if (regenerated.current < cost) {
    throw new Error('INSUFFICIENT_POOL');
  }
  return {
    ...regenerated,
    current: regenerated.current - cost,
  };
}
