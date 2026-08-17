import type { Rng } from './rng';

export const DEFAULT_ACCURACY = 100;
export const DEFAULT_DODGE = 0;
export const DEFAULT_CRIT_CHANCE = 0.1;
export const DEFAULT_CRIT_DAMAGE = 1.5;
export const MITIGATION_K = 40;
export const MIN_HIT_CHANCE = 5;
export const MAX_HIT_CHANCE = 100;
export const VARIANCE_MIN = 0.85;
export const VARIANCE_MAX = 1.15;

export interface StrikeStats {
  attack: number;
  defense: number;
  accuracy?: number;
  dodge?: number;
  critChance?: number;
  critDamage?: number;
}

export interface StrikeResult {
  hit: boolean;
  damage: number;
  critical: boolean;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function hitChance(attacker: StrikeStats, defender: StrikeStats): number {
  const accuracy = attacker.accuracy ?? DEFAULT_ACCURACY;
  const dodge = defender.dodge ?? DEFAULT_DODGE;
  return clamp(accuracy - dodge, MIN_HIT_CHANCE, MAX_HIT_CHANCE) / 100;
}

export function mitigation(attack: number, defense: number): number {
  const atk = Math.max(0, attack);
  const def = Math.max(0, defense);
  return def / (def + atk + MITIGATION_K);
}

export function resolveStrike(
  attacker: StrikeStats,
  defender: StrikeStats,
  rng: Rng,
  actionPower = 1,
): StrikeResult {
  if (rng.next() >= hitChance(attacker, defender)) {
    return { hit: false, damage: 0, critical: false };
  }
  const power = Math.max(0, attacker.attack) * actionPower;
  const base = power * (1 - mitigation(attacker.attack, defender.defense));
  const span = VARIANCE_MAX - VARIANCE_MIN;
  const variance = VARIANCE_MIN + rng.next() * span;
  const critChance = attacker.critChance ?? DEFAULT_CRIT_CHANCE;
  const critDamage = attacker.critDamage ?? DEFAULT_CRIT_DAMAGE;
  const critical = rng.next() < critChance;
  const damage = Math.max(1, Math.round(base * variance * (critical ? critDamage : 1)));
  return { hit: true, damage, critical };
}
