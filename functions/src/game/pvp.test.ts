import { pvpEligibility, silverStolen } from './pvp';

describe('pvpEligibility', () => {
  const now = 10_000_000;

  it('allows a fair fight', () => {
    const result = pvpEligibility({
      attackerLevel: 10,
      defenderLevel: 12,
      nowMs: now,
      protectionUntil: 0,
      attacksToday: 0,
      attacksResetAt: now + 1000,
      lastAttackAt: 0,
      dailyLimit: 10,
      cooldownMs: 60_000,
      levelBand: 5,
    });
    expect(result).toEqual({ ok: true });
  });

  it('blocks protected defenders', () => {
    const result = pvpEligibility({
      attackerLevel: 10,
      defenderLevel: 10,
      nowMs: now,
      protectionUntil: now + 1,
      attacksToday: 0,
      attacksResetAt: now + 1000,
      lastAttackAt: 0,
      dailyLimit: 10,
      cooldownMs: 60_000,
      levelBand: 5,
    });
    expect(result).toEqual({ ok: false, reason: 'protected' });
  });

  it('blocks level-band mismatches', () => {
    const result = pvpEligibility({
      attackerLevel: 5,
      defenderLevel: 20,
      nowMs: now,
      protectionUntil: 0,
      attacksToday: 0,
      attacksResetAt: now + 1000,
      lastAttackAt: 0,
      dailyLimit: 10,
      cooldownMs: 60_000,
      levelBand: 5,
    });
    expect(result).toEqual({ ok: false, reason: 'level_band' });
  });

  it('blocks daily attack cap', () => {
    const result = pvpEligibility({
      attackerLevel: 10,
      defenderLevel: 10,
      nowMs: now,
      protectionUntil: 0,
      attacksToday: 10,
      attacksResetAt: now + 1000,
      lastAttackAt: 0,
      dailyLimit: 10,
      cooldownMs: 60_000,
      levelBand: 5,
    });
    expect(result).toEqual({ ok: false, reason: 'daily_limit' });
  });

  it('allows revenge against a protected defender', () => {
    const result = pvpEligibility({
      attackerLevel: 10,
      defenderLevel: 10,
      nowMs: now,
      protectionUntil: now + 1,
      attacksToday: 0,
      attacksResetAt: now + 1000,
      lastAttackAt: 0,
      dailyLimit: 10,
      cooldownMs: 60_000,
      levelBand: 5,
      defenderUid: 'attacker-uid',
      attackerRevengeFrom: ['attacker-uid'],
    });
    expect(result).toEqual({ ok: true });
  });
});

describe('silverStolen', () => {
  it('takes 10 percent capped at 250', () => {
    expect(silverStolen(1000)).toBe(100);
    expect(silverStolen(10_000)).toBe(250);
  });
});
