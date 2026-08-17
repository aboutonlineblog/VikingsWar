export interface PvpEligibilityInput {
  attackerLevel: number;
  defenderLevel: number;
  nowMs: number;
  protectionUntil: number;
  attacksToday: number;
  attacksResetAt: number;
  lastAttackAt: number;
  dailyLimit: number;
  cooldownMs: number;
  levelBand: number;
  defenderUid?: string;
  attackerRevengeFrom?: string[];
}

export type PvpBlockReason =
  | 'protected'
  | 'daily_limit'
  | 'cooldown'
  | 'level_band'
  | 'self';

export function resetDailyAttacks(
  attacksToday: number,
  attacksResetAt: number,
  nowMs: number,
): { attacksToday: number; attacksResetAt: number } {
  if (nowMs >= attacksResetAt) {
    const nextReset = nowMs + 24 * 60 * 60 * 1000;
    return { attacksToday: 0, attacksResetAt: nextReset };
  }
  return { attacksToday, attacksResetAt };
}

export function pvpEligibility(
  input: PvpEligibilityInput,
): { ok: true } | { ok: false; reason: PvpBlockReason } {
  const daily = resetDailyAttacks(
    input.attacksToday,
    input.attacksResetAt,
    input.nowMs,
  );

  const isRevenge = Boolean(
    input.defenderUid && input.attackerRevengeFrom?.includes(input.defenderUid),
  );

  if (Math.abs(input.attackerLevel - input.defenderLevel) > input.levelBand) {
    return { ok: false, reason: 'level_band' };
  }
  if (input.nowMs < input.protectionUntil && !isRevenge) {
    return { ok: false, reason: 'protected' };
  }
  if (daily.attacksToday >= input.dailyLimit) {
    return { ok: false, reason: 'daily_limit' };
  }
  if (input.nowMs - input.lastAttackAt < input.cooldownMs) {
    return { ok: false, reason: 'cooldown' };
  }
  return { ok: true };
}

export function silverStolen(defenderSilver: number): number {
  return Math.min(250, Math.floor(defenderSilver * 0.1));
}

export function isSuspiciousAttackRate(attacksInWindow: number, windowMax = 12): boolean {
  return attacksInWindow > windowMax;
}
