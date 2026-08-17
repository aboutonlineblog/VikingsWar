import type { RegeneratingPool } from '@shared/types';

export const ENERGY_INTERVAL_MS = 5 * 60 * 1000;
export const STAMINA_INTERVAL_MS = 15 * 60 * 1000;

export function xpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function previewRegenPool(
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

export function msUntilNextTick(pool: RegeneratingPool, intervalMs: number, nowMs = Date.now()): number {
  if (pool.current >= pool.max) {
    return 0;
  }
  const elapsed = Math.max(0, nowMs - pool.lastUpdatedAt);
  const remainder = intervalMs - (elapsed % intervalMs);
  return remainder === 0 ? intervalMs : remainder;
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (value >= 10_000) {
    return `${Math.round(value / 1000)}k`;
  }
  return value.toLocaleString();
}

export function upgradeCost(level: number): { wood: number; iron: number; silver: number } {
  const next = level + 1;
  return {
    wood: 40 * next,
    iron: 20 * next,
    silver: 50 * next,
  };
}
