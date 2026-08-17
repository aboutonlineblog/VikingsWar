import { computeCreatureStats } from './creatureStats';

describe('computeCreatureStats', () => {
  it('matches baseline wild boar stats at level 1', () => {
    expect(computeCreatureStats(1, 'animal', 'Wild Boar')).toEqual({
      attack: 12,
      defense: 6,
      health: 38,
      speed: 7,
      staminaCost: 1,
    });
  });

  it('applies monster bonus', () => {
    const animal = computeCreatureStats(10, 'animal', 'Gray Wolf');
    const monster = computeCreatureStats(10, 'monster', 'Ash Goblin');
    expect(monster.attack).toBeGreaterThan(animal.attack);
    expect(monster.defense).toBeGreaterThan(animal.defense);
  });

  it('applies Armored defense bonus', () => {
    const base = computeCreatureStats(50, 'monster', 'Frost Goblin');
    const armored = computeCreatureStats(50, 'monster', 'Armored Frost Goblin');
    expect(armored.defense).toBeGreaterThan(base.defense);
    expect(armored.attack).toBe(base.attack);
  });

  it('applies Dire stat bonus', () => {
    const base = computeCreatureStats(21, 'animal', 'Arctic Fox');
    const dire = computeCreatureStats(21, 'animal', 'Dire Arctic Fox');
    expect(dire.attack).toBeGreaterThan(base.attack);
    expect(dire.health).toBeGreaterThan(base.health);
  });

  it('scales stamina cost with level', () => {
    expect(computeCreatureStats(1, 'animal', 'Fox').staminaCost).toBe(1);
    expect(computeCreatureStats(60, 'monster', 'Dragon').staminaCost).toBe(5);
    expect(computeCreatureStats(110, 'monster', 'Witch').staminaCost).toBe(8);
  });
});
