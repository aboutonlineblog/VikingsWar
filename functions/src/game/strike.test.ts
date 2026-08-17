import { mitigation, resolveStrike } from './strike';
import { createRng } from './rng';

describe('strike pipeline', () => {
  it('reduces damage when defense is higher against the same attack', () => {
    const attacker = { attack: 50 };
    const lowDef = resolveStrike(attacker, { defense: 10 }, createRng(3));
    const highDef = resolveStrike(attacker, { defense: 80 }, createRng(3));
    expect(lowDef.hit).toBe(true);
    expect(highDef.hit).toBe(true);
    expect(highDef.damage).toBeLessThan(lowDef.damage);
  });

  it('increases damage when attack is higher against the same defense', () => {
    const defender = { defense: 30 };
    const lowAtk = resolveStrike({ attack: 20 }, defender, createRng(8));
    const highAtk = resolveStrike({ attack: 70 }, defender, createRng(8));
    expect(highAtk.damage).toBeGreaterThan(lowAtk.damage);
  });

  it('always hits with default accuracy and dodge', () => {
    const roll = resolveStrike({ attack: 40 }, { defense: 10 }, createRng(1));
    expect(roll.hit).toBe(true);
    expect(roll.damage).toBeGreaterThanOrEqual(1);
  });

  it('can miss when dodge is high', () => {
    const miss = resolveStrike(
      { attack: 40, accuracy: 100 },
      { defense: 10, dodge: 100 },
      { next: () => 0.5 },
    );
    expect(miss).toEqual({ hit: false, damage: 0, critical: false });
  });

  it('uses ATK-aware mitigation between 0 and 1', () => {
    expect(mitigation(50, 0)).toBe(0);
    expect(mitigation(50, 50)).toBeGreaterThan(0.3);
    expect(mitigation(50, 50)).toBeLessThan(0.6);
    expect(mitigation(80, 20)).toBeLessThan(mitigation(20, 80));
  });
});
