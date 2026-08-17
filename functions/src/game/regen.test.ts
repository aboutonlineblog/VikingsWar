import { regeneratePool, spendPool } from './regen';

describe('regeneratePool', () => {
  const interval = 5 * 60 * 1000;

  it('adds one point per elapsed interval without ticking the database', () => {
    const pool = { current: 10, max: 100, lastUpdatedAt: 0 };
    const next = regeneratePool(pool, interval * 3, interval);
    expect(next.current).toBe(13);
    expect(next.lastUpdatedAt).toBe(interval * 3);
  });

  it('caps at max and snaps lastUpdatedAt to now', () => {
    const pool = { current: 99, max: 100, lastUpdatedAt: 0 };
    const now = interval * 10;
    const next = regeneratePool(pool, now, interval);
    expect(next.current).toBe(100);
    expect(next.lastUpdatedAt).toBe(now);
  });

  it('does not regenerate when no full interval has elapsed', () => {
    const pool = { current: 10, max: 100, lastUpdatedAt: 1000 };
    const next = regeneratePool(pool, 1000 + interval - 1, interval);
    expect(next.current).toBe(10);
    expect(next.lastUpdatedAt).toBe(1000);
  });
});

describe('spendPool', () => {
  it('regenerates then spends', () => {
    const interval = 5 * 60 * 1000;
    const pool = { current: 8, max: 100, lastUpdatedAt: 0 };
    const next = spendPool(pool, 10, interval * 3, interval);
    expect(next.current).toBe(1);
  });

  it('throws when the pool is insufficient', () => {
    const pool = { current: 4, max: 100, lastUpdatedAt: 1000 };
    expect(() => spendPool(pool, 10, 1000, 1)).toThrow('INSUFFICIENT_POOL');
  });

  it('keeps leftover time toward the next tick after spending', () => {
    const interval = 5 * 60 * 1000;
    const pool = { current: 10, max: 100, lastUpdatedAt: 0 };
    const now = interval * 2 + 1_000;
    const next = spendPool(pool, 1, now, interval);
    expect(next.current).toBe(11);
    expect(next.lastUpdatedAt).toBe(interval * 2);
  });
});
