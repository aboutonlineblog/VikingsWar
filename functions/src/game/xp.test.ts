import { applyXp, baseStatsForLevel, xpToNextLevel } from './xp';

describe('xpToNextLevel', () => {
  it('scales with level', () => {
    expect(xpToNextLevel(1)).toBe(100);
    expect(xpToNextLevel(4)).toBe(800);
  });
});

describe('baseStatsForLevel', () => {
  it('includes speed that scales with level', () => {
    expect(baseStatsForLevel(1)).toEqual({ health: 100, attack: 14, defense: 11, speed: 10 });
    expect(baseStatsForLevel(2).speed).toBe(12);
  });
});

describe('applyXp', () => {
  it('levels up when the threshold is reached', () => {
    const result = applyXp(1, 90, 20);
    expect(result.level).toBe(2);
    expect(result.xp).toBe(10);
    expect(result.levelsGained).toBe(1);
  });

  it('can gain multiple levels from a large grant', () => {
    const result = applyXp(1, 0, 100 + 282);
    expect(result.level).toBeGreaterThanOrEqual(2);
    expect(result.levelsGained).toBeGreaterThanOrEqual(1);
  });
});
